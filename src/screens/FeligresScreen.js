import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function FeligresScreen() {
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Donación</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Diezmo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Ofrenda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
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
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});