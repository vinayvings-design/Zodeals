import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { C, F, GRAD, shadow } from '../../theme';
import { useApp } from '../../context/AppContext';
import {
  getStores, getStoreDealCount, getDeals, getProducts, viewProduct, getCategories, getCategoryCoupons,
  getLatestDeals, getHomeCoupons, imgUrl,
} from '../../api';
import { PARTNER_URL } from '../../config';
import { SectionHeader, GradButton, OutlineButton, Loader } from '../../components/ui';
import CouponCard from '../../components/CouponCard';
import StoreTile from '../../components/StoreTile';

function useLoad(fn, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let off = false; setLoading(true);
    Promise.resolve().then(fn).then((d) => { if (!off) setData(d); }).catch(() => { if (!off) setData([]); }).finally(() => { if (!off) setLoading(false); });
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [data, loading];
}

const hList = { paddingHorizontal: 16, gap: 12, alignItems: 'stretch' };

/* ---------- Featured stores ---------- */
export function FeaturedStores() {
  const nav = useNavigation(); const { pinCode } = useApp();
  const [stores, loading] = useLoad(async () => {
    const { matched, panIndia } = await getStores(pinCode);
    const list = matched.length ? matched : panIndia;
    const counts = {};
    await Promise.allSettled(list.slice(0, 20).map(async (st) => { try { const c = await getStoreDealCount(st._id); if (c !== undefined) counts[st._id] = c; } catch {} }));
    return list.slice(0, 20).map((st) => ({ ...st, _count: counts[st._id] }));
  }, [pinCode]);
  if (!loading && !(stores || []).length) return null;
  return (
    <View style={sec.wrap}>
      <SectionHeader title="Featured Stores" sub={pinCode ? `Near ${pinCode}` : 'Top brands for you'} onMore={() => nav.navigate('Tabs', { screen: 'Stores' })} />
      {loading ? <Loader pad={20} /> : (
        <FlatList data={stores} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hList} keyExtractor={(i) => i._id}
          renderItem={({ item }) => <StoreTile width={118} store={item} count={item._count} onPress={(st) => nav.navigate('StoreOffers', { storeId: st._id, name: st.name, logo: st.logo })} />} />
      )}
    </View>
  );
}

/* ---------- generic horizontal coupon row ---------- */
function CouponRow({ title, sub, data, loading, onMore }) {
  const nav = useNavigation();
  if (!loading && !(data || []).length) return null;
  const body = loading ? <Loader pad={20} /> : (
    <FlatList data={data} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hList} keyExtractor={(i) => i._id}
      renderItem={({ item }) => <CouponCard width={158} item={item} onPress={(c) => nav.navigate('CouponDetail', { coupon: c })} />} />
  );
  const head = <SectionHeader title={title} sub={sub} onMore={onMore} />;
  return <View style={sec.wrap}>{head}{body}</View>;
}

export function TopDeals() {
  const nav = useNavigation(); const { pinCode } = useApp();
  const [d, l] = useLoad(async () => { const r = await getDeals({ pinCode }); return [...r.matched, ...r.panIndia]; }, [pinCode]);
  return <CouponRow title="Top Deals" sub="Best offers right now" data={(d || []).slice(0, 12)} loading={l} onMore={() => nav.navigate('Tabs', { screen: 'AllDeals' })} />;
}
export function GrabDeals() {
  const nav = useNavigation(); const { pinCode } = useApp();
  const [d, l] = useLoad(async () => { const r = await getDeals({ pinCode }); return [...r.matched, ...r.panIndia]; }, [pinCode]);
  const rest = (d || []).slice(12, 30);
  return <CouponRow title="Grab the Deals" sub="Limited-time picks" data={rest.length ? rest : (d || []).slice(0, 12).reverse()} loading={l}
    onMore={() => nav.navigate('Tabs', { screen: 'AllDeals' })} />;
}
export function LatestDeals() {
  const nav = useNavigation(); const { pinCode } = useApp();
  const [d, l] = useLoad(() => getLatestDeals(pinCode), [pinCode]);
  return <CouponRow title="Latest Deals" sub="Freshly added" data={d} loading={l} onMore={() => nav.navigate('Tabs', { screen: 'AllDeals' })} />;
}
export function CouponsSection() {
  const nav = useNavigation(); const { pinCode } = useApp();
  const [d, l] = useLoad(() => getHomeCoupons(pinCode), [pinCode]);
  return <CouponRow title="Coupons & Offers" sub="Copy a code and save" data={d} loading={l} onMore={() => nav.navigate('Tabs', { screen: 'AllDeals' })} />;
}

