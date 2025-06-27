import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ProfileScreen() {
  // Aquí luego se mostrarán datos reales del usuario y sus transacciones
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Nombre:</Text>
        <Text>Juan Pérez</Text>
        <Text style={styles.label}>Correo:</Text>
        <Text>juan@email.com</Text>
      </View>
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 24, width: '100%' },
  label: { fontWeight: 'bold', marginTop: 8 },
  subtitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold'},
});
  