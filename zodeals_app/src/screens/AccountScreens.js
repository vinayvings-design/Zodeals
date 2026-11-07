import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert, FlatList, RefreshControl, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { C, F, shadow } from '../theme';
import { useApp } from '../context/AppContext';
import { getProfile, updateProfile, getWishlist, getNotifications, createAgent, getContactInfo, imgUrl, errMsg } from '../api';
import { VENDOR_URL, SUPPORT_EMAIL } from '../config';
import { GradButton, OutlineButton, Loader, Empty, Field, Banner } from '../components/ui';
import CouponGrid from '../components/CouponGrid';
import { PAGES } from '../content/pages';

const NeedLogin = ({ navigation, what }) => (
  <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center' }}>
    <Empty icon="lock" title="Please sign in" sub={`Sign in to see your ${what}.`} />
    <View style={{ alignItems: 'center', gap: 10 }}>
      <GradButton title="Sign in" onPress={() => navigation.navigate('Login')} style={{ width: 200 }} />
      <OutlineButton title="Create account" onPress={() => navigation.navigate('Signup')} style={{ width: 200 }} />
    </View>
  </View>
);

/* ---------------- Account tab ---------------- */
const Row = ({ icon, label, onPress, color = C.navy, badge }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={ac.row}>
    <View style={ac.ic}><Feather name={icon} size={17} color={color === C.danger ? C.danger : C.primary} /></View>
    <Text style={[ac.rowTxt, { color }]}>{label}</Text>
    {badge ? <View style={ac.badge}><Text style={ac.badgeTxt}>{badge}</Text></View> : null}
    <Feather name="chevron-right" size={17} color="#D1D5DB" />
  </TouchableOpacity>
);
export function AccountScreen({ navigation }) {
  const { isLoggedIn, signOut, openPinModal, pinCode, notifCount } = useApp();
  const [name, setName] = useState('');
  const [info, setInfo] = useState({});
  useEffect(() => { getContactInfo().then((d) => setInfo(d && !Array.isArray(d) ? d : {})).catch(() => {}); }, []);
  useFocusEffect(useCallback(() => { if (isLoggedIn) getProfile().then((p) => setName(p?.name || '')).catch(() => {}); }, [isLoggedIn]));
  const logout = () => Alert.alert('Log out', 'Are you sure you want to log out?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log out', style: 'destructive', onPress: async () => { await signOut(); } }]);
  const page = (p) => () => navigation.navigate('Page', { page: p });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={ac.head}>
          <View style={ac.av}><Feather name="user" size={26} color={C.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={ac.name}>{isLoggedIn ? (name || 'My account') : 'Welcome to ZoDeals'}</Text>
            <Text style={ac.subtxt}>{isLoggedIn ? 'Manage your profile and favourites' : 'Sign in to save deals and get notified'}</Text>
          </View>
        </View>
        {!isLoggedIn ? (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            <View style={{ flex: 1 }}><GradButton title="Sign in" onPress={() => navigation.navigate('Login')} /></View>
            <View style={{ flex: 1 }}><OutlineButton title="Sign up" onPress={() => navigation.navigate('Signup')} /></View>
          </View>
        ) : null}
        <View style={ac.group}>
          {isLoggedIn ? <><Row icon="user" label="My profile" onPress={() => navigation.navigate('Profile')} />
            <Row icon="heart" label="Favourites" onPress={() => navigation.navigate('Favorites')} />
            <Row icon="bell" label="Notifications" badge={notifCount > 0 ? String(notifCount) : null} onPress={() => navigation.navigate('Notifications')} /></> : null}
          <Row icon="map-pin" label={pinCode ? `Pin code: ${pinCode}` : 'Set pin code'} onPress={openPinModal} />
          <Row icon="package" label="Deals of the Day" onPress={() => navigation.navigate('DealsOfDay')} />
        </View>
        <View style={ac.group}>
          <Row icon="shopping-bag" label="Merchant Partnership" onPress={() => Linking.openURL(VENDOR_URL)} />
          <Row icon="users" label="Become an agent" onPress={() => navigation.navigate('AgentContact')} />
        </View>
        <View style={ac.group}>
          <Row icon="info" label="About us" onPress={page('about')} />
          <Row icon="help-circle" label="FAQs" onPress={page('faq')} />
          <Row icon="file-text" label="Terms & Conditions" onPress={page('terms')} />
          <Row icon="shield" label="Privacy Policy" onPress={page('privacy')} />
          <Row icon="rotate-ccw" label="Refund Policy" onPress={page('refund')} />
          <Row icon="dollar-sign" label="Product Pricing Policy" onPress={page('pricing')} />
        </View>
        {(info.email || info.primaryNumber || info.location) ? (
          <View style={ac.group}>
            {info.email ? <Row icon="mail" label={info.email} onPress={() => Linking.openURL(`mailto:${info.email}`)} /> : null}
            {info.primaryNumber ? <Row icon="phone" label={info.primaryNumber} onPress={() => Linking.openURL(`tel:${info.primaryNumber}`)} /> : null}
            {info.location ? <Row icon="map-pin" label={info.location} onPress={() => {}} /> : null}
          </View>
        ) : null}
        {isLoggedIn ? <View style={ac.group}>
          <Row icon="log-out" label="Log out" color={C.danger} onPress={logout} />
          <Row icon="trash-2" label="Delete account" color={C.danger} onPress={() => navigation.navigate('DeleteAccount')} />
        </View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Favourites ---------------- */
export function FavoritesScreen({ navigation }) {
  const { isLoggedIn, refreshWishlist, wishlist } = useApp();
  const [data, setData] = useState([]); const [loading, setLoading] = useState(true);
  const load = useCallback(() => { if (!isLoggedIn) { setLoading(false); return; } setLoading(true); getWishlist().then(setData).catch(() => setData([])).finally(() => setLoading(false)); }, [isLoggedIn]);
  useFocusEffect(load);
  useEffect(() => { setData((d) => d.filter((x) => wishlist.includes(x._id))); }, [wishlist]);
  if (!isLoggedIn) return <NeedLogin navigation={navigation} what="favourites" />;
  return <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 12 }}><CouponGrid data={data} loading={loading} emptyTitle="No favourites yet" emptySub="Tap the heart on any deal to save it here." onRefresh={() => { load(); refreshWishlist(); }} /></View>;
}

