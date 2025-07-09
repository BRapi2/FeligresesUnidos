import React, { useState, useEffect } from 'react';
import { View, Text, Picker, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { obtenerMovimientosFiltrados } from '../API/transacciones'; // Debes crear esta función

const LILA = '#A084E8';
const LILA_CLARO = '#F3F0FF';
const LILA_OSCURO = '#6741D9';
const BLANCO = '#fff';

export default function FiltrarGraficoFinancieroScreen({ route }) {
  const { iglesiaId } = route.params;
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [tipo, setTipo] = useState('');
  const [grafico, setGrafico] = useState([]);

  const filtrarGrafico = async () => {
    // Llama a tu API para obtener los movimientos filtrados
    const { data } = await obtenerMovimientosFiltrados(iglesiaId, mes, anio, tipo);
    setGrafico(data || []);
  };

  useEffect(() => {
    filtrarGrafico();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: LILA_CLARO }}>
      <Text style={styles.title}>Gráfico Financiero</Text>
      {/* Filtros */}
      <View style={styles.filtros}>
        <Picker selectedValue={mes} onValueChange={setMes} style={styles.picker}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Picker.Item key={i} label={new Date(0, i).toLocaleString('es-PE', { month: 'long' })} value={i} />
          ))}
        </Picker>
        <Picker selectedValue={anio} onValueChange={setAnio} style={styles.picker}>
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return <Picker.Item key={year} label={year.toString()} value={year} />;
          })}
        </Picker>
        <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
          <Picker.Item label="Todos" value="" />
          <Picker.Item label="Diezmo" value="diezmo" />
          <Picker.Item label="Donación" value="donacion" />
          <Picker.Item label="Ofrenda" value="ofrenda" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={filtrarGrafico}>
          <Text style={styles.buttonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </View>
      {/* Gráfico */}
      {grafico.length === 0 ? (
        <Text style={{ color: '#888', marginTop: 20, textAlign: 'center' }}>No hay datos para mostrar.</Text>
      ) : (
        <BarChart
          data={{
            labels: grafico.map(m => m.dia),
            datasets: [{ data: grafico.map(m => m.monto) }]
          }}
          width={400}
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
          style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: 'bold', color: LILA_OSCURO, textAlign: 'center', marginVertical: 18 },
  filtros: { margin: 16, backgroundColor: BLANCO, borderRadius: 16, padding: 16 },
  picker: { marginBottom: 10 },
  button: { backgroundColor: LILA, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: BLANCO, fontWeight: 'bold', fontSize: 16 },
});
