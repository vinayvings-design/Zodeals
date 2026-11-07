import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { C, F, GRAD, shadow } from '../theme';
import { imgUrl } from '../api';
import { useApp } from '../context/AppContext';

// Same discount label rule as the website: Flat -> "X OFF", otherwise "X% OFF".
export const discountLabel = (d) => (d.discountValue ? `${d.discountValue}${d.discountType === 'Flat' ? ' OFF' : '% OFF'}` : d.type === 'Coupon' ? 'COUPON' : 'DEAL');

export default function CouponCard({ item, onPress, width, style }) {
  const { wishlist, toggleWishlist } = useApp();
  const liked = wishlist.includes(item._id);
  const cta = item.type === 'Coupon' ? 'Get Code' : 'Get Deal';
  return (
    <View style={[s.card, width ? { width } : null, style]}>
      <View style={s.imgArea}>
        <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.badge}>
          <Text style={s.badgeTxt}>🔥 {discountLabel(item)}</Text>
        </LinearGradient>
        <TouchableOpacity onPress={() => toggleWishlist(item._id)} style={[s.heart, liked && { borderColor: C.danger }]} hitSlop={8}>
          <Feather name="heart" size={14} color={liked ? C.danger : C.faint} />
        </TouchableOpacity>
        {item.logo ? <Image source={{ uri: imgUrl(item.logo) }} style={s.logo} resizeMode="contain" /> : <Feather name="tag" size={32} color={C.faint} />}
      </View>
      <View style={{ padding: 10, flex: 1 }}>
        <Text style={s.title} numberOfLines={2}>{item.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
          <Feather name="eye" size={11} color="#D1D5DB" />
          <Text style={s.views}>{item.viewCount || 0} views</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(item)} style={{ marginHorizontal: 10, marginBottom: 10 }}>
        <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.cta}>
          <Text style={s.ctaTxt}>{cta} →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden', ...shadow },
  imgArea: { backgroundColor: '#FAFBFD', height: 104, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F2F7' },
  badge: { position: 'absolute', top: 8, left: 8, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, zIndex: 2 },
  badgeTxt: { color: '#fff', fontFamily: F.black, fontSize: 10.5 },
  heart: { position: 'absolute', top: 6, right: 6, zIndex: 2, backgroundColor: '#fff', borderRadius: 10, padding: 6, borderWidth: 1.5, borderColor: 'transparent', ...shadow },
  logo: { height: 46, width: 100 },
  title: { fontFamily: F.bold, fontSize: 12.5, color: C.text, lineHeight: 17 },
  views: { fontFamily: F.reg, fontSize: 11, color: C.faint },
  cta: { borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontFamily: F.black, fontSize: 12 },
});
