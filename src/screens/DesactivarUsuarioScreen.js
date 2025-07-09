import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { obtenerUsuarios, DesactivarUsuario, ActivarUsuario } from '../API/usuarios';

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
              // Actualiza el estado local
              setUsuarios(usuarios.map(u => u.id_usu === id_usu ? { ...u, activo_usu: false } : u));
              Alert.alert('Éxito', 'Usuario desactivado');
            }
          }
        }
      ]
    );
  };

  const handleActivar = (id_usu) => {
    Alert.alert(
      'Confirmar activación',
      `¿Seguro que deseas activar al usuario ${id_usu}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar',
          style: 'default',
          onPress: async () => {
            const { error } = await ActivarUsuario(id_usu);
            if (error) {
              Alert.alert('Error', 'No se pudo activar el usuario');
            } else {
              setUsuarios(usuarios.map(u => u.id_usu === id_usu ? { ...u, activo_usu: true } : u));
              Alert.alert('Éxito', 'Usuario activado');
            }
          }
        }
      ]
    );
  };

  const LILA = '#A084E8';
  const LILA_OSCURO = '#6741D9';
  const LILA_CLARO = '#F3F0FF';
  const TEXTO = '#2a2a2a';
  const GRIS = '#e0e7f0';
  const BLANCO = '#fff';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: LILA_CLARO,
      padding: 0,
      alignItems: 'stretch',
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
    input: {
      borderWidth: 1,
      borderColor: GRIS,
      borderRadius: 12,
      padding: 14,
      marginHorizontal: 20,
      marginBottom: 18,
      backgroundColor: LILA_CLARO,
      color: TEXTO,
      fontSize: 16,
    },
    usuarioItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: BLANCO,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: LILA,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 2,
    },
    usuarioText: {
      color: TEXTO,
      fontSize: 16,
      fontWeight: '500',
    },
    desactivarBtn: {
      backgroundColor: '#d9534f',
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 8,
      marginLeft: 8,
      shadowColor: '#d9534f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 2,
    },
    activarBtn: {
      backgroundColor: '#5cb85c',
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 8,
      marginLeft: 8,
      shadowColor: '#5cb85c',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 2,
    },
    flatList: {
      paddingBottom: 30,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activar/Desactivar Usuario</Text>
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
            <Text style={styles.usuarioText}>
              {item.id_usu} - {item.nom_usu} {item.ape_usu} {item.activo_usu === false ? '(Inactivo)' : ''}
            </Text>
            {item.activo_usu === false ? (
              <TouchableOpacity
                style={styles.activarBtn}
                onPress={() => handleActivar(item.id_usu)}
              >
                <Text style={{ color: '#fff' }}>Activar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.desactivarBtn}
                onPress={() => handleDesactivar(item.id_usu)}
              >
                <Text style={{ color: '#fff' }}>Desactivar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
}