import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function AdminScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Gestión de Usuarios</Text>
        <Text>- Crear cuentas de pastores y tesoreros</Text>
        <Text>- Bloquear cuentas</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Administración de Iglesias</Text>
        <Text>- Ver todas las iglesias</Text>
        <Text>- Administrar cargos y fondos</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Bloquear Usuario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 24, width: '100%' },
  subtitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});