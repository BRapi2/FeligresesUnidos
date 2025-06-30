import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { guardarTarjeta } from '../API/tarjetas';
import { obtenerUltimasTransacciones } from '../API/transacciones';
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
  const [transacciones, setTransacciones] = useState([]);

  // Obtener las últimas 5 transacciones al cargar
  useEffect(() => {
    if (usuario_id) {
      obtenerUltimasTransacciones(usuario_id).then(({ data }) => setTransacciones(data || []));
    }
  }, [usuario_id]);

  const handleGuardar = async () => {
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
      
      {/* Sección de transacciones */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.subtitle}>Mis Transacciones</Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => navigation.navigate('HistorialTransacciones', { usuario_id })}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.th}>Tipo</Text>
          <Text style={styles.th}>Monto</Text>
          <Text style={styles.th}>Fecha</Text>
        </View>
        {transacciones.length === 0 ? (
          <Text style={{ color: '#888', marginTop: 8 }}>No hay transacciones recientes.</Text>
        ) : (
          transacciones.map(t => (
            <View key={t.id_trans} style={styles.tableRow}>
              <Text style={styles.td}>{t.tipo_aport_trans}</Text>
              <Text style={styles.td}>${t.monto_trans}</Text>
              <Text style={styles.td}>{t.fec_h_trans?.slice(0, 10)}</Text>
            </View>
          ))
        )}
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

      {/* Botones adicionales */}
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
  // Nuevos estilos para la tabla
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 4, marginTop: 8 },
  th: { flex: 1, fontWeight: 'bold', color: '#4B9CD3', fontSize: 14 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderColor: '#eee' },
  td: { flex: 1, fontSize: 13, color: '#333' },
  smallButton: { backgroundColor: '#4B9CD3', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, marginLeft: 8 },
});