import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { obtenerHistorialTransacciones } from '../API/transacciones';

export default function HistorialTransaccionesScreen({ route }) {
  const usuario_id = route.params.usuario_id;
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [transacciones, setTransacciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  const buscar = (nuevoTipo = tipo, nuevaFecha = fecha) => {
    obtenerHistorialTransacciones(usuario_id, nuevoTipo, nuevaFecha).then(({ data }) => setTransacciones(data || []));
  };

  useEffect(() => { buscar(); }, []);

  // Cuando el usuario selecciona una fecha
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      // Formatea la fecha a YYYY-MM-DD
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      setFecha(`${yyyy}-${mm}-${dd}`);
    }
  };

  // Traducción para mostrar el tipo en texto amigable
  const tipoLabel = tipo === 'donacion'
    ? 'Donación'
    : tipo === 'diezmo'
    ? 'Diezmo'
    : tipo === 'ofrenda'
    ? 'Ofrenda'
    : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Transacciones</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Filtrar</Text>
      </TouchableOpacity>

      {/* Filtros activos */}
      {(tipo || fecha) && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: '#2a4d69', fontWeight: 'bold' }}>
            Filtrando por:
            {tipoLabel ? ` ${tipoLabel}` : ''}
            {tipoLabel && fecha ? ' | ' : ''}
            {fecha ? ` ${fecha}` : ''}
          </Text>
        </View>
      )}

      {/* Modal de filtros */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.subtitle}>Filtrar transacciones</Text>
            <Text style={styles.label}>Tipo de transacción</Text>
            <Picker
              selectedValue={tipo}
              style={styles.input}
              onValueChange={setTipo}
            >
              <Picker.Item label="Todas" value="" />
              <Picker.Item label="Donación" value="donacion" />
              <Picker.Item label="Diezmo" value="diezmo" />
              <Picker.Item label="Ofrenda" value="ofrenda" />
            </Picker>
            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: 'center', height: 48 }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: fecha ? '#222' : '#888' }}>
                {fecha ? fecha : 'Selecciona una fecha'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 5 }]}
                onPress={() => {
                  setModalVisible(false);
                  buscar();
                }}
              >
                <Text style={styles.buttonText}>Aplicar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginLeft: 5, backgroundColor: '#aaa' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.tableHeader}>
        <Text style={styles.th}>Tipo</Text>
        <Text style={styles.th}>Monto</Text>
        <Text style={styles.th}>Fecha</Text>
      </View>
      <FlatList
        data={transacciones}
        keyExtractor={item => item.id_trans}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.td}>{item.tipo_aport_trans}</Text>
            <Text style={styles.td}>${item.monto_trans}</Text>
            <Text style={styles.td}>{item.fec_h_trans?.slice(0, 10)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 8 }}>No hay resultados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7fafd' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#2a4d69' },
  button: { backgroundColor: '#4B9CD3', padding: 10, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 4, marginTop: 8 },
  th: { flex: 1, fontWeight: 'bold', color: '#4B9CD3', fontSize: 14 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderColor: '#eee' },
  td: { flex: 1, fontSize: 13, color: '#333' },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' },
  subtitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#4B9CD3', fontSize: 15 },
  input: { borderWidth: 1, borderColor: '#b3c6e7', borderRadius: 8, padding: 12, backgroundColor: '#fff', marginBottom: 12 },
});