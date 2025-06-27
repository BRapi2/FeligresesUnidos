import { supabase } from './supabaseClient';

export async function registrarUsuario(usuario) {
  try {
    const { data, error } = await supabase
      .from('USUARIOS')
      .insert([usuario])
      .select();

    if (error) {
      console.error('⚠️ Error al insertar en Supabase:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('🛑 Error registrando usuario:', error);
    return { data: null, error };
  }
}
