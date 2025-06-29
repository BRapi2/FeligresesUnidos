import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { crearUsuario } from '../API/usuarios';
import { obtenerIglesias } from '../API/iglesias';
import { Picker } from '@react-native-picker/picker';

export default function AdminScreen({route, navigation}) {
  const idAdmin = route?.params?.id_usu;
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [emailPrincipal, setEmailPrincipal] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('pastor');
  const [iglesiaId, setIglesiaId] = useState('');
  const [iglesias, setIglesias] = useState([]);

  // Cargar iglesias al abrir el modal
  useEffect(() => {
    if (modalVisible) {
      obtenerIglesias().then(({ data, error }) => {
        if (error) {
          Alert.alert('Error', 'No se pudieron cargar las iglesias');
        } else {
          setIglesias(data);
        }
      });
    }
  }, [modalVisible]);

  const handleCrear = async () => {
    if (!dni || !nombre || !apellido || !telefono || !email || !password || !rol || !iglesiaId) {
      Alert.alert('Error', 'Completa todos los campos');
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
    const usuario = {
      dni_usu: dni,
      nom_usu: nombre,
      ape_usu: apellido,
      tel_usu: telefono,
      email_usu: email,
      email_principal_usu: emailPrincipal || email,
      contra_hash_usu: password, // En producción, hashea la contraseña
      iglesias_locales_id: iglesiaId,
      rol_usu: rol,
      crea_usu: idAdmin // Puedes poner aquí el ID del admin logueado si lo tienes
    };
    const { error } = await crearUsuario(usuario);
    if (error) {
      Alert.alert('Error', 'No se pudo crear el usuario');
      console.error(error);
    } else {
      Alert.alert('Éxito', 'Usuario creado correctamente');
      setModalVisible(false);
      setNombre('');
      setApellido('');
      setDni('');
      setTelefono('');
      setEmail('');
      setEmailPrincipal('');
      setPassword('');
      setRol('pastor');
      setIglesiaId('');
    }
  };

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
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DesactivarUsuario')}>
        <Text style={styles.buttonText}>Desactivar Usuario</Text>
      </TouchableOpacity>

      {/* Modal para crear usuario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.subtitle}>Crear Usuario</Text>
            <TextInput style={styles.input} placeholder="DNI" value={dni} onChangeText={setDni} keyboardType="numeric" maxLength={8} />
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
            <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Correo principal (opcional)" value={emailPrincipal} onChangeText={setEmailPrincipal} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <Picker selectedValue={rol} style={styles.input} onValueChange={setRol}>
              <Picker.Item label="Pastor" value="pastor" />
              <Picker.Item label="Tesorero" value="tesorero" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
            <Picker
              selectedValue={iglesiaId}
              style={styles.input}
              onValueChange={(value, index) => {
                setIglesiaId(value);
                if (value) {
                  const iglesiaSeleccionada = iglesias.find(i => i.id_il === value);
                  if (iglesiaSeleccionada) {
                    Alert.alert(
                      'Iglesia Seleccionada',
                      `${iglesiaSeleccionada.anexo_il} - ${iglesiaSeleccionada.dir_il} - ${iglesiaSeleccionada.distritos?.nombre_dis || ''}`
                    );
                  }
                }
              }}
              >
              <Picker.Item label="Selecciona una iglesia" value="" />
              {iglesias.map((iglesia) => (
                <Picker.Item
                  key={iglesia.id_il}
                  label={`${iglesia.anexo_il} - ${iglesia.dir_il} - ${iglesia.distritos?.nombre_dis || ''}`}
                  value={iglesia.id_il}
                />
              ))}
            </Picker>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5 }]} onPress={handleCrear}>
                <Text style={styles.buttonText}>Crear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5, backgroundColor: '#aaa' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' },
});