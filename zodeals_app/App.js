import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getCategories, imgUrl } from './src/api';
import { LOADER_BG_OPACITY } from './src/config';
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
  if (!ready || !fontsLoaded) return <StartupLoader />;
  return <View style={{ flex: 1 }} onLayout={onLayout}><Navigation /></View>;
}

function StartupLoader() {
  const [imgs, setImgs] = useState([]);
  useEffect(() => {
    let off = false;
    getCategories().then((c) => { if (!off) setImgs(c.filter((x) => x.image).map((x) => ({ id: x._id, uri: imgUrl(x.image) }))); }).catch(() => {});
    return () => { off = true; };
  }, []);
  return (
    <View onLayout={() => SplashScreen.hideAsync().catch(() => {})} style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      {imgs.length ? (
        <View style={{ ...StyleSheet.absoluteFillObject, flexDirection: 'row', flexWrap: 'wrap', opacity: LOADER_BG_OPACITY }}>
          {imgs.map((c) => <Image key={c.id} source={{ uri: c.uri }} style={{ width: '33.3333%', height: '16.6667%' }} resizeMode="cover" />)}
        </View>
      ) : null}
      <Image source={require('./assets/zodeals-mark.png')} style={{ width: 84, height: 84, borderRadius: 42, shadowColor: '#C8102E', shadowOpacity: 0.56, shadowRadius: 13, shadowOffset: { width: 0, height: 10 }, elevation: 12 }} resizeMode="contain" />
      <Text style={{ marginTop: 22, fontSize: 18, fontWeight: '700', color: '#0F1B35', letterSpacing: 0.4 }}>zodeals.in</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Boundary><AppProvider><Root /></AppProvider></Boundary>
    </SafeAreaProvider>
  );
}
