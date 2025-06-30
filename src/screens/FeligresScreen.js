
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { guardarTarjeta } from '../API/tarjetas';
import { Picker } from '@react-native-picker/picker';


export default function FeligresScreen({ route, navigation }) {
  React.useEffect(() => {
    console.log('route.params:', route && route.params ? route.params : 'NO PARAMS');
  }, [route]);

  const usuario_id = route?.params?.id_usu;

  const [titular, setTitular] = useState('');
  const [numero, setNumero] = useState('');
  const [fecha, setFecha] = useState('');
  const [marca, setMarca] = useState('Visa');
  const [modalVisible, setModalVisible] = useState(false);

  const handleGuardar = async () => {
    // Verifica que usuario_id exista y sea válido
    if (!usuario_id) {
      console.error('usuario_id no recibido:', usuario_id);
      Alert.alert('Error', 'No se encontró el usuario. Vuelve a iniciar sesión.');
      return;
    }
    if (!titular || !numero || !fecha || numero.length < 16) {
      Alert.alert('Error', 'Completa todos los campos y verifica el número');
      return;
    }
    const ultimos4 = numero.slice(-4);
    const numero_encriptado = numero; // En producción, cifra este valor

    console.log('usuario_id usado para guardar tarjeta:', usuario_id);

    const { error } = await guardarTarjeta({
      usuario_id,
      titular_tarjeta: titular,
      numero_tarjeta_encriptado: numero_encriptado,
      fecha_expiracion: fecha,
      ultimos4,
      marca
    });

    if (error) {
      console.error('Error al guardar tarjeta:', error);
      Alert.alert('Error', 'No se pudo guardar la tarjeta');
    } else {
      Alert.alert('Éxito', 'Tarjeta guardada correctamente');
      setTitular('');
      setNumero('');
      setFecha('');
      setMarca('Visa');
      setModalVisible(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel del Feligres</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Mis Transacciones</Text>
        <Text>- Donación: $100</Text>
        <Text>- Diezmo: $50</Text>
        <Text>- Ofrenda: $30</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Mensaje del día:</Text>
        <Text>"Dios es amor y quien permanece en amor, permanece en Dios."</Text>
      </View>

      {/* Botón para mostrar el modal */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Agregar Tarjeta</Text>
      </TouchableOpacity>

      {/* Modal con el formulario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.subtitle}>Agregar Tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="Titular"
              value={titular}
              onChangeText={setTitular}
            />
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              maxLength={16}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de expiración (YYYY-MM-DD)"
              value={fecha}
              onChangeText={setFecha}
            />
            <Picker
              selectedValue={marca}
              style={styles.input}
              onValueChange={(itemValue) => setMarca(itemValue)}
            >
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="Mastercard" value="Mastercard" />
            </Picker>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5 }]} onPress={handleGuardar}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5, backgroundColor: '#aaa' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Donación</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Diezmo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Ofrenda</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PerfilFeligres', { id_usu: usuario_id })}
      >
        <Text style={styles.buttonText}>Ver Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 24, width: '100%' },
  subtitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' },
});