/* ---------------- Notifications ---------------- */
export function NotificationsScreen({ navigation }) {
  const { isLoggedIn, refreshNotifCount } = useApp();
  const [list, setList] = useState([]); const [loading, setLoading] = useState(true); const [err, setErr] = useState('');
  const load = useCallback(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    setLoading(true); setErr('');
    getNotifications().then(setList).catch((e) => setErr(e.message)).finally(() => { setLoading(false); refreshNotifCount(); });
  }, [isLoggedIn, refreshNotifCount]);
  useFocusEffect(load);
  if (!isLoggedIn) return <NeedLogin navigation={navigation} what="notifications" />;
  if (loading) return <Loader />;
  return (
    <FlatList style={{ backgroundColor: C.bg }} data={list} keyExtractor={(i, ix) => i._id || String(ix)} contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
      ListHeaderComponent={<Banner text={err} />}
      ListEmptyComponent={err ? null : <Empty icon="bell" title="No notifications" sub="You're all caught up." />}
      renderItem={({ item }) => (
        <View style={nt.card}>
          <View style={nt.ic}><Feather name="bell" size={16} color={C.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={nt.title}>{item.title}</Text>
            <Text style={nt.body}>{item.content}</Text>
            <Text style={nt.date}>{item.date ? new Date(item.date).toLocaleString() : ''}</Text>
          </View>
        </View>
      )} />
  );
}

