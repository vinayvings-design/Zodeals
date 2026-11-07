import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { AppProvider, useApp } from './src/context/AppContext';
import Navigation from './src/navigation';

SplashScreen.preventAutoHideAsync().catch(() => {});

class Boundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}><Text style={{ fontSize: 16, textAlign: 'center' }}>Something went wrong. Please restart the app.</Text></View>;
    }
    return this.props.children;
  }
}

function Root() {
  const { ready } = useApp();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });
  const onLayout = useCallback(() => { if (ready && fontsLoaded) SplashScreen.hideAsync().catch(() => {}); }, [ready, fontsLoaded]);
  if (!ready || !fontsLoaded) return null;
  return <View style={{ flex: 1 }} onLayout={onLayout}><Navigation /></View>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Boundary><AppProvider><Root /></AppProvider></Boundary>
    </SafeAreaProvider>
  );
}
