import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { C, F, GRAD } from '../theme';
import { useApp } from '../context/AppContext';
import { VENDOR_URL } from '../config';
import HeroCarousel from './home/HeroCarousel';
import { FeaturedStores, TopDeals, DealsOfDay, CategoriesSection, GrabDeals, LatestDeals, CouponsSection, MerchantBanner, FavBanner } from './home/Sections';

export function AppHeader({ navigation, autoFocusSearch }) {
  const { pinCode, openPinModal, notifCount, isLoggedIn, refreshNotifCount } = useApp();
  useFocusEffect(useCallback(() => { refreshNotifCount(); }, [refreshNotifCount]));
  return (
    <View style={h.wrap}>
      <View style={h.top}>
        <Image source={require('../../assets/logo.png')} style={{ width: 118, height: 34 }} resizeMode="contain" />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={openPinModal} style={h.pin}>
          <Feather name="map-pin" size={13} color={C.primary} />
          <Text style={h.pinTxt}>{pinCode || 'Pincode'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(isLoggedIn ? 'Notifications' : 'Login')} style={h.bell} hitSlop={6}>
          <Feather name="bell" size={20} color={C.navy} />
          {notifCount > 0 ? <View style={h.dot}><Text style={h.dotTxt}>{notifCount > 9 ? '9+' : notifCount}</Text></View> : null}
        </TouchableOpacity>
      </View>
      <View style={h.row}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Search')} style={h.search}>
          <Feather name="search" size={16} color={C.faint} />
          <Text style={h.searchTxt}>Search stores, coupons...</Text>
        </TouchableOpacity>
        {/* Merchant Partnership button, beside the search bar */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(VENDOR_URL)}>
          <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={h.merchant}>
            <Feather name="shopping-bag" size={14} color="#fff" />
            <Text style={h.merchantTxt}>Merchant{'\n'}Partnership</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [key, setKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshWishlist } = useApp();
  const onRefresh = async () => { setRefreshing(true); setKey((k) => k + 1); await refreshWishlist(); setTimeout(() => setRefreshing(false), 800); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <AppHeader navigation={navigation} />
      <ScrollView key={key} style={{ backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: 14, paddingBottom: 28 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={{ marginBottom: 22 }}><HeroCarousel /></View>
        <FeaturedStores />
        <TopDeals />
        <DealsOfDay />
        <CategoriesSection />
        <GrabDeals />
        <LatestDeals />
        <CouponsSection />
        <MerchantBanner />
        <FavBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const h = StyleSheet.create({
  wrap: { backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F2F7' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4, paddingBottom: 8 },
  pin: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.tint, borderRadius: 50, paddingHorizontal: 11, paddingVertical: 6 },
  pinTxt: { fontFamily: F.semi, fontSize: 12, color: C.primary },
  bell: { padding: 4 },
  dot: { position: 'absolute', top: -2, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  dotTxt: { color: '#fff', fontSize: 9, fontFamily: F.bold },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 11 },
  searchTxt: { fontFamily: F.reg, fontSize: 13.5, color: C.faint },
  merchant: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7 },
  merchantTxt: { color: '#fff', fontFamily: F.bold, fontSize: 10.5, lineHeight: 13 },
});
