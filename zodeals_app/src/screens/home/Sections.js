import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ImageBackground, Linking, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { C, F, GRAD, shadow } from '../../theme';
import { useApp } from '../../context/AppContext';
import {
  getStores, getStoreDealCount, getDeals, getProducts, viewProduct, getCategories, getCategoryCoupons,
  getLatestDeals, getHomeCoupons, getTestimonials, getContactInfo, imgUrl,
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

const hList = { paddingHorizontal: 16, gap: 12 };

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
function CouponRow({ title, sub, data, loading, onMore, bg }) {
  const nav = useNavigation();
  if (!loading && !(data || []).length) return null;
  const body = loading ? <Loader pad={20} /> : (
    <FlatList data={data} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hList} keyExtractor={(i) => i._id}
      renderItem={({ item }) => <CouponCard width={158} item={item} onPress={(c) => nav.navigate('CouponDetail', { coupon: c })} />} />
  );
  const head = <SectionHeader title={title} sub={sub} onMore={onMore} />;
  if (bg) return (
    <ImageBackground source={bg} style={sec.wrap} imageStyle={{ opacity: 0.18 }}>{head}{body}</ImageBackground>
  );
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
    onMore={() => nav.navigate('Tabs', { screen: 'AllDeals' })} bg={require('../../../assets/hero-shopping.jpg')} />;
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
    <Text style={ct.name} numberOfLines={1}>{cat.title}</Text>
    {count != null ? <Text style={ct.count}>{count} offers</Text> : null}
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
          renderItem={({ item, index }) => <CategoryTile w={112} cat={item} count={item._count} color={CAT_COLORS[index % CAT_COLORS.length]} onPress={(c) => nav.navigate('CategoryCoupons', { id: c._id, title: c.title })} />} />
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

/* ---------- Reviews ---------- */
export function Reviews() {
  const [d, l] = useLoad(getTestimonials, []);
  if (!l && !(d || []).length) return null;
  return (
    <View style={sec.wrap}>
      <SectionHeader title="What shoppers say" sub="Real reviews from ZoDeals users" />
      {l ? <Loader pad={20} /> : (
        <FlatList data={d} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hList} keyExtractor={(i, ix) => i._id || String(ix)}
          renderItem={({ item }) => (
            <View style={rv.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {item.profilePic ? <Image source={{ uri: imgUrl(item.profilePic) }} style={rv.av} /> : <View style={[rv.av, { backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }]}><Feather name="user" size={18} color={C.primary} /></View>}
                <View style={{ flex: 1 }}>
                  <Text style={rv.name} numberOfLines={1}>{item.name}</Text>
                  <Text style={rv.date}>{item.createdAt?.slice(0, 10)}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                {[1, 2, 3, 4, 5].map((n) => <Feather key={n} name="star" size={14} color={n <= (item.rating || 0) ? '#FFB400' : '#E5E7EB'} style={{ marginRight: 2 }} />)}
              </View>
              <Text style={rv.txt} numberOfLines={5}>{item.review}</Text>
            </View>
          )} />
      )}
    </View>
  );
}

/* ---------- Footer: contact info from the backend ---------- */
export function ContactFooter() {
  const nav = useNavigation();
  const [d] = useLoad(getContactInfo, []);
  const info = d && !Array.isArray(d) ? d : {};
  const socials = [['facebook', info.facebook], ['instagram', info.instagram], ['linkedin', info.linkedIn], ['twitter', info.twitter]].filter(([, u]) => u);
  const rows = [['mail', info.email, info.email && `mailto:${info.email}`], ['phone', info.primaryNumber, info.primaryNumber && `tel:${info.primaryNumber}`], ['map-pin', info.location, null]].filter(([, t]) => t);
  return (
    <View style={ft.box}>
      <Image source={require('../../../assets/logo.png')} style={{ width: 130, height: 38 }} resizeMode="contain" />
      <Text style={ft.tag}>Verified coupons and deals from stores near you.</Text>
      <View style={ft.links}>
        {[['About us', 'about'], ['FAQ', 'faq'], ['Terms', 'terms'], ['Privacy', 'privacy'], ['Refund policy', 'refund'], ['Pricing policy', 'pricing']].map(([t, p]) => (
          <TouchableOpacity key={p} onPress={() => nav.navigate('Page', { page: p })}><Text style={ft.link}>{t}</Text></TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => nav.navigate('AgentContact')}><Text style={ft.link}>Become an agent</Text></TouchableOpacity>
      </View>
      {rows.map(([ic, t, url]) => (
        <TouchableOpacity key={ic} disabled={!url} onPress={() => Linking.openURL(url)} style={ft.row}><Feather name={ic} size={14} color={C.primary} /><Text style={ft.rowTxt}>{t}</Text></TouchableOpacity>
      ))}
      {socials.length ? <View style={{ flexDirection: 'row', gap: 14, marginTop: 10 }}>{socials.map(([n, u]) => <TouchableOpacity key={n} onPress={() => Linking.openURL(u)}><Feather name={n} size={20} color={C.navy} /></TouchableOpacity>)}</View> : null}
      <Text style={ft.copy}>© {new Date().getFullYear()} ZoDeals. All rights reserved.</Text>
    </View>
  );
}

const sec = StyleSheet.create({ wrap: { marginBottom: 26 } });
const pc = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden', ...shadow, flex: 1 },
  img: { height: 118, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', padding: 6 },
  badge: { position: 'absolute', top: 8, left: 8, zIndex: 2, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { color: '#fff', fontFamily: F.black, fontSize: 10.5 },
  title: { fontFamily: F.bold, fontSize: 12.5, color: C.text, lineHeight: 17 },
  store: { fontFamily: F.reg, fontSize: 11, color: C.muted, marginTop: 2 },
  price: { fontFamily: F.black, fontSize: 15, color: C.navy },
  mrp: { fontFamily: F.reg, fontSize: 11.5, color: C.faint, textDecorationLine: 'line-through' },
  cta: { borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontFamily: F.black, fontSize: 12 },
});
const ct = StyleSheet.create({
  tile: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, padding: 12, alignItems: 'center', ...shadow },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontFamily: F.bold, fontSize: 12.5, color: C.text },
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
const rv = StyleSheet.create({
  card: { width: 260, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: C.border, ...shadow },
  av: { width: 40, height: 40, borderRadius: 20 },
  name: { fontFamily: F.bold, fontSize: 13.5, color: C.text },
  date: { fontFamily: F.reg, fontSize: 11, color: C.faint },
  txt: { fontFamily: F.reg, fontSize: 13, color: C.muted, lineHeight: 19 },
});
const ft = StyleSheet.create({
  box: { backgroundColor: '#fff', borderTopWidth: 3, borderTopColor: C.primary, padding: 20, paddingBottom: 30 },
  tag: { fontFamily: F.reg, fontSize: 13, color: C.muted, marginVertical: 10 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12 },
  link: { fontFamily: F.semi, fontSize: 13, color: C.navy },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 6 },
  rowTxt: { fontFamily: F.reg, fontSize: 13, color: C.text, flex: 1 },
  copy: { fontFamily: F.reg, fontSize: 11.5, color: C.faint, marginTop: 16 },
});
