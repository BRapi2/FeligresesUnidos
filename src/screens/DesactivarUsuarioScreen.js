import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { obtenerUsuarios, DesactivarUsuario } from '../API/usuarios';

export default function DesactivarUsuarioScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    obtenerUsuarios().then(({ data, error }) => {
      if (error) {
        Alert.alert('Error', 'No se pudieron cargar los usuarios');
      } else {
        setUsuarios(data);
        setFiltrados(data);
      }
    });
  }, []);

  useEffect(() => {
    if (!busqueda) {
      setFiltrados(usuarios);
    } else {
      const filtro = usuarios.filter(
        u =>
          u.id_usu.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.nom_usu.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.ape_usu.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFiltrados(filtro);
    }
  }, [busqueda, usuarios]);

  const handleDesactivar = (id_usu) => {
    Alert.alert(
      'Confirmar desactivación',
      `¿Seguro que deseas desactivar al usuario ${id_usu}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await DesactivarUsuario(id_usu);
            if (error) {
              Alert.alert('Error', 'No se pudo desactivar el usuario');
            } else {
              setUsuarios(usuarios.filter(u => u.id_usu !== id_usu));
              Alert.alert('Éxito', 'Usuario desactivado');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desactivar Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por ID o nombre"
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <FlatList
        data={filtrados}
        keyExtractor={item => item.id_usu}
        renderItem={({ item }) => (
          <View style={styles.usuarioItem}>
            <Text>{item.id_usu} - {item.nom_usu} {item.ape_usu}</Text>
            <TouchableOpacity
              style={styles.desactivarBtn}
              onPress={() => handleDesactivar(item.id_usu)}
            >
              <Text style={{ color: '#fff' }}>Desactivar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  usuarioItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  desactivarBtn: { backgroundColor: '#d9534f', padding: 8, borderRadius: 6 }
});