import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, TextInput, Image, useWindowDimensions, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { C, F } from '../theme';
import { useApp } from '../context/AppContext';
import { getStores, getStoresByPin, getCategories, getCategoryCoupons, getDeals, getProducts, imgUrl, errMsg } from '../api';
import { Loader, Empty, GradButton } from '../components/ui';
import StoreTile from '../components/StoreTile';
import CouponGrid from '../components/CouponGrid';
import { CategoryTile, ProductCard } from './home/Sections';

const TitleBar = ({ title, sub }) => (
  <View style={t.bar}><Text style={t.title}>{title}</Text>{sub ? <Text style={t.sub}>{sub}</Text> : null}</View>
);
const AZ = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

/* ---- Stores tab (stores by pin code) ---- */
export function StoresScreen({ navigation }) {
  const { pinCode, openPinModal } = useApp();
  const { width } = useWindowDimensions();
  const [stores, setStores] = useState([]); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await getStores(pinCode); setStores(r.matched); } catch { setStores([]); } finally { setLoading(false); }
  }, [pinCode]);
  useEffect(() => { load(); }, [load]);
  const w = (width - 32 - 12) / 2;
  return (
    <SafeAreaView style={t.screen} edges={['top']}>
      <TitleBar title="Stores" sub={pinCode ? `Stores available for pin code ${pinCode}` : 'Set your pin code to see stores near you'} />
      {loading ? <Loader /> : (
        <FlatList data={stores} numColumns={2} keyExtractor={(i) => i._id} columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }} contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
          ListEmptyComponent={<View><Empty icon="shopping-bag" title={pinCode ? `No stores found for pin code ${pinCode}` : 'No pin code set'} sub="Try a different pin code." /><View style={{ alignItems: 'center' }}><GradButton small title="Change pin code" icon="map-pin" onPress={openPinModal} /></View></View>}
          renderItem={({ item }) => <StoreTile width={w} store={item} onPress={(s) => navigation.navigate('StoreOffers', { storeId: s._id, name: s.name, logo: s.logo })} />} />
      )}
    </SafeAreaView>
  );
}

/* ---- Categories tab ---- */
const COLORS = ['#3B84ED', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#0EA5E9', '#EF4444', '#6366F1'];
export function CategoriesScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [cats, setCats] = useState([]); const [loading, setLoading] = useState(true);
  const load = useCallback(() => { setLoading(true); getCategories().then(setCats).catch(() => setCats([])).finally(() => setLoading(false)); }, []);
  useEffect(load, [load]);
  const w = (width - 32 - 24) / 3;
  return (
    <SafeAreaView style={t.screen} edges={['top']}>
      <TitleBar title="Shopping Categories" sub="Browse coupons and deals by category" />
      {loading ? <Loader /> : (
        <FlatList data={cats} numColumns={3} keyExtractor={(i) => i._id} columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }} contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
          ListEmptyComponent={<Empty icon="grid" title="No categories found" />}
          renderItem={({ item, index }) => <CategoryTile w={w} cat={item} color={COLORS[index % COLORS.length]} onPress={(c) => navigation.navigate('CategoryCoupons', { id: c._id, title: c.title })} />} />
      )}
    </SafeAreaView>
  );
}

/* ---- All deals tab ---- */
export function AllDealsScreen() {
  const { pinCode } = useApp();
  const [deals, setDeals] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await getDeals({ pinCode }); setDeals([...r.matched, ...r.panIndia]); } catch (e) { setDeals([]); setError(errMsg(e, 'Failed to fetch deals')); } finally { setLoading(false); }
  }, [pinCode]);
  useEffect(() => { load(); }, [load]);
  return (
    <SafeAreaView style={t.screen} edges={['top']}>
      <TitleBar title="All Deals" sub={`${deals.length} deals available`} />
      <CouponGrid data={deals} loading={loading} error={error} emptyTitle="No deals found" emptySub="Check back soon." onRefresh={load} />
    </SafeAreaView>
  );
}

/* ---- Coupons of a category ---- */
export function CategoryCouponsScreen({ route }) {
  const { id } = route.params; const { pinCode } = useApp();
  const [data, setData] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setData(await getCategoryCoupons(id, pinCode)); } catch (e) { setData([]); setError(errMsg(e, 'Failed to load coupons')); } finally { setLoading(false); } }, [id, pinCode]);
  useEffect(() => { load(); }, [load]);
  return <View style={t.screen}><CouponGrid data={data} loading={loading} error={error} emptyTitle="No coupons found" emptySub="No coupons in this category yet." onRefresh={load} /></View>;
}

