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
    if (!titular || !numero || !fecha || numero.replace(/-/g, '').length < 16) {
      Alert.alert('Error', 'Completa todos los campos y verifica el número');
      return;
    }
    // Validar formato MM/YY y mes válido
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha)) {
      Alert.alert('Error', 'La fecha debe tener formato MM/YY y el mes debe ser válido (01-12)');
      return;
    }
    const ultimos4 = numero.replace(/-/g, '').slice(-4);
    const numero_encriptado = numero.replace(/-/g, ''); // Solo dígitos

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

  const LILA = '#A084E8';
  const LILA_OSCURO = '#6741D9';
  const LILA_CLARO = '#F3F0FF';
  const TEXTO = '#2a2a2a';
  const GRIS = '#e0e7f0';
  const BLANCO = '#fff';

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 0,
      alignItems: 'stretch',
      backgroundColor: LILA_CLARO,
      paddingBottom: 30,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 18,
      color: LILA_OSCURO,
      textAlign: 'center',
      marginTop: 32,
      letterSpacing: 0.5,
    },
    section: {
      marginBottom: 24,
      width: '90%',
      alignSelf: 'center',
      backgroundColor: BLANCO,
      borderRadius: 20,
      padding: 20,
      shadowColor: LILA,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 12,
      elevation: 4,
    },
    subtitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
      color: LILA,
    },
    input: {
      borderWidth: 1,
      borderColor: GRIS,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      backgroundColor: LILA_CLARO,
      color: TEXTO,
      fontSize: 16,
    },
    button: {
      backgroundColor: LILA,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginVertical: 7,
      marginHorizontal: 20,
      shadowColor: LILA,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: BLANCO,
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 0.5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: BLANCO,
      borderRadius: 18,
      padding: 24,
      width: '92%',
      shadowColor: LILA,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 6,
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: LILA_CLARO,
      paddingBottom: 4,
      marginTop: 8,
    },
    th: {
      flex: 1,
      fontWeight: 'bold',
      color: LILA,
      fontSize: 14,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 4,
      borderBottomWidth: 0.5,
      borderColor: GRIS,
    },
    td: {
      flex: 1,
      fontSize: 13,
      color: TEXTO,
    },
    smallButton: {
      backgroundColor: LILA,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginLeft: 8,
      shadowColor: LILA,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 2,
    },
  });

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
              onChangeText={text => {
                // Elimina todo lo que no sea número
                let cleaned = text.replace(/[^0-9]/g, '');
                // Limita a 16 dígitos
                if (cleaned.length > 16) cleaned = cleaned.slice(0, 16);
                // Inserta un guion cada 4 dígitos
                let formatted = cleaned.match(/.{1,4}/g)?.join('-') || '';
                setNumero(formatted);
              }}
              keyboardType="numeric"
              maxLength={19} // 16 dígitos + 3 guiones
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de expiración (MM/YY)"
              value={fecha}
              onChangeText={text => {
                // Elimina cualquier caracter que no sea número
                let cleaned = text.replace(/[^0-9]/g, '');
                // Limita a 4 dígitos (MMYY)
                if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
                // Inserta el "/" automáticamente después de los dos primeros dígitos
                let formatted = cleaned;
                if (cleaned.length > 2) {
                  formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                }
                setFecha(formatted);
              }}
              keyboardType="numeric"
              maxLength={5}
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

      {/* Botones de aportes usando Culqi */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PagoCulqi', { monto: 100, tipo: 'donacion', usuario_id })}
      >
        <Text style={styles.buttonText}>Hacer Donación</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PagoCulqi', { monto: 50, tipo: 'diezmo', usuario_id })}
      >
        <Text style={styles.buttonText}>Hacer Diezmo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PagoCulqi', { monto: 30, tipo: 'ofrenda', usuario_id })}
      >
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