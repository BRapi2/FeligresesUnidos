// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
const PORT = 4000; // Puedes cambiar el puerto si lo deseas

// Reemplaza esto con tu Access Token real de MercadoPago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.use(cors());
app.use(express.json());

// Endpoint para crear preferencia de pago
app.post('/mercadopago/crear-preferencia', async (req, res) => {
  console.log('Llego una petición:', req.body);
  const { monto, descripcion, usuario_id } = req.body;
  try {
    const preference = {
      items: [
        {
          title: descripcion || 'Donación',
          unit_price: Number(monto),
          quantity: 1,
        }
      ],
      payer: {},
      back_urls: {
        success: 'https://www.google.com', // Cambia por tu URL de éxito
        failure: 'https://www.google.com', // Cambia por tu URL de fallo
        pending: 'https://www.google.com'
      },
      auto_return: 'approved',
      metadata: { usuario_id }
    };
    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