/* ---------- Deals of the day (products) ---------- */
export const ProductCard = ({ item }) => {
  const off = item.discountPercentage || 0;
  const price = item.finalPrice != null ? item.finalPrice : Math.round((item.price || 0) - ((item.price || 0) * off) / 100);
  const open = async () => { await viewProduct(item._id); if (item.link) Linking.openURL(item.link).catch(() => {}); };
  return (
    <View style={[pc.card]}>
      <View style={pc.img}>
        {off ? <LinearGradient colors={GRAD} style={pc.badge}><Text style={pc.badgeTxt}>{off}% OFF</Text></LinearGradient> : null}
        {item.image ? <Image source={{ uri: imgUrl(item.image) }} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> : <Feather name="package" size={34} color={C.faint} />}
      </View>
      <View style={{ padding: 10, flex: 1 }}>
        <Text style={pc.title} numberOfLines={2}>{item.title || item.description}</Text>
        {item.storeName ? <Text style={pc.store}>By {item.storeName}</Text> : null}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <Text style={pc.price}>₹{Number(price || 0).toLocaleString('en-IN')}</Text>
          {off ? <Text style={pc.mrp}>₹{Number(item.price || 0).toLocaleString('en-IN')}</Text> : null}
        </View>
      </View>
      <TouchableOpacity onPress={open} activeOpacity={0.85} style={{ margin: 10, marginTop: 0 }}>
        <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={pc.cta}><Text style={pc.ctaTxt}>View Deal →</Text></LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
export function DealsOfDay() {
  const nav = useNavigation();
  const [d, l] = useLoad(getProducts, []);
  if (!l && !(d || []).length) return null;
  return (
    <View style={sec.wrap}>
      <SectionHeader title="Deals of the Day" sub="Hand-picked products" onMore={() => nav.navigate('DealsOfDay')} />
      {l ? <Loader pad={20} /> : (
        <FlatList data={d.slice(0, 10)} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hList} keyExtractor={(i) => i._id}
          renderItem={({ item }) => <View style={{ width: 170 }}><ProductCard item={item} /></View>} />
      )}
    </View>
  );
}

/* ---------- Categories with coupon counts ---------- */
const CAT_COLORS = ['#3B84ED', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#0EA5E9', '#EF4444', '#6366F1'];
export const CategoryTile = ({ cat, count, color, onPress, w }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(cat)} style={[ct.tile, w ? { width: w } : null]}>
    <View style={[ct.icon, { backgroundColor: `${color}18` }]}>
      {cat.image ? <Image source={{ uri: imgUrl(cat.image) }} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Feather name="grid" size={22} color={color} />}
    </View>
    <Text style={ct.name} numberOfLines={2}>{cat.title}</Text>
    {count != null ? <Text style={ct.count}>{count} {count === 1 ? 'offer' : 'offers'}</Text> : null}
  </TouchableOpacity>
);
export function CategoriesSection() {
  const nav = useNavigation(); const { pinCode } = useApp();
  const [cats, loading] = useLoad(async () => {
    const list = await getCategories();
    const counts = await Promise.all(list.map((c) => getCategoryCoupons(c._id).then((r) => r.length).catch(() => 0)));
    return list.map((c, i) => ({ ...c, _count: counts[i] }));
  }, [pinCode]);
  if (!loading && !(cats || []).length) return null;
  return (
    <View style={sec.wrap}>
      <SectionHeader title="Shop by Category" sub="Find offers you love" onMore={() => nav.navigate('Tabs', { screen: 'Categories' })} />
      {loading ? <Loader pad={20} /> : (
        <FlatList data={cats} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hList} keyExtractor={(i) => i._id}
          renderItem={({ item, index }) => <CategoryTile w={120} cat={item} count={item._count} color={CAT_COLORS[index % CAT_COLORS.length]} onPress={(c) => nav.navigate('CategoryCoupons', { id: c._id, title: c.title })} />} />
      )}
    </View>
  );
}

