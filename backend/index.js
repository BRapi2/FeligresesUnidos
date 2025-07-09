// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 4000; // Puedes cambiar el puerto si lo deseas

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

app.post('/test/echo', (req, res) => {
  console.log('Llamada recibida:', req.body);
  res.json({ recibido: true, body: req.body });
});

// Endpoint para crear preferencia de pago
app.post('/mercadopago/crear-preferencia', async (req, res) => {
  console.log('Llamada recibida:', req.body);

  if (!req.body || !req.body.monto || !req.body.descripcion || !req.body.usuario_id || !req.body.iglesia_id) {
    console.error('Body inválido:', req.body);
    return res.status(400).json({ error: 'Body inválido o faltan campos requeridos' });
  }
  const { monto, descripcion, usuario_id, iglesia_id } = req.body;
  try {
    // 1. Crea la preferencia de MercadoPago
    const preference = {
      items: [{ title: descripcion || 'Donación', unit_price: Number(monto), quantity: 1 }],
      payer: {},
      back_urls: {
        success: 'https://www.google.com',
        failure: 'https://www.google.com',
        pending: 'https://www.google.com'
      },
      auto_return: 'approved',
      metadata: { usuario_id }
    };
    const response = await mercadopago.preferences.create(preference);

    // 2. Inserta en Supabase (sin ID_TRANS ni NUM_TRANS)
    console.log('Intentando insertar en Supabase:', {
      usuario_id, iglesia_id, monto, descripcion
    }); // <-- LOG 2
    const { data: insertData, error } = await supabase
      .from('transacciones')
      .insert([{
        usuario_id: usuario_id,
        iglesia_id: iglesia_id,
        monto_trans: monto,
        tipo_aport_trans: descripcion,
        metodo_pago: 'mercadopago',
        estado_pago: 'pendiente'
      }])
      .select(); // <-- Esto pide que retorne el registro insertado
    if (error) {
      console.error('Error al registrar en Supabase:', error);
    } else {
      console.log('Transacción registrada en Supabase:', insertData); // <-- LOG 3
    }

    res.json({ init_point: response.body.init_point });
  } catch (err) {
    console.error('Error general:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
