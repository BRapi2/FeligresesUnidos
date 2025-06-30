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