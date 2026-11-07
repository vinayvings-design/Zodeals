import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { C, F, GRAD } from '../theme';

export function GradButton({ title, onPress, loading, disabled, style, small, icon }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={disabled || loading} style={[{ opacity: disabled ? 0.55 : 1 }, style]}>
      <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.grad, small && { paddingVertical: 9, paddingHorizontal: 14 }]}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {icon ? <Feather name={icon} size={small ? 14 : 16} color="#fff" /> : null}
            <Text style={[s.gradTxt, small && { fontSize: 12.5 }]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
export function OutlineButton({ title, onPress, style, icon, color = C.primary }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[s.outline, { borderColor: color }, style]}>
      {icon ? <Feather name={icon} size={15} color={color} /> : null}
      <Text style={[s.outlineTxt, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}
export const Loader = ({ pad = 40 }) => <View style={{ padding: pad, alignItems: 'center' }}><ActivityIndicator size="large" color={C.primary} /></View>;
export const Empty = ({ icon = 'inbox', title, sub }) => (
  <View style={s.empty}>
    <View style={s.emptyIcon}><Feather name={icon} size={26} color={C.primary} /></View>
    <Text style={s.emptyTitle}>{title}</Text>
    {sub ? <Text style={s.emptySub}>{sub}</Text> : null}
  </View>
);
export const SectionHeader = ({ title, sub, onMore, moreLabel = 'View all' }) => (
  <View style={s.secHead}>
    <View style={{ flex: 1 }}>
      <Text style={s.secTitle}>{title}</Text>
      {sub ? <Text style={s.secSub}>{sub}</Text> : null}
    </View>
    {onMore ? <TouchableOpacity onPress={onMore}><Text style={s.more}>{moreLabel} ›</Text></TouchableOpacity> : null}
  </View>
);
export const Field = React.forwardRef(function Field({ label, style, right, ...p }, ref) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.inputWrap}>
        <TextInput ref={ref} placeholderTextColor={C.faint} style={[s.input, style]} {...p} />
        {right}
      </View>
    </View>
  );
});
export const Banner = ({ type = 'error', text }) => !text ? null : (
  <View style={[s.banner, { backgroundColor: type === 'error' ? '#FEF2F2' : '#ECFDF5', borderColor: type === 'error' ? '#FECACA' : '#A7F3D0' }]}>
    <Text style={{ fontFamily: F.med, fontSize: 13, color: type === 'error' ? '#B91C1C' : '#047857' }}>{text}</Text>
  </View>
);

const s = StyleSheet.create({
  grad: { paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gradTxt: { color: '#fff', fontFamily: F.bold, fontSize: 14.5 },
  outline: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 16 },
  outlineTxt: { fontFamily: F.semi, fontSize: 14 },
  empty: { alignItems: 'center', padding: 32 },
  emptyIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontFamily: F.bold, fontSize: 16, color: C.text, textAlign: 'center' },
  emptySub: { fontFamily: F.reg, fontSize: 13, color: C.muted, marginTop: 4, textAlign: 'center' },
  secHead: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 12 },
  secTitle: { fontFamily: F.black, fontSize: 19, color: C.navy },
  secSub: { fontFamily: F.reg, fontSize: 12.5, color: C.muted, marginTop: 2 },
  more: { fontFamily: F.semi, fontSize: 13, color: C.primary },
  label: { fontFamily: F.semi, fontSize: 13, color: C.text, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12 },
  input: { flex: 1, fontFamily: F.reg, fontSize: 14.5, color: C.text, paddingVertical: 12 },
  banner: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 },
});
