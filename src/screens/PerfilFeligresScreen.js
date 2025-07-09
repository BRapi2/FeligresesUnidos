import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { obtenerUsuarioPorId, actualizarUsuario } from '../API/usuarios';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilFeligresScreen({ route, navigation }) {
  const id_usu = route.params.id_usu;
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    obtenerUsuarioPorId(id_usu).then(({ data, error }) => {
      if (error) {
        Alert.alert('Error', 'No se pudo cargar el perfil');
      } else {
        setUsuario(data);
        setForm({
          nom_usu: data.nom_usu,
          ape_usu: data.ape_usu,
          tel_usu: data.tel_usu,
          email_usu: data.email_usu,
          email_principal_usu: data.email_principal_usu,
          contra_hash_usu: '',
        });
      }
    });
  }, [id_usu]);

  const handleGuardar = async () => {
    if (!form.nom_usu || !form.ape_usu || !form.tel_usu || !form.email_usu) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }
    const updateData = { ...form };
    if (!updateData.contra_hash_usu) delete updateData.contra_hash_usu;
    const { error } = await actualizarUsuario(id_usu, updateData);
    if (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } else {
      Alert.alert('Éxito', 'Perfil actualizado');
      setEditando(false);
      setUsuario({ ...usuario, ...updateData });
    }
  };

  const LILA = '#A084E8';
  const LILA_OSCURO = '#6741D9';
  const LILA_CLARO = '#F3F0FF';
  const TEXTO = '#2a2a2a';
  const GRIS = '#e0e7f0';
  const BLANCO = '#fff';

  if (!usuario) return <Text style={styles.loadingText}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hola, {usuario.nom_usu}</Text>
      </View>

      {/* Tarjeta de información */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle" size={28} color={LILA} />
          <Text style={styles.cardTitle}>Información del Perfil</Text>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>DNI</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{usuario.dni_usu}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={editando ? styles.inputActive : styles.input}
              value={form.nom_usu}
              editable={editando}
              onChangeText={v => setForm(f => ({ ...f, nom_usu: v }))}
              placeholder="Nombre"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Apellido</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="people" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={editando ? styles.inputActive : styles.input}
              value={form.ape_usu}
              editable={editando}
              onChangeText={v => setForm(f => ({ ...f, ape_usu: v }))}
              placeholder="Apellido"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={editando ? styles.inputActive : styles.input}
              value={form.tel_usu}
              editable={editando}
              onChangeText={v => setForm(f => ({ ...f, tel_usu: v }))}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={editando ? styles.inputActive : styles.input}
              value={form.email_usu}
              editable={editando}
              onChangeText={v => setForm(f => ({ ...f, email_usu: v }))}
              placeholder="Correo"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo principal</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-open" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={editando ? styles.inputActive : styles.input}
              value={form.email_principal_usu}
              editable={editando}
              onChangeText={v => setForm(f => ({ ...f, email_principal_usu: v }))}
              placeholder="Correo principal"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={editando ? styles.inputActive : styles.input}
              value={form.contra_hash_usu}
              editable={editando}
              onChangeText={v => setForm(f => ({ ...f, contra_hash_usu: v }))}
              placeholder="Nueva contraseña"
              secureTextEntry
            />
          </View>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        {editando ? (
          <>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleGuardar}
            >
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => setEditando(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => setEditando(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Sección adicional de información (opcional) */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Información Importante</Text>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={20} color={LILA} />
          <Text style={styles.infoText}>Tus datos están protegidos</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="sync" size={20} color={LILA} />
          <Text style={styles.infoText}>Actualizado por última vez: Hoy</Text>
        </View>
      </View>
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
    backgroundColor: LILA_CLARO,
    paddingBottom: 30,
  },
  loadingText: {
    marginTop: 40, 
    textAlign: 'center', 
    color: LILA,
    fontSize: 18
  },
  header: {
    backgroundColor: LILA,
    paddingVertical: 48,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 28,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BLANCO,
    textAlign: 'center',
    letterSpacing: 0.5,
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
    marginBottom: 22,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: LILA_CLARO,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: LILA_OSCURO,
    marginLeft: 12,
  },
  fieldGroup: { 
    marginBottom: 18,
  },
  label: { 
    fontWeight: '600', 
    marginBottom: 7, 
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
  inputActive: {
    borderWidth: 1.5, 
    borderColor: LILA, 
    borderRadius: 14, 
    padding: 16,
    paddingLeft: 45,
    backgroundColor: BLANCO,
    fontSize: 16,
    color: TEXTO,
    flex: 1,
  },
  readOnlyBox: { 
    borderWidth: 1, 
    borderColor: GRIS, 
    borderRadius: 14, 
    padding: 16,
    backgroundColor: LILA_CLARO,
  },
  readOnlyText: { 
    color: '#555', 
    fontSize: 16,
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  primaryButton: { 
    backgroundColor: LILA, 
    padding: 18, 
    borderRadius: 14, 
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LILA,
  },
  buttonText: { 
    color: BLANCO, 
    fontWeight: 'bold', 
    fontSize: 17,
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: LILA,
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: BLANCO,
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginTop: 10,
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