/* ---------- Banners ---------- */
export function MerchantBanner() {
  const nav = useNavigation();
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
      <LinearGradient colors={['#0F1B35', '#1a3060']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={bn.box}>
        <Text style={bn.kicker}>FOR BUSINESSES</Text>
        <Text style={bn.title}>Grow your store with ZoDeals</Text>
        <Text style={bn.sub}>Reach thousands of local shoppers. Become a merchant partner today.</Text>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <GradButton small title="Become a partner" icon="briefcase" onPress={() => Linking.openURL(PARTNER_URL)} />
          <TouchableOpacity onPress={() => nav.navigate('Page', { page: 'pricing' })} style={bn.link}><Text style={bn.linkTxt}>Pricing policy</Text></TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
export function FavBanner() {
  const nav = useNavigation(); const { isLoggedIn } = useApp();
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
      <View style={[bn.box, { backgroundColor: C.tint, borderWidth: 1, borderColor: C.tintBorder }]}>
        <Text style={[bn.title, { color: C.navy }]}>Save the deals you love</Text>
        <Text style={[bn.sub, { color: C.muted }]}>{isLoggedIn ? 'Open your favourites to see everything you saved.' : 'Sign in to build your favourites list and get notified.'}</Text>
        <View style={{ marginTop: 12, alignSelf: 'flex-start' }}>
          <GradButton small title={isLoggedIn ? 'My favourites' : 'Sign in'} icon={isLoggedIn ? 'heart' : 'log-in'} onPress={() => nav.navigate(isLoggedIn ? 'Favorites' : 'Login')} />
        </View>
      </View>
    </View>
  );
}

const sec = StyleSheet.create({ wrap: { marginBottom: 26 } });
const pc = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden', ...shadow, flex: 1 },
  img: { height: 118, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', padding: 6 },
  badge: { position: 'absolute', top: 8, left: 8, zIndex: 2, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { color: '#fff', fontFamily: F.black, fontSize: 10.5 },
  title: { fontFamily: F.bold, fontSize: 12.5, color: C.text, lineHeight: 17, minHeight: 34 },
  store: { fontFamily: F.reg, fontSize: 11, color: C.muted, marginTop: 2 },
  price: { fontFamily: F.black, fontSize: 15, color: C.navy },
  mrp: { fontFamily: F.reg, fontSize: 11.5, color: C.faint, textDecorationLine: 'line-through' },
  cta: { borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontFamily: F.black, fontSize: 12 },
});
const ct = StyleSheet.create({
  tile: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', ...shadow },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontFamily: F.bold, fontSize: 12, color: C.text, textAlign: 'center', minHeight: 30, lineHeight: 15 },
  count: { fontFamily: F.reg, fontSize: 11, color: C.muted, marginTop: 2 },
});
const bn = StyleSheet.create({
  box: { borderRadius: 20, padding: 20 },
  kicker: { fontFamily: F.bold, fontSize: 11, color: '#7CC8FF', letterSpacing: 1 },
  title: { fontFamily: F.black, fontSize: 19, color: '#fff', marginTop: 4 },
  sub: { fontFamily: F.reg, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 6, lineHeight: 19 },
  link: { paddingVertical: 9, paddingHorizontal: 6, justifyContent: 'center' },
  linkTxt: { color: '#fff', fontFamily: F.semi, fontSize: 13, textDecorationLine: 'underline' },
});
