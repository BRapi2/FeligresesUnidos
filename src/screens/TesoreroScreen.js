import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { obtenerUltimasTransaccionesIglesia, obtenerUltimosMovimientosIglesia } from '../API/transacciones';
import { obtenerUsuarioPorId } from '../API/usuarios';

const LILA = '#A084E8';
const LILA_CLARO = '#F3F0FF';
const LILA_OSCURO = '#6741D9';
const BLANCO = '#fff';
const GRIS = '#e0e7f0';
const TEXTO = '#2a2a2a';

export default function TesoreroScreen({ route, navigation }) {
  const id_usu = route?.params?.id_usu;
  const [iglesiaId, setIglesiaId] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grafico, setGrafico] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: usuarioArr } = await obtenerUsuarioPorId(id_usu);
      const usuario = Array.isArray(usuarioArr) ? usuarioArr[0] : usuarioArr;
      if (usuario && usuario.iglesias_locales_id) {
        setIglesiaId(usuario.iglesias_locales_id);
        const { data: trans } = await obtenerUltimasTransaccionesIglesia(usuario.iglesias_locales_id, 10);
        const { data: movs } = await obtenerUltimosMovimientosIglesia(usuario.iglesias_locales_id, 50); // Trae más para el mes
        setTransacciones(trans || []);
        setMovimientos(movs || []);

        // --- GRAFICO DEL MES ACTUAL ---
        // Filtra movimientos del mes actual y agrupa por día
        const now = new Date();
        const mesActual = now.getMonth();
        const anioActual = now.getFullYear();
        const movimientosMes = (movs || []).filter(m => {
          const fecha = new Date(m.fec_h_mi);
          return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
        });

        // Agrupa por día
        const dias = {};
        movimientosMes.forEach(m => {
          const fecha = new Date(m.fec_h_mi);
          const dia = fecha.getDate();
          dias[dia] = (dias[dia] || 0) + Number(m.monto_mi);
        });

        // Prepara datos para el gráfico (solo días con movimientos)
        const labels = Object.keys(dias).map(d => d.padStart(2, '0'));
        const data = Object.values(dias);

        setGrafico(labels.length > 0 ? labels.map((dia, i) => ({ dia, monto: data[i] })) : []);
      }
      setLoading(false);
    }
    if (id_usu) fetchData();
  }, [id_usu]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel del Tesorero</Text>
      {/* Botón para ir a aprobar transacciones */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TransaccionesPendientes', { tesorero_id: id_usu, iglesia_id: iglesiaId })}
      >
        <Text style={styles.buttonText}>Aprobar Transacciones Pendientes</Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Movimientos Financieros (mes actual)</Text>
        {grafico.length === 0 ? (
          <Text style={styles.emptyText}>No hay movimientos este mes.</Text>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('FiltrarGraficoFinanciero', { iglesiaId })}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={{
                  labels: grafico.map(m => m.dia),
                  datasets: [{ data: grafico.map(m => m.monto) }]
                }}
                width={Math.max(Dimensions.get('window').width - 60, grafico.length * 40)}
                height={220}
                yAxisLabel="S/"
                chartConfig={{
                  backgroundColor: LILA_CLARO,
                  backgroundGradientFrom: LILA_CLARO,
                  backgroundGradientTo: BLANCO,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(160, 132, 232, ${opacity})`,
                  labelColor: () => LILA_OSCURO,
                  style: { borderRadius: 16 },
                  propsForDots: { r: '6', strokeWidth: '2', stroke: LILA_OSCURO }
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </ScrollView>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={LILA} style={{ marginTop: 40 }} />
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
                {movimientos.slice(0, 5).map(m => (
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
  button: {
    backgroundColor: LILA,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 7,
    marginHorizontal: 20,
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
});