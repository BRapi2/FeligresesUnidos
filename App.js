import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    <StripeProvider publishableKey="TU_CLAVE_PUBLICA_STRIPE">
      <AppNavigator />
    </StripeProvider>
  );
}