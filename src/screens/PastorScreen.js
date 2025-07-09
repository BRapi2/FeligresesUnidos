import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { obtenerUltimasTransaccionesIglesia, obtenerUltimosMovimientosIglesia } from '../API/transacciones';
import { obtenerUsuarioPorId } from '../API/usuarios';

const LILA = '#A084E8';
const LILA_OSCURO = '#6741D9';
const LILA_CLARO = '#F3F0FF';
const TEXTO = '#2a2a2a';
const GRIS = '#e0e7f0';
const BLANCO = '#fff';

export default function PastorScreen({ route }) {
  console.log('PastorScreen route.params:', route?.params);
  const id_usu = route?.params?.id_usu;
  const [iglesiaId, setIglesiaId] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Obtener el iglesia_id del pastor
      const { data: usuarioArr, error: errorUsu } = await obtenerUsuarioPorId(id_usu);
      console.log('usuarioArr:', usuarioArr, 'errorUsu:', errorUsu);
      // Asegura que usuario sea un objeto, no un array
      const usuario = Array.isArray(usuarioArr) ? usuarioArr[0] : usuarioArr;
      console.log('usuario:', usuario);
      if (usuario && usuario.iglesias_locales_id) {
        console.log('iglesia_id:', usuario.iglesias_locales_id);
        setIglesiaId(usuario.iglesias_locales_id);
        // Obtener transacciones y movimientos
        const { data: trans, error: errorTrans } = await obtenerUltimasTransaccionesIglesia(usuario.iglesias_locales_id, 10);
        console.log('transacciones:', trans, 'errorTrans:', errorTrans);
        const { data: movs, error: errorMovs } = await obtenerUltimosMovimientosIglesia(usuario.iglesias_locales_id, 5);
        console.log('movimientos:', movs, 'errorMovs:', errorMovs);
        setTransacciones(trans || []);
        setMovimientos(movs || []);
      } else {
        setIglesiaId(null);
        setTransacciones([]);
        setMovimientos([]);
      }
      setLoading(false);
    }
    if (id_usu) fetchData();
  }, [id_usu]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel del Pastor</Text>
      {loading ? (
        <ActivityIndicator size="large" color={LILA} style={{ marginTop: 40 }} />
      ) : (
        <>
          {!iglesiaId && !loading ? (
            <Text style={styles.emptyText}>
              No tienes una iglesia asignada o no hay datos disponibles.
            </Text>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Últimas 10 Transacciones</Text>
                {transacciones.length === 0 ? (
                  <Text style={styles.emptyText}>No hay transacciones recientes.</Text>
                ) : (
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.th}>ID</Text>
                      <Text style={styles.th}>Tipo</Text>
                      <Text style={styles.th}>Monto</Text>
                      <Text style={styles.th}>Fecha</Text>
                    </View>
                    {transacciones.map(t => (
                      <View key={t.id_trans} style={styles.tableRow}>
                        <Text style={styles.td}>{t.id_trans}</Text>
                        <Text style={styles.td}>{t.tipo_aport_trans}</Text>
                        <Text style={styles.td}>${t.monto_trans}</Text>
                        <Text style={styles.td}>{t.fec_h_trans?.slice(0, 10)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Últimos 5 Movimientos de Iglesia</Text>
                {movimientos.length === 0 ? (
                  <Text style={styles.emptyText}>No hay movimientos recientes.</Text>
                ) : (
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.th}>ID</Text>
                      <Text style={styles.th}>Tipo</Text>
                      <Text style={styles.th}>Monto</Text>
                      <Text style={styles.th}>Fecha</Text>
                      <Text style={styles.th}>Estado</Text>
                    </View>
                    {movimientos.map(m => (
                      <View key={m.id_mi} style={styles.tableRow}>
                        <Text style={styles.td}>{m.id_mi}</Text>
                        <Text style={styles.td}>{m.tipo_mi}</Text>
                        <Text style={styles.td}>${m.monto_mi}</Text>
                        <Text style={styles.td}>{m.fec_h_mi?.slice(0, 10)}</Text>
                        <Text style={styles.td}>{m.estado_mi}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: LILA_CLARO,
    paddingBottom: 30,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: LILA_OSCURO,
    textAlign: 'center',
    marginTop: 32,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: BLANCO,
    borderRadius: 20,
    padding: 20,
    shadowColor: LILA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: LILA,
  },
  table: {
    marginTop: 8,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: LILA_CLARO,
    paddingBottom: 4,
  },
  th: {
    flex: 1,
    fontWeight: 'bold',
    color: LILA,
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: GRIS,
  },
  td: {
    flex: 1,
    fontSize: 13,
    color: TEXTO,
  },
  emptyText: {
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});