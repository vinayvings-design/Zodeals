import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { C, F, shadow } from '../theme';
import { imgUrl } from '../api';

export default function StoreTile({ store, onPress, width, count }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(store)} style={[s.tile, width ? { width } : null]}>
      {store.logo ? <Image source={{ uri: imgUrl(store.logo) }} style={s.logo} resizeMode="contain" /> : <Text style={s.name}>{store.name}</Text>}
      {count != null ? <View style={s.count}><Text style={s.countTxt}>{count} deals</Text></View> : null}
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  tile: { height: 92, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', padding: 10, ...shadow },
  logo: { width: '85%', height: '60%' },
  name: { fontFamily: F.bold, fontSize: 13, color: C.text, textAlign: 'center' },
  count: { position: 'absolute', bottom: 5, backgroundColor: C.tint, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  countTxt: { fontFamily: F.semi, fontSize: 9.5, color: C.primary },
});
