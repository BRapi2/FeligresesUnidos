import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { insertarTransaccion } from '../API/transacciones';

const URL_BACKEND = "https://feligresesunidos-nl4l.onrender.com";

export default function PagoMercadoPagoScreen({ route, navigation }) {
  // Cambia los nombres para que coincidan con los params reales
  const { monto, descripcion, id_usu, iglesia_id } = route.params;
  const [url, setUrl] = useState(null);

  useEffect(() => {
    fetch(`${URL_BACKEND}/mercadopago/crear-preferencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monto,
        descripcion,
        usuario_id: id_usu, // usa el nombre correcto
        iglesia_id
      })
    })
      .then(res => res.json())
      .then(data => setUrl(data.init_point));
  }, []);

  if (!url) {
    return <ActivityIndicator size="large" color="#A084E8" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#A084E8" />}
        onNavigationStateChange={async navState => {
          if (navState.url.includes('success')) {
            // Guardar transacción en Supabase
            await insertarTransaccion({
              usuario_id: id_usu, // usa el nombre correcto
              iglesia_id,
              monto,
              tipo_aport_trans: descripcion, // O ajusta según tu lógica de tipo
              descripcion
            });
            navigation.replace('ConfirmacionPago', { exito: true });
          }
          if (navState.url.includes('failure') || navState.url.includes('pending')) {
            navigation.replace('ConfirmacionPago', { exito: false });
          }
        }}
      />
    </View>
  );
}
