import { supabase } from './supabaseClient';

export async function registrarUsuario(usuario) {
  const { data, error } = await supabase
    .from('USUARIOS')
    .insert([usuario]);
  return { data, error };
}