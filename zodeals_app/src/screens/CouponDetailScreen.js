import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { C, F, shadow } from '../theme';
import { useApp } from '../context/AppContext';
import { getCoupon, getFeedback, sendFeedback, getComments, postComment, subscribeStore, getAllCoupons, imgUrl, errMsg } from '../api';
import { GradButton, OutlineButton, Loader, Field, Banner } from '../components/ui';
import CouponCard from '../components/CouponCard';

export default function CouponDetailScreen({ route, navigation }) {
  const base = route.params.coupon;
  const { isLoggedIn, openSignInPrompt } = useApp();
  const [c, setC] = useState(null); const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fb, setFb] = useState({ yes: 0, no: 0 }); const [answered, setAnswered] = useState(false);
  const [comments, setComments] = useState([]); const [cName, setCName] = useState(''); const [cText, setCText] = useState(''); const [cMsg, setCMsg] = useState(null);
  const [email, setEmail] = useState(''); const [nMsg, setNMsg] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let off = false;
    getCoupon(base._id).then((d) => { if (!off) setC(d); }).catch(() => {}).finally(() => { if (!off) setLoading(false); });
    getFeedback(base._id).then((d) => { if (!off) setFb(d); }).catch(() => {});
    getComments(base._id).then((d) => { if (!off) setComments(d); }).catch(() => {});
    getAllCoupons().then((d) => { if (!off) setRelated(d.filter((x) => x._id !== base._id).slice(0, 10)); }).catch(() => {});
    return () => { off = true; };
  }, [base._id]);

  const copy = useCallback(async () => {
    if (!c?.code) return;
    await Clipboard.setStringAsync(String(c.code)); setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [c]);

  const vote = async (message) => {
    if (!isLoggedIn) return openSignInPrompt();
    try { await sendFeedback(base._id, message); setAnswered(true); setFb(await getFeedback(base._id)); } catch {}
  };
  const addComment = async () => {
    if (!isLoggedIn) return openSignInPrompt();
    if (!cName.trim() || !cText.trim()) { setCMsg({ type: 'error', text: 'Please fill in both name and comment.' }); return; }
    try {
      await postComment(base._id, cName.trim(), cText.trim());
      setCMsg({ type: 'ok', text: 'Comment added successfully!' }); setCText('');
      setComments(await getComments(base._id));
    } catch (e) { setCMsg({ type: 'error', text: e?.response?.status === 401 ? 'Unauthorized. Please sign in again.' : errMsg(e, 'Failed to add comment.') }); }
  };
  const subscribe = async () => {
    const storeId = c?.storeId || base.storeId;
    if (!email || !storeId) { setNMsg({ type: 'error', text: 'Email and store ID are required.' }); return; }
    try { await subscribeStore(storeId, email); setNMsg({ type: 'ok', text: 'Email added successfully!' }); setEmail(''); }
    catch (e) { setNMsg({ type: 'error', text: errMsg(e, 'Something went wrong.') }); }
  };

  if (loading) return <Loader />;
  const d = c || base;
  const isDeal = d.type === 'Deal';
  const storeId = c?.storeId || base.storeId;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={s.card}>
          {d.logo ? <Image source={{ uri: imgUrl(d.logo) }} style={{ width: 130, height: 48 }} resizeMode="contain" /> : null}
          <Text style={s.title}>{d.title}</Text>
          <View style={s.meta}>
            {d.category?.title ? <View style={s.pill}><Feather name="tag" size={12} color={C.primary} /><Text style={s.pillTxt}>{d.category.title}</Text></View> : null}
            {d.validTill ? <View style={s.pill}><Feather name="clock" size={12} color={C.primary} /><Text style={s.pillTxt}>Expires {new Date(d.validTill).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View> : null}
          </View>

          {isDeal ? (
            <View style={s.deal}><Feather name="check-circle" size={18} color={C.success} /><Text style={s.dealTxt}>Deal enabled</Text></View>
          ) : (
            <View style={s.codeBox}>
              <Text style={s.code} selectable>{d.code || '-'}</Text>
              <TouchableOpacity onPress={copy} style={s.copyBtn}><Feather name={copied ? 'check' : 'copy'} size={15} color="#fff" /><Text style={s.copyTxt}>{copied ? 'Copied' : 'Copy Code'}</Text></TouchableOpacity>
            </View>
          )}
          {copied ? <Text style={{ color: C.success, fontFamily: F.med, fontSize: 12.5, marginTop: 6 }}>Code copied successfully!</Text> : null}

          <View style={{ gap: 10, marginTop: 14 }}>
            {d.link ? <GradButton title={`Go to the ${d.title} site`} icon="external-link" onPress={() => Linking.openURL(d.link)} /> : null}
            {storeId ? <OutlineButton title={`View all ${d.title} offers`} onPress={() => navigation.navigate('StoreOffers', { storeId, name: d.title, logo: d.logo })} /> : null}
          </View>

          <Text style={s.h}>Offer Description</Text>
          <Text style={s.p}>{d.description || 'No description available.'}</Text>
        </View>

        {/* Is this coupon working? */}
        <View style={s.card}>
          <Text style={s.h2}>Is this coupon working?</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
            <TouchableOpacity style={[s.vote, { borderColor: '#A7F3D0' }]} onPress={() => vote('yes')}><Feather name="thumbs-up" size={18} color={C.success} /><Text style={s.voteTxt}>Yes · {fb.yes}</Text></TouchableOpacity>
            <TouchableOpacity style={[s.vote, { borderColor: '#FECACA' }]} onPress={() => vote('no')}><Feather name="thumbs-down" size={18} color={C.danger} /><Text style={s.voteTxt}>No · {fb.no}</Text></TouchableOpacity>
          </View>
          {answered ? <Text style={s.note}>Thanks for your feedback!</Text> : null}
          {!isLoggedIn ? <Text style={[s.note, { color: C.danger }]}>Please log in to submit feedback.</Text> : null}
        </View>

        {/* Comments */}
        <View style={s.card}>
          <Text style={s.h2}>Comments ({comments.length})</Text>
          {comments.length === 0 ? <Text style={s.note}>No comments available.</Text> : comments.map((x, i) => (
            <View key={i} style={s.comment}><Text style={s.cName}>{x.name}</Text><Text style={s.cTxt}>{x.comment}</Text></View>
          ))}
          <View style={{ marginTop: 14 }}>
            <Field label="Your name" value={cName} onChangeText={setCName} placeholder="Name" />
            <Field label="Comment" value={cText} onChangeText={setCText} placeholder="Share your experience" multiline style={{ minHeight: 70, textAlignVertical: 'top' }} />
            <Banner type={cMsg?.type === 'ok' ? 'ok' : 'error'} text={cMsg?.text} />
            <GradButton small title="Post comment" onPress={addComment} />
          </View>
        </View>

        {/* Newsletter */}
        <View style={[s.card, { backgroundColor: '#0d2840' }]}>
          <Text style={[s.h2, { color: '#fff' }]}>Deals & coupon drop. You grab them. Simple!</Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontFamily: F.reg, fontSize: 12.5, marginTop: 4 }}>Get new offers from this store by email.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <TextInput value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor={C.faint} autoCapitalize="none" keyboardType="email-address" style={s.nInput} />
            <GradButton small title="Subscribe" onPress={subscribe} />
          </View>
          {nMsg ? <Text style={{ color: nMsg.type === 'ok' ? '#6EE7B7' : '#FCA5A5', fontFamily: F.med, fontSize: 12.5, marginTop: 8 }}>{nMsg.text}</Text> : null}
        </View>

        {related.length ? (
          <View>
            <Text style={[s.h2, { marginBottom: 10 }]}>Related offers</Text>
            <FlatList data={related} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(i) => i._id} contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => <CouponCard width={158} item={item} onPress={(x) => navigation.push('CouponDetail', { coupon: x })} />} />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, ...shadow },
  title: { fontFamily: F.black, fontSize: 20, color: C.navy, marginTop: 10 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.tint, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5 },
  pillTxt: { fontFamily: F.semi, fontSize: 11.5, color: C.primary },
  deal: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ECFDF5', borderRadius: 12, padding: 14, marginTop: 14 },
  dealTxt: { fontFamily: F.bold, fontSize: 15, color: '#047857' },
  codeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderStyle: 'dashed', borderColor: C.primary, borderRadius: 12, padding: 8, paddingLeft: 14, marginTop: 14, backgroundColor: C.tint },
  code: { fontFamily: F.black, fontSize: 18, color: C.navy, letterSpacing: 1.5, flexShrink: 1 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  copyTxt: { color: '#fff', fontFamily: F.bold, fontSize: 13 },
  h: { fontFamily: F.bold, fontSize: 16, color: C.text, marginTop: 18 },
  h2: { fontFamily: F.bold, fontSize: 16, color: C.text },
  p: { fontFamily: F.reg, fontSize: 14, color: C.muted, lineHeight: 21, marginTop: 6 },
  vote: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 12, paddingVertical: 12 },
  voteTxt: { fontFamily: F.bold, fontSize: 14, color: C.text },
  note: { fontFamily: F.reg, fontSize: 12.5, color: C.muted, marginTop: 8 },
  comment: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginTop: 8 },
  cName: { fontFamily: F.bold, fontSize: 13.5, color: C.text },
  cTxt: { fontFamily: F.reg, fontSize: 13, color: C.muted, marginTop: 2 },
  nInput: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, fontFamily: F.reg, fontSize: 14 },
});
