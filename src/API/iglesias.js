import { supabase } from './supabaseClient';

export async function obtenerIglesias() {
  const { data, error } = await supabase
    .from('iglesias_locales')
    .select('id_il, anexo_il, dir_il, distritos(nombre_dis)');
  return { data, error };
}