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
      estado_pago: 'rechazado', // <-- usa "rechazado"
      validado_por_trans: tesorero_id,
      fec_valid_trans: new Date().toISOString(),
    })
    .eq('id_trans', id_trans);
}

export async function obtenerMovimientosFiltrados(iglesiaId, mes, anio, tipo) {
  // Implementa la consulta a Supabase filtrando por iglesia, mes, año y tipo
  // Ejemplo:
  let query = supabase
    .from('movimientos')
    .select('*')
    .eq('iglesia_id', iglesiaId);

  if (tipo) query = query.eq('tipo_mi', tipo);

  // Filtra por mes y año usando la fecha
  const fechaInicio = `${anio}-${String(mes + 1).padStart(2, '0')}-01`;
  const fechaFin = `${anio}-${String(mes + 2).padStart(2, '0')}-01`;
  query = query.gte('fec_h_mi', fechaInicio).lt('fec_h_mi', fechaFin);

  const { data, error } = await query;
  if (error) return { data: [], error };
  // Agrupa por día para el gráfico
  const dias = {};
  (data || []).forEach(m => {
    const dia = new Date(m.fec_h_mi).getDate();
    dias[dia] = (dias[dia] || 0) + Number(m.monto_mi);
  });
  const grafico = Object.keys(dias).map(dia => ({ dia, monto: dias[dia] }));
  return { data: grafico, error: null };
}