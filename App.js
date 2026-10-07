import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/store/CartContext';
import { StoreProvider } from './src/store/StoreContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <CartProvider>
        <StatusBar style="dark" />
        <AppNavigator />
        </CartProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