/* ---------------- Profile ---------------- */
export function ProfileScreen({ navigation }) {
  const { isLoggedIn, role } = useApp();
  const [p, setP] = useState({ name: '', email: '', phoneNumber: '', profile: '' });
  const [edit, setEdit] = useState(false); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const [img, setImg] = useState(null); const [msg, setMsg] = useState(null);
  const load = useCallback(async () => {
    try { const d = await getProfile(); if (d?._id) setP({ name: d.name || '', email: d.email || '', phoneNumber: d.phoneNumber || '', profile: d.profile || '' }); } catch {} finally { setLoading(false); }
  }, []);
  useEffect(() => { if (isLoggedIn && role === 'user') load(); else setLoading(false); }, [isLoggedIn, role, load]);
  if (!isLoggedIn || (role && role !== 'user')) return <NeedLogin navigation={navigation} what="profile" />;
  if (loading) return <Loader />;
  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { setMsg({ t: 'error', m: 'Photo permission is needed to change your picture.' }); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!r.canceled && r.assets?.[0]) setImg(r.assets[0]);
  };
  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append('name', p.name); fd.append('email', p.email); fd.append('phoneNumber', p.phoneNumber);
      if (img) fd.append('profile', { uri: img.uri, name: img.fileName || 'profile.jpg', type: img.mimeType || 'image/jpeg' });
      await updateProfile(fd); await load(); setImg(null); setEdit(false); setMsg({ t: 'ok', m: 'Profile updated successfully' });
    } catch (e) { setMsg({ t: 'error', m: errMsg(e, 'Failed to update profile') }); } finally { setBusy(false); }
  };
  const avatar = img?.uri || (p.profile ? imgUrl(p.profile) : null);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginVertical: 14 }}>
          <TouchableOpacity disabled={!edit} onPress={pick}>
            {avatar ? <Image source={{ uri: avatar }} style={pr.av} /> : <View style={[pr.av, { backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }]}><Feather name="user" size={40} color={C.primary} /></View>}
            {edit ? <View style={pr.cam}><Feather name="camera" size={14} color="#fff" /></View> : null}
          </TouchableOpacity>
        </View>
        <Banner type={msg?.t} text={msg?.m} />
        <View style={pr.card}>
          <Field label="Name" value={p.name} onChangeText={(v) => setP({ ...p, name: v })} editable={edit} />
          <Field label="Email" value={p.email} onChangeText={(v) => setP({ ...p, email: v })} editable={edit} autoCapitalize="none" keyboardType="email-address" />
          <Field label="Phone number" value={p.phoneNumber} onChangeText={(v) => setP({ ...p, phoneNumber: v.replace(/\D/g, '').slice(0, 10) })} editable={edit} keyboardType="number-pad" />
        </View>
        {edit ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><OutlineButton title="Cancel" onPress={() => { setEdit(false); setImg(null); setLoading(true); load(); }} /></View>
            <View style={{ flex: 1 }}><GradButton title="Save" onPress={save} loading={busy} /></View>
          </View>
        ) : <GradButton title="Edit profile" icon="edit-2" onPress={() => setEdit(true)} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- Become an agent (same form as the website) ---------------- */
