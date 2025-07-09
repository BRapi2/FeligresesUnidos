import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { registrarUsuario } from '../API/usuarios'; //NO TOCAR DEJALO ASI
import { obtenerIglesias } from '../API/iglesias';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [emailPrincipal, setEmailPrincipal] = useState('');
  const [password, setPassword] = useState('');
  const [iglesiaId, setIglesiaId] = useState('');
  const rol = 'feligres';
  const [iglesias, setIglesias] = useState([]);
  const [loadingIglesias, setLoadingIglesias] = useState(true);

  React.useEffect(() => {
    obtenerIglesias().then(({ data, error }) => {
      if (!error && data) {
        setIglesias(data);
      }
      setLoadingIglesias(false);
    });
  }, []);

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
    //const ID_USU = (rol[0].toUpperCase() || 'F') + Math.floor(100000 + Math.random() * 900000);

    const usuario = {
      dni_usu: dni,
      nom_usu: nombre,
      ape_usu: apellido,
      tel_usu: telefono,
      email_usu: email,
      email_principal_usu: emailPrincipal || email,
      contra_hash_usu: password, // En producción, hashea la contraseña
      iglesias_locales_id: iglesiaId || null,
      rol_usu: rol,
      crea_usu: null,
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
      {/* Picker para iglesia */}
      <View style={{ marginBottom: 18, borderRadius: 12, overflow: 'hidden', backgroundColor: LILA_CLARO, borderWidth: 1, borderColor: GRIS }}>
        {loadingIglesias ? (
          <Text style={{ padding: 12, color: '#888' }}>Cargando iglesias...</Text>
        ) : (
          <Picker
            selectedValue={iglesiaId}
            onValueChange={setIglesiaId}
            style={{ color: TEXTO, backgroundColor: 'transparent' }}
          >
            <Picker.Item label="Selecciona tu iglesia" value="" />
            {iglesias.map(ig => (
              <Picker.Item
                key={ig.id_il}
                label={`${ig.anexo_il} - ${ig.distritos?.nombre_dis || ''}`}
                value={ig.id_il}
              />
            ))}
          </Picker>
        )}
      </View>
      {/* El campo de rol ya no se muestra ni se puede editar */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const LILA = '#A084E8';
const LILA_OSCURO = '#6741D9';
const LILA_CLARO = '#F3F0FF';
const TEXTO = '#2a2a2a';
const GRIS = '#e0e7f0';
const BLANCO = '#fff';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: LILA_CLARO,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 28,
    textAlign: 'center',
    color: LILA_OSCURO,
    letterSpacing: 0.5,
    marginTop: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: GRIS,
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    backgroundColor: LILA_CLARO,
    color: TEXTO,
    fontSize: 16,
  },
  button: {
    backgroundColor: LILA,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: BLANCO,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  link: {
    color: LILA,
    marginTop: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});