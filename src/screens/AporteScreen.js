import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { obtenerUsuarioPorId } from '../API/usuarios';

const LILA = '#A084E8';
const LILA_OSCURO = '#6741D9';
const LILA_CLARO = '#F3F0FF';
const BLANCO = '#fff';

export default function AporteScreen({ route, navigation }) {
  const { tipo, usuario_id } = route.params;
  const [monto, setMonto] = useState('');
  const [ingreso, setIngreso] = useState(null);

  useEffect(() => {
    if (tipo === 'diezmo') {
      // Obtener ingreso del usuario
      obtenerUsuarioPorId(usuario_id).then(({ data }) => {
        const usuario = Array.isArray(data) ? data[0] : data;
        if (usuario && usuario.ingreso_mensual) {
          setIngreso(Number(usuario.ingreso_mensual));
          setMonto((Number(usuario.ingreso_mensual) * 0.10).toFixed(2));
        } else {
          Alert.alert('Falta información', 'Por favor, actualiza tu ingreso mensual en tu perfil.');
          navigation.goBack();
        }
      });
    }
  }, [tipo, usuario_id]);

  const handlePagar = () => {
    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    navigation.navigate('PagoMercadoPagoScreen', {
      monto: montoNum,
      descripcion: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      usuario_id
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {tipo === 'diezmo' ? 'Pagar Diezmo' : tipo === 'donacion' ? 'Hacer Donación' : 'Hacer Ofrenda'}
      </Text>
      {tipo === 'diezmo' ? (
        <>
          <Text style={styles.label}>Tu ingreso mensual registrado: S/ {ingreso}</Text>
          <Text style={styles.label}>Monto de tu diezmo (10%):</Text>
          <Text style={styles.monto}>S/ {monto}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Ingresa el monto:</Text>
          <TextInput
            style={styles.input}
            placeholder="Monto"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handlePagar}>
        <Text style={styles.buttonText}>Ir a Pagar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LILA_CLARO,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LILA_OSCURO,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: LILA_OSCURO,
    marginBottom: 8,
    textAlign: 'center',
  },
  monto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: LILA,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: LILA,
    borderRadius: 12,
    padding: 14,
    backgroundColor: BLANCO,
    color: LILA_OSCURO,
    fontSize: 18,
    width: 200,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: LILA,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    width: 200,
  },
  buttonText: {
    color: BLANCO,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
});
