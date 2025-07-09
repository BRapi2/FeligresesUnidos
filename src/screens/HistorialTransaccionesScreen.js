import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { obtenerHistorialTransacciones } from '../API/transacciones';

const LILA = '#A084E8';
const LILA_OSCURO = '#6741D9';
const LILA_CLARO = '#F3F0FF';
const BLANCO = '#fff';
const TEXTO = '#2a2a2a';
const GRIS = '#e0e7f0';

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

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      setFecha(`${yyyy}-${mm}-${dd}`);
    }
  };

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

      {(tipo || fecha) && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: LILA_OSCURO, fontWeight: 'bold' }}>
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
              <Text style={{ color: fecha ? TEXTO : '#888' }}>
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

      <FlatList
        data={transacciones}
        keyExtractor={item => item.id_trans}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTipo}>{item.tipo_aport_trans.charAt(0).toUpperCase() + item.tipo_aport_trans.slice(1)}</Text>
            <Text style={styles.cardMonto}>S/ {item.monto_trans}</Text>
            <Text style={styles.cardFecha}>{item.fec_h_trans?.slice(0, 10)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 8 }}>No hay resultados.</Text>}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: LILA_CLARO },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, color: LILA_OSCURO, textAlign: 'center', letterSpacing: 0.5 },
  button: { backgroundColor: LILA, padding: 14, borderRadius: 12, marginBottom: 10, alignItems: 'center', shadowColor: LILA, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 },
  buttonText: { color: BLANCO, fontWeight: 'bold', textAlign: 'center', fontSize: 16, letterSpacing: 0.5 },
  card: { backgroundColor: BLANCO, borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: LILA, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 4, alignItems: 'center' },
  cardTipo: { fontWeight: 'bold', color: LILA, fontSize: 18, marginBottom: 4 },
  cardMonto: { fontSize: 22, fontWeight: 'bold', color: LILA_OSCURO, marginBottom: 2 },
  cardFecha: { fontSize: 14, color: TEXTO, opacity: 0.7 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: BLANCO, borderRadius: 18, padding: 24, width: '92%', shadowColor: LILA, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6 },
  subtitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: LILA },
  label: { fontWeight: 'bold', marginBottom: 4, color: LILA, fontSize: 15 },
  input: { borderWidth: 1, borderColor: GRIS, borderRadius: 12, padding: 14, backgroundColor: BLANCO, marginBottom: 12 },
});