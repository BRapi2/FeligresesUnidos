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

export async function loginUsuario(email, password) {
  // Busca el usuario por email y contraseña (texto plano, solo para pruebas)
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email_usu', email)
    .eq('contra_hash_usu', password)
    .eq('activo_usu', true) // Asegurarse de que el usuario esté activo
    .single();

  return { data, error };
}

export async function crearUsuario(usuario) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([usuario])
    .select();
  return { data, error };
}

export async function obtenerUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id_usu, nom_usu, ape_usu');
  return { data, error };
}

export async function eliminarUsuario(id_usu) {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id_usu', id_usu);
    if (error) console.error('Error al eliminar usuario:', error);
  return { error };
}

export async function DesactivarUsuario(id_usu) {
  const { error } = await supabase
    .from('usuarios')
    .update({activo_usu: false})
    .eq('id_usu', id_usu);
    if (error) console.error('Error al desactivar usuario:', error);
  return { error };
}
