import { supabase } from './supabaseClient';

export async function registrarUsuario(usuario) {
  try {
    const { data, error } = await supabase
      .from('USUARIOS')
      .insert([usuario])
      .select(); // Agrega .select() para obtener la respuesta
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return { data: null, error };
  }
}