import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { goTo } from '../navigation/ref';
import { C, F } from '../theme';
import { GradButton, OutlineButton } from './ui';
import { useApp } from '../context/AppContext';

export function SignInPrompt() {
  const { signInPrompt, closeSignInPrompt } = useApp();
  return (
    <Modal visible={signInPrompt} transparent animationType="fade" onRequestClose={closeSignInPrompt}>
      <View style={m.back}>
        <View style={m.box}>
          <TouchableOpacity style={m.x} onPress={closeSignInPrompt}><Feather name="x" size={18} color={C.muted} /></TouchableOpacity>
          <View style={m.icon}><Feather name="lock" size={24} color={C.primary} /></View>
          <Text style={m.title}>Sign in required</Text>
          <Text style={m.sub}>Please sign in to save favourites, give feedback and comment on deals.</Text>
          <GradButton title="Sign in" onPress={() => { closeSignInPrompt(); goTo('Login'); }} style={{ alignSelf: 'stretch' }} />
          <OutlineButton title="Create account" onPress={() => { closeSignInPrompt(); goTo('Signup'); }} style={{ alignSelf: 'stretch', marginTop: 10 }} />
        </View>
      </View>
    </Modal>
  );
}

export function PinCodeModal() {
  const { pinModalOpen, closePinModal, setPinCode, pinCode } = useApp();
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');
  const submit = async () => {
    if (!/^\d{6}$/.test(val)) { setErr('Please enter a valid 6-digit pin code'); return; }
    await setPinCode(val); setErr(''); setVal(''); closePinModal();
  };
  return (
    <Modal visible={pinModalOpen} transparent animationType="fade" onRequestClose={closePinModal}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={m.back}>
        <View style={m.box}>
          <TouchableOpacity style={m.x} onPress={closePinModal}><Feather name="x" size={18} color={C.muted} /></TouchableOpacity>
          <View style={m.icon}><Feather name="map-pin" size={24} color={C.primary} /></View>
          <Text style={m.title}>Enter Pincode</Text>
          <Text style={m.sub}>See the stores and deals available in your area.{pinCode ? `\nCurrent: ${pinCode}` : ''}</Text>
          <TextInput value={val} onChangeText={(t) => { setVal(t.replace(/\D/g, '').slice(0, 6)); setErr(''); }} placeholder="6-digit pin code" placeholderTextColor={C.faint}
            keyboardType="number-pad" maxLength={6} style={m.input} />
          {err ? <Text style={m.err}>{err}</Text> : null}
          <GradButton title="Apply" onPress={submit} style={{ alignSelf: 'stretch', marginTop: 12 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const m = StyleSheet.create({
  back: { flex: 1, backgroundColor: 'rgba(15,27,53,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  box: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center' },
  x: { position: 'absolute', top: 12, right: 12, padding: 6 },
  icon: { width: 54, height: 54, borderRadius: 16, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontFamily: F.black, fontSize: 19, color: C.navy },
  sub: { fontFamily: F.reg, fontSize: 13, color: C.muted, textAlign: 'center', marginVertical: 8 },
  input: { alignSelf: 'stretch', borderWidth: 1.5, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: F.semi, fontSize: 18, textAlign: 'center', letterSpacing: 4, color: C.text },
  err: { color: C.danger, fontFamily: F.med, fontSize: 12.5, marginTop: 8 },
});
