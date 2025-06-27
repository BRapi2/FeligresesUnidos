import { supabase } from './supabaseClient';

export async function registrarUsuario(usuario) {
  try {
    console.log('Usuario a registrar:', usuario);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select();

    console.log('Respuesta Supabase:', { data, error });

    if (error && error.message) {
      console.error('⚠️ Error al insertar en Supabase:', error.message);
      throw error;
    }
    if (error) {
      console.error('⚠️ Error al insertar en Supabase:', JSON.stringify(error, null, 2));
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('🛑 Error registrando usuario:', error);
    return { data: null, error };
  }
}

