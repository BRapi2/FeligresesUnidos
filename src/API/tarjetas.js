import { supabase } from './supabaseClient';

export async function guardarTarjeta({
  usuario_id,
  titular_tarjeta,
  numero_tarjeta_encriptado,
  fecha_expiracion,
  ultimos4,
  marca
}) {
  const { data, error } = await supabase
    .from('tarjetas_usuario')
    .insert([{
      usuario_id,
      titular_tarjeta,
      numero_tarjeta_encriptado,
      fecha_expiracion,
      ultimos4,
      marca
    }])
    .select();

  return { data, error };
}