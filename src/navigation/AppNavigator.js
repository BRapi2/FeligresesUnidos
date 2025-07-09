import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminScreen from '../screens/AdminScreen';
import PastorScreen from '../screens/PastorScreen';
import TesoreroScreen from '../screens/TesoreroScreen';
import FeligresScreen from '../screens/FeligresScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EliminarUsuarioScreen from '../screens/DesactivarUsuarioScreen';
import DesactivarUsuarioScreen from '../screens/DesactivarUsuarioScreen';
import PerfilFeligresScreen from '../screens/PerfilFeligresScreen';
import HistorialTransaccionesScreen from '../screens/HistorialTransaccionesScreen';
import PagoCulqiScreen from '../screens/PagoCulqiScreen';
import PagoMercadoPagoScreen from '../screens/PagoMercadoPagoScreen';
import AporteScreen from '../screens/AporteScreen';
import TransaccionesPendientesScreen from '../screens/TransaccionesPendientesScreen';
import FiltrarGraficoFinancieroScreen from '../screens/FiltrarGraficoFinancieroScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Pastor" component={PastorScreen} />
        <Stack.Screen name="Tesorero" component={TesoreroScreen} />
        <Stack.Screen name="Feligres" component={FeligresScreen} />
        <Stack.Screen name="Perfil" component={ProfileScreen} />
        <Stack.Screen name="DesactivarUsuario" component={DesactivarUsuarioScreen} />
        <Stack.Screen name="PerfilFeligres" component={PerfilFeligresScreen} />
        <Stack.Screen name="HistorialTransacciones" component={HistorialTransaccionesScreen} />
        <Stack.Screen name="PagoCulqi" component={PagoCulqiScreen} />
        <Stack.Screen
          name="PagoMercadoPagoScreen"
          component={PagoMercadoPagoScreen}
          options={{ title: 'Pago MercadoPago' }}
        />
        <Stack.Screen
          name="AporteScreen"
          component={AporteScreen}
          options={{ title: 'Aporte' }}
        />
        <Stack.Screen
          name="TransaccionesPendientes"
          component={TransaccionesPendientesScreen}
          options={{ title: 'Aprobar Transacciones' }}
        />
        <Stack.Screen
          name="FiltrarGraficoFinanciero"
          component={FiltrarGraficoFinancieroScreen}
          options={{ title: 'Gráfico Financiero' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}