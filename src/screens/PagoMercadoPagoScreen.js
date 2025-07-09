import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PagoMercadoPagoScreen({ route, navigation }) {
  const { monto, descripcion, usuario_id } = route.params;
  const [url, setUrl] = useState(null);

  useEffect(() => {
    fetch('https://feligresesunidos-nl4l.onrender.com/mercadopago/crear-preferencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, descripcion, usuario_id })
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
        onNavigationStateChange={navState => {
          if (navState.url.includes('success')) {
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