export function AgentContactScreen() {
  const empty = { name: '', email: '', phoneNumber: '', pan: '', address: '', city: '', pincode: '', upi: '', reference: '' };
  const [f, setF] = useState(empty); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(null);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const submit = async () => {
    if (!f.name.trim() || !f.email.trim() || !f.phoneNumber) { setMsg({ t: 'error', m: 'Name, email and phone number are required.' }); return; }
    setBusy(true); setMsg(null);
    try { const r = await createAgent(f); setMsg({ t: 'ok', m: r?.data?.displayMessage || 'Agent Created Successfully' }); setF(empty); }
    catch (e) { setMsg({ t: 'error', m: e?.response?.data?.displayMessage || e?.response?.data?.message || 'Something went wrong' }); } finally { setBusy(false); }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontFamily: F.black, fontSize: 22, color: C.navy, marginBottom: 14 }}>Become an Agent</Text>
        <Banner type={msg?.t} text={msg?.m} />
        <View style={pr.card}>
          <Field label="Name *" value={f.name} onChangeText={set('name')} />
          <Field label="Email *" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
          <Field label="Phone Number *" value={f.phoneNumber} onChangeText={(v) => set('phoneNumber')(v.replace(/\D/g, '').slice(0, 10))} keyboardType="number-pad" />
          <Field label="PAN" value={f.pan} onChangeText={set('pan')} autoCapitalize="characters" />
          <Field label="Address" value={f.address} onChangeText={set('address')} />
          <Field label="City" value={f.city} onChangeText={set('city')} />
          <Field label="Pincode" value={f.pincode} onChangeText={(v) => set('pincode')(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" />
          <Field label="UPI" value={f.upi} onChangeText={set('upi')} autoCapitalize="none" />
          <Field label="Reference" value={f.reference} onChangeText={set('reference')} />
        </View>
        <GradButton title="Submit" onPress={submit} loading={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


/* ---------------- Delete account (request, handled by email) ---------------- */
export function DeleteAccountScreen() {
  const { isLoggedIn } = useApp();
  const [email, setEmail] = useState('');
  useEffect(() => { if (isLoggedIn) getProfile().then((d) => setEmail(d?.email || '')).catch(() => {}); }, [isLoggedIn]);
  const request = () => {
    const subject = encodeURIComponent('Account deletion request');
    const body = encodeURIComponent(`Please delete my ZoDeals account and the personal data linked to it.\n\nRegistered email: ${email}\n`);
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`).catch(() => Alert.alert('No email app found', `Please email ${SUPPORT_EMAIL} from your registered address with the subject "Account deletion request".`));
  };
  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
      <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Feather name="trash-2" size={26} color={C.danger} />
      </View>
      <Text style={pp.title}>Delete your account</Text>
      <Text style={[pp.p, { marginTop: 8 }]}>You can ask us to delete your ZoDeals account and the personal data linked to it: your name, email address, phone number, profile photo, favourites and comments.</Text>
      <Text style={pp.h}>How it works</Text>
      <Text style={[pp.p, { marginTop: 8 }]}>Tap the button below. It opens an email to {SUPPORT_EMAIL} with your registered email filled in. Send it, and we will check the request comes from you and then delete your account and its personal data. We may keep limited information where the law requires it.</Text>
      <View style={{ marginTop: 22 }}>
        <GradButton title="Request account deletion" icon="mail" onPress={request} />
      </View>
    </ScrollView>
  );
}

/* ---------------- Policy / info pages ---------------- */
export function PageScreen({ route }) {
  const pg = PAGES[route.params.page];
  const [open, setOpen] = useState(null);
  if (!pg) return null;
  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
      <Text style={pp.title}>{pg.title}</Text>
      {pg.faq ? (
        <>
          <Text style={[pp.p, { marginBottom: 14 }]}>{pg.intro}</Text>
          {pg.faq.map((x, i) => (
            <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setOpen(open === i ? null : i)} style={pp.acc}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[pp.q, { flex: 1 }]}>{x.q}</Text>
                <Feather name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
              </View>
              {open === i ? <Text style={[pp.p, { marginTop: 8 }]}>{x.a}</Text> : null}
            </TouchableOpacity>
          ))}
        </>
      ) : pg.blocks.slice(1).map((b, i) => (
        b.k === 'h' || b.k === 'b' ? <Text key={i} style={pp.h}>{b.t}</Text>
          : b.k === 'li' ? <View key={i} style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}><Text style={pp.p}>•</Text><Text style={[pp.p, { flex: 1 }]}>{b.t}</Text></View>
          : <Text key={i} style={[pp.p, { marginTop: 8 }]}>{b.t}</Text>
      ))}
    </ScrollView>
  );
}

const ac = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18, marginTop: 6 },
  av: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: F.black, fontSize: 19, color: C.navy },
  subtxt: { fontFamily: F.reg, fontSize: 12.5, color: C.muted, marginTop: 2 },
  group: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, overflow: 'hidden', ...shadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  ic: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  rowTxt: { flex: 1, fontFamily: F.semi, fontSize: 14.5 },
  badge: { backgroundColor: C.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeTxt: { color: '#fff', fontSize: 11, fontFamily: F.bold },
});
const nt = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, ...shadow },
  ic: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.bold, fontSize: 14, color: C.text },
  body: { fontFamily: F.reg, fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 19 },
  date: { fontFamily: F.reg, fontSize: 11, color: C.faint, marginTop: 6 },
});
const pr = StyleSheet.create({
  av: { width: 100, height: 100, borderRadius: 50 },
  cam: { position: 'absolute', right: 0, bottom: 0, backgroundColor: C.primary, borderRadius: 14, padding: 7 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, ...shadow },
});
const pp = StyleSheet.create({
  title: { fontFamily: F.black, fontSize: 24, color: C.navy, marginBottom: 6 },
  h: { fontFamily: F.bold, fontSize: 16.5, color: C.navy, marginTop: 18 },
  p: { fontFamily: F.reg, fontSize: 14, color: C.muted, lineHeight: 21 },
  q: { fontFamily: F.bold, fontSize: 14.5, color: C.text },
  acc: { borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 10 },
});