/* ---- Coupons & deals of a store ---- */
export function StoreOffersScreen({ route }) {
  const { storeId, name, logo } = route.params; const { pinCode } = useApp();
  const [data, setData] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await getDeals({ pinCode, storeId, type: 'Coupon,Deal' }); setData(r.matched); } catch { setData([]); setError('Failed to load coupons'); } finally { setLoading(false); }
  }, [storeId, pinCode]);
  useEffect(() => { load(); }, [load]);
  const header = (
    <View style={t.storeHead}>
      {logo ? <Image source={{ uri: imgUrl(logo) }} style={{ width: 90, height: 44 }} resizeMode="contain" /> : null}
      <Text style={t.storeTitle}>{name} Coupons & Deals</Text>
    </View>
  );
  return <View style={t.screen}><CouponGrid header={header} data={data} loading={loading} error={error} emptyTitle="No coupons found" emptySub="This store has no active offers for your area." onRefresh={load} /></View>;
}

/* ---- Deals of the Day (all products) ---- */
export function DealsOfDayScreen() {
  const { width } = useWindowDimensions();
  const [d, setD] = useState([]); const [loading, setLoading] = useState(true);
  const load = useCallback(() => { setLoading(true); getProducts().then(setD).catch(() => setD([])).finally(() => setLoading(false)); }, []);
  useEffect(load, [load]);
  const w = (width - 32 - 12) / 2;
  if (loading) return <Loader />;
  return (
    <FlatList style={t.screen} data={d} numColumns={2} keyExtractor={(i) => i._id} columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }} contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />} ListEmptyComponent={<Empty icon="package" title="No products today" />}
      renderItem={({ item }) => <View style={{ width: w }}><ProductCard item={item} /></View>} />
  );
}

/* ---- Search: stores by name with A-Z filter ---- */
export function SearchScreen({ navigation }) {
  const { pinCode, openPinModal } = useApp();
  const [q, setQ] = useState(''); const [letter, setLetter] = useState('All');
  const [stores, setStores] = useState([]); const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (!pinCode) return;
    setLoading(true); getStoresByPin(pinCode).then(setStores).catch(() => setStores([])).finally(() => setLoading(false));
  }, [pinCode]);
  const filtered = useMemo(() => stores.filter((s) => {
    const n = (s.name || '').toLowerCase();
    return (letter === 'All' || n.startsWith(letter.toLowerCase())) && (!q || n.includes(q.toLowerCase()));
  }), [stores, q, letter]);
  const w = (width - 32 - 12) / 2;
  return (
    <View style={t.screen}>
      <View style={t.searchRow}>
        <Feather name="search" size={16} color={C.faint} />
        <TextInput autoFocus value={q} onChangeText={setQ} placeholder="Search stores, coupons..." placeholderTextColor={C.faint} style={t.searchInput} returnKeyType="search" />
        {q ? <TouchableOpacity onPress={() => setQ('')}><Feather name="x" size={16} color={C.faint} /></TouchableOpacity> : null}
      </View>
      <View style={{ height: 44 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}>
          {AZ.map((l) => (
            <TouchableOpacity key={l} onPress={() => setLetter(l)} style={[t.chip, letter === l && t.chipOn]}><Text style={[t.chipTxt, letter === l && { color: '#fff' }]}>{l}</Text></TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {!pinCode ? (
        <View><Empty icon="map-pin" title="Set your pin code" sub="We need it to show stores near you." /><View style={{ alignItems: 'center' }}><GradButton small title="Enter pin code" onPress={openPinModal} /></View></View>
      ) : loading ? <Loader /> : (
        <FlatList data={filtered} numColumns={2} keyboardShouldPersistTaps="handled" keyExtractor={(i) => i._id} columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }} contentContainerStyle={{ gap: 12, paddingTop: 8, paddingBottom: 30 }}
          ListEmptyComponent={<Empty icon="search" title="No stores found" sub="Try another name or letter." />}
          renderItem={({ item }) => <StoreTile width={w} store={item} onPress={(s) => navigation.navigate('StoreOffers', { storeId: s._id, name: s.name, logo: s.logo })} />} />
      )}
    </View>
  );
}

const t = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  bar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  title: { fontFamily: F.black, fontSize: 22, color: C.navy },
  sub: { fontFamily: F.reg, fontSize: 13, color: C.muted, marginTop: 2 },
  storeHead: { alignItems: 'center', gap: 6, paddingVertical: 14 },
  storeTitle: { fontFamily: F.black, fontSize: 18, color: C.navy, textAlign: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', margin: 16, marginBottom: 10, paddingHorizontal: 14, borderRadius: 50, borderWidth: 1.5, borderColor: C.border },
  searchInput: { flex: 1, fontFamily: F.reg, fontSize: 14.5, paddingVertical: 11, color: C.text },
  chip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: C.border },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipTxt: { fontFamily: F.semi, fontSize: 12.5, color: C.text },
});
