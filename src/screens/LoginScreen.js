import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { loginUsuario } from '../API/usuarios';
import { Ionicons } from '@expo/vector-icons';

const LILA = '#A084E8';
const LILA_OSCURO = '#6741D9';
const LILA_CLARO = '#F3F0FF';
const TEXTO = '#2a2a2a';
const GRIS = '#e0e7f0';
const BLANCO = '#fff';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    const { data, error } = await loginUsuario(email, password);
    if (error === 'Cuenta desactivada') {
    Alert.alert('Cuenta desactivada', 'Tu cuenta ha sido desactivada. Contacta al administrador.');
  } else if (error) {
    Alert.alert('Error', 'Correo o contraseña incorrectos');
  } else {
      Alert.alert(
        '¡Bienvenido!',
        `¡Hola ${data.nom_usu}! Nos alegra verte de nuevo 😊\n\nQue tengas un excelente día en Feligreses Unidos.`
      );
      // navega segun el rol del usuario
      switch (data.rol_usu) {
        case 'feligres':
          navigation.navigate('Feligres', { 
            id_usu: data.id_usu, 
            iglesia_id: data.iglesias_locales_id // <-- asegúrate que este es el nombre correcto
          });
          break;
        case 'tesorero':
          navigation.navigate('Tesorero', { id_usu: data.id_usu });
          break;
        case 'pastor':
          navigation.navigate('Pastor', { id_usu: data.id_usu });
          break;
        case 'admin':
          navigation.navigate('Admin',{id_usu: data.id_usu});
          break;
        default:
          Alert.alert('Error', 'Rol de usuario desconocido');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Ionicons name="church" size={60} color="white" />
        <Text style={styles.headerTitle}>Feligreses Unidos</Text>
        <Text style={styles.headerSubtitle}>Bienvenido de vuelta</Text>
      </View>

      {/* Tarjeta de login */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="log-in" size={28} color={LILA} />
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>

      {/* Enlace de registro */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
      
      {/* Información adicional */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>¿Necesitas ayuda?</Text>
        <View style={styles.infoItem}>
          <Ionicons name="help-circle" size={20} color={LILA} />
          <Text style={styles.infoText}>Contacta al administrador de tu iglesia</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={20} color={LILA} />
          <Text style={styles.infoText}>Tus datos están protegidos</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: LILA_CLARO,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: LILA,
    paddingVertical: 50,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 28,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BLANCO,
    textAlign: 'center',
    marginTop: 15,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: BLANCO,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  card: {
    backgroundColor: BLANCO,
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 20,
    marginBottom: 28,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: LILA_CLARO,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: LILA_OSCURO,
    marginLeft: 10,
  },
  fieldGroup: { 
    marginBottom: 20,
  },
  label: { 
    fontWeight: '600', 
    marginBottom: 8, 
    color: LILA, 
    fontSize: 15,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: { 
    borderWidth: 1, 
    borderColor: GRIS, 
    borderRadius: 14, 
    padding: 16,
    paddingLeft: 45,
    backgroundColor: LILA_CLARO,
    fontSize: 16,
    color: TEXTO,
    flex: 1,
  },
  primaryButton: { 
    backgroundColor: LILA, 
    padding: 18, 
    borderRadius: 14, 
    alignItems: 'center',
    marginTop: 10,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: { 
    color: BLANCO, 
    fontWeight: 'bold', 
    fontSize: 17,
    letterSpacing: 0.5,
  },
  linkContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  link: { 
    color: LILA, 
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  infoCard: {
    backgroundColor: BLANCO,
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LILA_OSCURO,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#555',
    fontSize: 16,
    marginLeft: 12,
  },
});