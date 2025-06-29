import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { loginUsuario } from '../API/usuarios';

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
      Alert.alert('Éxito', `Bienvenido, ${data.nom_usu}`);
      // navega segun el rol del usuario
      switch (data.rol_usu) {
        case 'feligres':
          navigation.navigate('Feligres', { id_usu: data.id_usu });
          break;
        case 'tesorero':
          navigation.navigate('Tesorero');
          break;
        case 'pastor':
          navigation.navigate('Pastor');
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
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

// ...styles igual que antes

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#4B9CD3', marginTop: 16, textAlign: 'center' },
});