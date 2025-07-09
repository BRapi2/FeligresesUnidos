import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { obtenerTransaccionesPendientes, aprobarTransaccion } from '../API/transacciones';
import { desaprobarTransaccion } from '../API/transacciones';
import { obtenerUsuariosPorIds } from '../API/usuarios';

const LILA = '#A084E8';
const LILA_OSCURO = '#6741D9';
const LILA_CLARO = '#F3F0FF';
const BLANCO = '#fff';
const TEXTO = '#2a2a2a';

const TransaccionesPendientesScreen = ({ route }) => {
  const { tesorero_id, iglesia_id } = route.params;
  const [transacciones, setTransacciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});

  const obtenerTransacciones = async () => {
    const { data, error } = await obtenerTransaccionesPendientes(iglesia_id);
    if (!error) setTransacciones(data || []);
    else Alert.alert('Error', 'No se pudieron obtener las transacciones');
  };

  const handleAprobar = async (id_trans) => {
    const { error } = await aprobarTransaccion(id_trans, tesorero_id);
    if (!error) {
      Alert.alert('Éxito', 'Transacción aprobada');
      obtenerTransacciones();
    } else {
      Alert.alert('Error', 'No se pudo aprobar');
    }
  };

  const handleDesaprobar = async (id_trans) => {
    const { error } = await desaprobarTransaccion(id_trans, tesorero_id);
    if (!error) {
      Alert.alert('Éxito', 'Transacción desaprobada');
      obtenerTransacciones();
    } else {
      console.log('Error al desaprobar:', error); // <-- Agrega esto
      Alert.alert('Error', error.message || 'No se pudo desaprobar');
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      // 1. Obtén las transacciones
      await obtenerTransacciones();
      // 2. Cuando ya tienes las transacciones, obtén los IDs únicos
      if (transacciones.length > 0) {
        const idsUsuarios = [...new Set(transacciones.map(t => t.usuario_id))];
        // 3. Consulta los usuarios por esos IDs
        const { data: usuariosArr } = await obtenerUsuariosPorIds(idsUsuarios);
        // 4. Arma el diccionario
        const dic = {};
        (usuariosArr || []).forEach(u => { dic[u.id_usu] = u; });
        setUsuarios(dic);
      }
    };
    cargarDatos();
    // Asegúrate de que iglesia_id y transacciones estén en las dependencias si lo necesitas
  }, [iglesia_id, transacciones]);

  return (
    <ScrollView style={{ backgroundColor: LILA_CLARO, flex: 1 }}>
      <Text style={styles.title}>Transacciones Pendientes</Text>
      {transacciones.length === 0 ? (
        <Text style={styles.emptyText}>No hay transacciones pendientes.</Text>
      ) : (
        transacciones.map(trans => (
          <View key={trans.id_trans} style={styles.card}>
            <Text style={styles.tipo}>
              {trans.tipo_aport_trans.charAt(0).toUpperCase() + trans.tipo_aport_trans.slice(1)}
            </Text>
            <Text style={styles.monto}>S/ {trans.monto_trans}</Text>
            <Text style={styles.detalle}>
              Feligrés: {usuarios[trans.usuario_id]?.nom_usu || ''} {usuarios[trans.usuario_id]?.ape_usu || ''}
            </Text>
            <Text style={styles.detalle}>Fecha: {trans.fec_h_trans?.slice(0, 10)}</Text>
            <Text style={styles.estado}>
              Estado: {trans.estado_pago === 'aprobado'
                ? 'Aprobado'
                : trans.estado_pago === 'rechazado'
                ? 'Rechazado'
                : 'Pendiente'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.button} onPress={() => handleAprobar(trans.id_trans)}>
                <Text style={styles.buttonText}>Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#d9534f' }]}
                onPress={() => handleDesaprobar(trans.id_trans)}
              >
                <Text style={styles.buttonText}>Desaprobar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', color: LILA_OSCURO, textAlign: 'center', marginVertical: 18 },
  card: { backgroundColor: BLANCO, borderRadius: 18, padding: 18, margin: 14, shadowColor: LILA, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 4, alignItems: 'center' },
  tipo: { fontWeight: 'bold', color: LILA, fontSize: 18, marginBottom: 4 },
  monto: { fontSize: 22, fontWeight: 'bold', color: LILA_OSCURO, marginBottom: 2 },
  detalle: { fontSize: 15, color: TEXTO, opacity: 0.8, marginBottom: 2 },
  button: { backgroundColor: LILA, padding: 12, borderRadius: 10, marginTop: 10, width: 160, alignItems: 'center' },
  buttonText: { color: BLANCO, fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#888', marginTop: 30, textAlign: 'center' },
  estado: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
});

export default TransaccionesPendientesScreen;
