import { supabase } from './supabaseClient';

export async function obtenerUltimasTransacciones(usuario_id, limite = 5) {
  const { data, error } = await supabase
    .from('transacciones')
    .select('id_trans, tipo_aport_trans, monto_trans, fec_h_trans')
    .eq('usuario_id', usuario_id)
    .order('fec_h_trans', { ascending: false })
    .limit(limite);
  return { data, error };
}

export async function obtenerHistorialTransacciones(usuario_id, tipo = '', fecha = '') {
  let query = supabase
    .from('transacciones')
    .select('id_trans, tipo_aport_trans, monto_trans, fec_h_trans')
    .eq('usuario_id', usuario_id)
    .order('fec_h_trans', { ascending: false });

  if (tipo) query = query.eq('tipo_aport_trans', tipo);
  if (fecha) query = query.gte('fec_h_trans', fecha + ' 00:00:00').lte('fec_h_trans', fecha + ' 23:59:59');

  const { data, error } = await query;
  return { data, error };
}

export async function obtenerUltimasTransaccionesIglesia(iglesia_id, limite = 10) {
  const { data, error } = await supabase
    .from('transacciones')
    .select('id_trans, tipo_aport_trans, monto_trans, fec_h_trans, usuario_id')
    .eq('iglesia_id', iglesia_id)
    .order('fec_h_trans', { ascending: false })
    .limit(limite);
  return { data, error };
}

export async function obtenerUltimosMovimientosIglesia(iglesia_id, limite = 5) {
  // Primero obtenemos la cuenta de la iglesia
  const { data: cuentas, error: errorCuenta } = await supabase
    .from('cuentas_iglesia')
    .select('id_ci')
    .eq('iglesia_id', iglesia_id)
    .limit(1);
  if (errorCuenta || !cuentas || cuentas.length === 0) {
    return { data: [], error: errorCuenta || 'No se encontró cuenta para la iglesia' };
  }
  const cuenta_id = cuentas[0].id_ci;
  // Ahora obtenemos los movimientos de esa cuenta
  const { data, error } = await supabase
    .from('movimientos_iglesia')
    .select('id_mi, tipo_mi, monto_mi, fec_h_mi, descripcion_mi, estado_mi')
    .eq('cuenta_id', cuenta_id)
    .order('fec_h_mi', { ascending: false })
    .limit(limite);
  return { data, error };
}

export async function insertarTransaccion({ usuario_id, iglesia_id, monto, tipo_aport_trans, descripcion }) {
  // Obtener el último id_trans y num_trans existentes
  const { data: lastTrans, error: lastError } = await supabase
    .from('transacciones')
    .select('id_trans, num_trans')
    .order('fec_h_trans', { ascending: false })
    .limit(1);

  let nextIdTrans = 'TR00001';
  let nextNumTrans = 'TX-000-0001';
  if (lastTrans && lastTrans.length > 0) {
    // Extraer el número y sumarle 1
    const lastId = lastTrans[0].id_trans;
    const lastNum = lastTrans[0].num_trans;
    const idNum = parseInt(lastId.replace('TR', '')) + 1;
    const numNum = parseInt(lastNum.replace(/TX-000-0*/, '')) + 1;
    nextIdTrans = 'TR' + idNum.toString().padStart(5, '0');
    nextNumTrans = 'TX-000-' + numNum.toString().padStart(4, '0');
  }

  const { data, error } = await supabase
    .from('transacciones')
    .insert([
      {
        id_trans: nextIdTrans,
        num_trans: nextNumTrans,
        usuario_id,
        iglesia_id,
        monto_trans: monto,
        tipo_aport_trans,
        descripcion_trans: descripcion,
        fec_h_trans: new Date().toISOString()
      }
    ]);
  return { data, error };
}

export async function obtenerTransaccionesPendientes(iglesia_id) {
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('estado_pago', 'pendiente')
    .eq('iglesia_id', iglesia_id);
  return { data, error };
}

export async function aprobarTransaccion(id_trans, id_tesorero) {
  const { error } = await supabase
    .from('transacciones')
    .update({
      estado_pago: 'aprobado',
      validado_por_trans: id_tesorero,
      fec_valid_trans: new Date().toISOString()
    })
    .eq('id_trans', id_trans);
  return { error };
}

export async function desaprobarTransaccion(id_trans, tesorero_id) {
  return await supabase
    .from('transacciones')
    .update({
      estado_pago: 'rechazado',
      validado_por_trans: tesorero_id,
      fec_valid_trans: new Date().toISOString(),
    })
    .eq('id_trans', id_trans);
}

export async function obtenerMovimientosFiltrados(iglesiaId, mes, anio, tipo) {
  let query = supabase
    .from('movimientos')
    .select('*')
    .eq('iglesia_id', iglesiaId);

  if (tipo) query = query.eq('tipo_mi', tipo);

  const fechaInicio = `${anio}-${String(mes + 1).padStart(2, '0')}-01`;
  const fechaFin = `${anio}-${String(mes + 2).padStart(2, '0')}-01`;
  query = query.gte('fec_h_mi', fechaInicio).lt('fec_h_mi', fechaFin);

  const { data, error } = await query;
  if (error) return { data: [], error };
  const dias = {};
  (data || []).forEach(m => {
    const dia = new Date(m.fec_h_mi).getDate();
    dias[dia] = (dias[dia] || 0) + Number(m.monto_mi);
  });
  const grafico = Object.keys(dias).map(dia => ({ dia, monto: dias[dia] }));
  return { data: grafico, error: null };
}