import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function PastorScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel del Pastor</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Resumen de Donaciones</Text>
        <Text>Total donado este mes: $2000</Text>
        <Text>Total diezmos: $800</Text>
        <Text>Total ofrendas: $500</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver Detalle de Donaciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Administrar Feligreses</Text>
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