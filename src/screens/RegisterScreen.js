import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { registrarUsuario } from '../api/usuarios'; // Asegúrate de tener esta función

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Aquí debes adaptar los campos a los de tu tabla USUARIOS
    const usuario = {
      ID_USU: 'F' + Math.floor(100000 + Math.random() * 900000), // Ejemplo de ID
      DNI_USU: '12345678', // Debes pedir este dato en el formulario real
      NOM_USU: nombre,
      APE_USU: '', // Agrega campo en el formulario si lo necesitas
      TEL_USU: '', // Agrega campo en el formulario si lo necesitas
      EMAIL_USU: email,
      EMAIL_PRINCIPAL_USU: email,
      CONTRA_HASH_USU: password, // Idealmente deberías hashear la contraseña
      IGLESIAS_LOCALES_ID: null,
      ROL_USU: 'feligres',
      CREA_USU: null,
    };

    const { error } = await registrarUsuario(usuario);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Usuario registrado');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#4B9CD3', marginTop: 16, textAlign: 'center' },
});