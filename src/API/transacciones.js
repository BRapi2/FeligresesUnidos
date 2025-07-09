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
  const { data, error } = await supabase
    .from('transacciones')
    .insert([
      {
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