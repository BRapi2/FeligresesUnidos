import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { registrarUsuario } from '../api/usuarios';

export default function RegisterScreen({ navigation }) {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [emailPrincipal, setEmailPrincipal] = useState('');
  const [password, setPassword] = useState('');
  const [iglesiaId, setIglesiaId] = useState('');
  const [rol, setRol] = useState('feligres');

  const handleRegister = async () => {
    // Validaciones básicas
    if (!dni || !nombre || !apellido || !telefono || !email || !password || !rol) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }
    if (!/^[0-9]{8}$/.test(dni)) {
      Alert.alert('Error', 'DNI debe tener 8 dígitos');
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      Alert.alert('Error', 'Correo electrónico inválido');
      return;
    }
    // Generar ID_USU automático
    const ID_USU = (rol[0].toUpperCase() || 'F') + Math.floor(100000 + Math.random() * 900000);

    const usuario = {
      ID_USU,
      DNI_USU: dni,
      NOM_USU: nombre,
      APE_USU: apellido,
      TEL_USU: telefono,
      EMAIL_USU: email,
      EMAIL_PRINCIPAL_USU: emailPrincipal || email,
      CONTRA_HASH_USU: password, // En producción, hashea la contraseña
      IGLESIAS_LOCALES_ID: iglesiaId || null,
      ROL_USU: rol,
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput style={styles.input} placeholder="DNI (8 dígitos)" value={dni} onChangeText={setDni} keyboardType="numeric" maxLength={8} />
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Correo principal (opcional)" value={emailPrincipal} onChangeText={setEmailPrincipal} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="ID Iglesia (opcional)" value={iglesiaId} onChangeText={setIglesiaId} />
      <TextInput style={styles.input} placeholder="Rol (feligres, tesorero, pastor, admin)" value={rol} onChangeText={setRol} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#4B9CD3', marginTop: 16, textAlign: 'center' },
});