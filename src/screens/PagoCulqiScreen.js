import React from 'react';
import { View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PagoCulqiScreen({ route, navigation }) {
  const { monto, tipo, usuario_id } = route.params;

  // Reemplaza TU_LLAVE_PUBLICA por tu llave pública de Culqi
  const culqiFormHtml = `
    <html>
      <head>
        <script src="https://checkout.culqi.com/js/v4"></script>
      </head>
      <body>
        <button id="payBtn">Pagar</button>
        <script>
          document.getElementById('payBtn').onclick = function() {
            Culqi.publicKey = 'TU_LLAVE_PUBLICA';
            Culqi.settings({
              title: 'Aporte Iglesia',
              currency: 'PEN',
              description: '${tipo}',
              amount: ${monto}00
            });
            Culqi.open();
          };
          document.addEventListener('payment_event', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify(Culqi.token));
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data && data.id) {
      // Aquí deberías enviar el token a tu backend para procesar el pago y guardar la transacción en Supabase
      Alert.alert('Pago', 'Token recibido: ' + data.id);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'No se pudo procesar el pago');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: culqiFormHtml }}
        onMessage={handleMessage}
      />
    </View>
  );
}