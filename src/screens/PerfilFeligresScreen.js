import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { obtenerUsuarioPorId, actualizarUsuario } from '../API/usuarios';

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

  if (!usuario) return <Text style={{ marginTop: 40, textAlign: 'center' }}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>DNI</Text>
        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>{usuario.dni_usu}</Text>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={form.nom_usu}
          editable={editando}
          onChangeText={v => setForm(f => ({ ...f, nom_usu: v }))}
          placeholder="Nombre"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={form.ape_usu}
          editable={editando}
          onChangeText={v => setForm(f => ({ ...f, ape_usu: v }))}
          placeholder="Apellido"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={form.tel_usu}
          editable={editando}
          onChangeText={v => setForm(f => ({ ...f, tel_usu: v }))}
          placeholder="Teléfono"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={form.email_usu}
          editable={editando}
          onChangeText={v => setForm(f => ({ ...f, email_usu: v }))}
          placeholder="Correo"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Correo principal</Text>
        <TextInput
          style={styles.input}
          value={form.email_principal_usu}
          editable={editando}
          onChangeText={v => setForm(f => ({ ...f, email_principal_usu: v }))}
          placeholder="Correo principal"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={form.contra_hash_usu}
          editable={editando}
          onChangeText={v => setForm(f => ({ ...f, contra_hash_usu: v }))}
          placeholder="Nueva contraseña"
          secureTextEntry
        />
      </View>

      {editando ? (
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, alignItems: 'center', backgroundColor: '#f7fafd' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, color: '#2a4d69' },
  fieldGroup: { width: '100%', marginBottom: 14 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#4B9CD3', fontSize: 15 },
  input: { borderWidth: 1, borderColor: '#b3c6e7', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  readOnlyBox: { borderWidth: 1, borderColor: '#b3c6e7', borderRadius: 8, padding: 12, backgroundColor: '#e9eef7' },
  readOnlyText: { color: '#555', fontSize: 16 },
  button: { backgroundColor: '#4B9CD3', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 16, width: '100%' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});