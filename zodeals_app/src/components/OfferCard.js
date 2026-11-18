import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { C, F, shadow } from '../theme';
import { imgUrl } from '../api';
import { useApp } from '../context/AppContext';
import { discountLabel } from './CouponCard';

// Same look as the website's offer card: yellow coupon button / navy deal button, dark-red tab.
const YELLOW = '#F8C433', NAVY = '#12253d', TAB = '#8B0000';

export default function OfferCard({ item, onPress, width, style }) {
  const { wishlist, toggleWishlist } = useApp();
  const liked = wishlist.includes(item._id);
  const isDeal = item.type !== 'Coupon';
  const btn = isDeal ? NAVY : YELLOW;
  return (
    <View style={[s.card, width ? { width } : null, style]}>
      <View style={s.tab}><Text style={s.tabTxt}>{discountLabel(item)}</Text></View>
      <TouchableOpacity onPress={() => toggleWishlist(item._id)} style={s.heart} hitSlop={8}>
        <Feather name="heart" size={16} color={liked ? C.danger : C.faint} />
      </TouchableOpacity>
      <View style={s.logoWrap}>
        {item.logo ? <Image source={{ uri: imgUrl(item.logo) }} style={s.logo} resizeMode="contain" /> : <Feather name="tag" size={30} color={C.faint} />}
      </View>
      <Text style={s.title} numberOfLines={2}>{item.title}</Text>
      {item.description ? <Text style={s.desc} numberOfLines={2}>{item.description}</Text> : null}
      <View style={s.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="eye" size={12} color={C.faint} />
          <Text style={s.views}>{item.viewCount || 0}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(item)} style={[s.btn, { backgroundColor: btn }]}>
          <Text style={[s.btnTxt, { color: isDeal ? '#fff' : '#000' }]}>{isDeal ? 'Get Deal' : 'Get Code'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 14, overflow: 'hidden', ...shadow },
  tab: { position: 'absolute', top: 0, left: 0, backgroundColor: TAB, borderBottomRightRadius: 12, paddingHorizontal: 12, paddingVertical: 5, zIndex: 2 },
  tabTxt: { color: '#fff', fontFamily: F.black, fontSize: 11.5 },
  heart: { position: 'absolute', top: 10, right: 12, zIndex: 2 },
  logoWrap: { height: 96, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logo: { height: 92, width: '85%' },
  title: { fontFamily: F.bold, fontSize: 14, color: C.text, marginTop: 8, lineHeight: 19 },
  desc: { fontFamily: F.reg, fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 17 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  views: { fontFamily: F.reg, fontSize: 12, color: C.faint },
  btn: { borderRadius: 10, paddingVertical: 9, paddingHorizontal: 20 },
  btnTxt: { fontFamily: F.black, fontSize: 12.5 },
});
