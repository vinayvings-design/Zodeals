import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { C, F } from '../theme';
import { useApp } from '../context/AppContext';
import { login, registerUser, sendEmailCode, verifyEmailCode, resetPassword, errMsg } from '../api';
import { GradButton, Field, Banner } from '../components/ui';

const Shell = ({ title, sub, children }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={{ width: 150, height: 44, marginBottom: 22 }} resizeMode="contain" />
        <Text style={a.title}>{title}</Text>
        {sub ? <Text style={a.sub}>{sub}</Text> : null}
        <View style={{ height: 18 }} />
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
const Eye = ({ show, onPress }) => <TouchableOpacity onPress={onPress} hitSlop={8}><Feather name={show ? 'eye-off' : 'eye'} size={18} color={C.faint} /></TouchableOpacity>;

/* ---------------- Login ---------------- */
export function LoginScreen({ navigation }) {
  const { signIn } = useApp();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const submit = async () => {
    if (!email || !password) { setErr('Enter your email and password'); return; }
    setBusy(true); setErr('');
    try {
      const r = await login(email.trim(), password);
      await signIn(r.token, r.role);
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch { setErr('Invalid email or password'); } finally { setBusy(false); }
  };
  return (
    <Shell title="Welcome back" sub="Sign in to save deals, give feedback and get notified.">
      <Banner text={err} />
      <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry={!show} placeholder="Your password" right={<Eye show={show} onPress={() => setShow(!show)} />} />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: 16 }}><Text style={a.link}>Forgot password?</Text></TouchableOpacity>
      <GradButton title="Sign in" onPress={submit} loading={busy} />
      <View style={a.alt}><Text style={a.altTxt}>New to ZoDeals? </Text><TouchableOpacity onPress={() => navigation.replace('Signup')}><Text style={a.link}>Create account</Text></TouchableOpacity></View>
    </Shell>
  );
}

/* ---------------- Sign up (no OTP step) ---------------- */
export function SignupScreen({ navigation }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(null);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const submit = async () => {
    if (!f.name.trim() || !f.email.trim() || !f.phone || !f.password) { setMsg({ t: 'error', m: 'Please fill in all fields.' }); return; }
    if (f.phone.length !== 10) { setMsg({ t: 'error', m: 'Enter a 10-digit mobile number.' }); return; }
    if (f.password !== f.confirm) { setMsg({ t: 'error', m: 'Passwords do not match.' }); return; }
    setBusy(true); setMsg(null);
    try {
      await registerUser(f.name.trim(), f.email.trim(), f.password, f.phone);
      setMsg({ t: 'ok', m: 'User created successfully!' });
      setTimeout(() => navigation.replace('Login'), 900);
    } catch (e) { setMsg({ t: 'error', m: errMsg(e, 'Signup failed. Please check your details.') }); } finally { setBusy(false); }
  };
  return (
    <Shell title="Create your account" sub="Join ZoDeals and start saving.">
      <Banner type={msg?.t} text={msg?.m} />
      <Field label="Full name" value={f.name} onChangeText={set('name')} placeholder="Your name" />
      <Field label="Email address" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
      <Field label="Mobile number" value={f.phone} onChangeText={(v) => set('phone')(v.replace(/\D/g, '').slice(0, 10))} keyboardType="number-pad" placeholder="10-digit number" />
      <Field label="Password" value={f.password} onChangeText={set('password')} secureTextEntry={!show} placeholder="Create a password" right={<Eye show={show} onPress={() => setShow(!show)} />} />
      <Field label="Confirm password" value={f.confirm} onChangeText={set('confirm')} secureTextEntry={!show} placeholder="Repeat password" />
      <GradButton title="Create account" onPress={submit} loading={busy} />
      <View style={a.alt}><Text style={a.altTxt}>Already have an account? </Text><TouchableOpacity onPress={() => navigation.replace('Login')}><Text style={a.link}>Sign in</Text></TouchableOpacity></View>
    </Shell>
  );
}

/* ---------------- Forgot password (email OTP, same as website) ---------------- */
export function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(''); const [otp, setOtp] = useState(''); const [userId, setUserId] = useState(null);
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(null);
  const run = async (fn) => { setBusy(true); setMsg(null); try { await fn(); } catch (e) { setMsg({ t: 'error', m: errMsg(e) }); } finally { setBusy(false); } };
  const send = () => run(async () => {
    const r = await sendEmailCode(email.trim(), 'password');
    if (r.data?.status) { setMsg({ t: 'ok', m: 'OTP sent to your email' }); setStep(2); } else setMsg({ t: 'error', m: r.data?.displayMessage || 'Error sending OTP' });
  });
  const verify = () => run(async () => {
    const r = await verifyEmailCode(email.trim(), otp, 'password');
    if (r.data?.status) { setUserId(r.data.result); setMsg({ t: 'ok', m: 'OTP verified!' }); setStep(3); } else setMsg({ t: 'error', m: r.data?.displayMessage || 'Invalid OTP' });
  });
  const reset = () => run(async () => {
    if (pw !== pw2) { setMsg({ t: 'error', m: "Passwords don't match" }); return; }
    if (!userId) { setMsg({ t: 'error', m: 'User verification missing' }); return; }
    const r = await resetPassword(userId, pw);
    if (r.data?.status) { setMsg({ t: 'ok', m: 'Password reset successfully' }); setTimeout(() => navigation.goBack(), 1000); } else setMsg({ t: 'error', m: r.data?.displayMessage || 'Failed to reset' });
  });
  return (
    <Shell title="Reset password" sub={step === 1 ? 'Enter your email and we will send you a code.' : step === 2 ? `Enter the code sent to ${email}.` : 'Choose a new password.'}>
      <Banner type={msg?.t} text={msg?.m} />
      {step === 1 ? (<><Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /><GradButton title="Send OTP" onPress={send} loading={busy} disabled={!email} /></>) : null}
      {step === 2 ? (<><Field label="OTP" value={otp} onChangeText={(v) => setOtp(v.replace(/\D/g, ''))} keyboardType="number-pad" /><GradButton title="Verify" onPress={verify} loading={busy} disabled={!otp} /></>) : null}
      {step === 3 ? (<><Field label="New password" value={pw} onChangeText={setPw} secureTextEntry /><Field label="Confirm password" value={pw2} onChangeText={setPw2} secureTextEntry /><GradButton title="Reset password" onPress={reset} loading={busy} disabled={!pw || !pw2} /></>) : null}
    </Shell>
  );
}

const a = StyleSheet.create({
  title: { fontFamily: F.black, fontSize: 26, color: C.navy },
  sub: { fontFamily: F.reg, fontSize: 14, color: C.muted, marginTop: 6, lineHeight: 20 },
  link: { fontFamily: F.bold, fontSize: 13.5, color: C.primary },
  alt: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  altTxt: { fontFamily: F.reg, fontSize: 13.5, color: C.muted },
});
