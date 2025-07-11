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
    .single();
    if (error || !data) {
    return { data: null, error: 'Credenciales incorrectas' };
  }
  if (!data.activo_usu) {
    return { data: null, error: 'Cuenta desactivada' };
  }
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

export async function ActivarUsuario(id_usu) {
  const { error } = await supabase
    .from('usuarios')
    .update({ activo_usu: true })
    .eq('id_usu', id_usu);
  return { error };
}

export async function obtenerUsuarioPorId(id_usu) {
  const { data: usuarioArr, error: errorUsu } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_usu', id_usu)
    .single();
  console.log('usuarioArr:', usuarioArr, 'errorUsu:', errorUsu);
  const usuario = Array.isArray(usuarioArr) ? usuarioArr[0] : usuarioArr;
  console.log('usuario:', usuario);
  return { data: usuario, error: errorUsu };
}

export async function actualizarUsuario(id_usu, updateData) {
  const { error } = await supabase
    .from('usuarios')
    .update(updateData)
    .eq('id_usu', id_usu);
  return { error };
}

export async function actualizarIngresoMensual(id_usu, ingreso) {
  const { error } = await supabase
    .from('usuarios')
    .update({ ingreso_mensual: ingreso })
    .eq('id_usu', id_usu);
  return { error };
}

const handleGuardarIngreso = async () => {
  console.log('Intentando actualizar:', usuario.id_usu, ingresoMensual);
  const { error } = await actualizarUsuario(usuario.id_usu, { ingreso_mensual: ingresoMensual });
  if (!error) {
    Alert.alert('Éxito', 'Ingreso mensual actualizado');
  } else {
    console.log('Error al actualizar ingreso:', error);
    Alert.alert('Error', 'No se pudo actualizar: ' + (error.message || JSON.stringify(error)));
  }
};

export async function obtenerUsuariosPorIds(ids) {
  // Si ids es un array vacío, retorna vacío para evitar error
  if (!ids || ids.length === 0) return { data: [], error: null };
  return await supabase
    .from('usuarios')
    .select('id_usu, nom_usu, ape_usu')
    .in('id_usu', ids);
}