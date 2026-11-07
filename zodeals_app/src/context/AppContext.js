import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken, getWishlist, addWishlist, removeWishlist, getNotificationCount } from '../api';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [pinCode, setPinCodeState] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [signInPrompt, setSignInPrompt] = useState(false);
  const pinAsked = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const [t, r, p] = await Promise.all([
          AsyncStorage.getItem('token'), AsyncStorage.getItem('role'), AsyncStorage.getItem('userPinCode'),
        ]);
        if (t) { setAuthToken(t); setToken(t); }
        if (r) setRole(r);
        if (p && p !== 'null') setPinCodeState(p);
      } catch {}
      setReady(true);
    })();
  }, []);

  const refreshWishlist = useCallback(async () => {
    if (!token) { setWishlist([]); return; }
    try { setWishlist((await getWishlist()).map((c) => c._id)); } catch {}
  }, [token]);
  const refreshNotifCount = useCallback(async () => {
    if (!token) { setNotifCount(0); return; }
    try { setNotifCount(await getNotificationCount()); } catch {}
  }, [token]);

  useEffect(() => { refreshWishlist(); refreshNotifCount(); }, [refreshWishlist, refreshNotifCount]);

  // After login, ask for a pin code once if none is saved (same as the website).
  useEffect(() => {
    if (ready && token && !pinCode && !pinAsked.current) { pinAsked.current = true; setPinModalOpen(true); }
  }, [ready, token, pinCode]);

  const signIn = useCallback(async (t, r) => {
    setAuthToken(t); setToken(t); setRole(r);
    await AsyncStorage.multiSet([['token', t], ['role', r || 'user']]);
  }, []);
  const signOut = useCallback(async () => {
    setAuthToken(null); setToken(null); setRole(null); setWishlist([]); setNotifCount(0); setPinCodeState('');
    pinAsked.current = false;
    await AsyncStorage.multiRemove(['token', 'role', 'userPinCode']);
  }, []);
  const setPinCode = useCallback(async (p) => {
    setPinCodeState(p);
    await AsyncStorage.setItem('userPinCode', p);
  }, []);

  // Returns false (and opens the sign-in prompt) when logged out.
  const toggleWishlist = useCallback(async (couponId) => {
    if (!token) { setSignInPrompt(true); return false; }
    const has = wishlist.includes(couponId);
    setWishlist((w) => (has ? w.filter((i) => i !== couponId) : [...w, couponId]));
    try { has ? await removeWishlist(couponId) : await addWishlist(couponId); return true; }
    catch { setWishlist((w) => (has ? [...w, couponId] : w.filter((i) => i !== couponId))); return false; }
  }, [token, wishlist]);

  const value = useMemo(() => ({
    ready, token, role, isLoggedIn: !!token, pinCode, setPinCode,
    signIn, signOut, wishlist, toggleWishlist, refreshWishlist,
    notifCount, refreshNotifCount,
    pinModalOpen, openPinModal: () => setPinModalOpen(true), closePinModal: () => setPinModalOpen(false),
    signInPrompt, openSignInPrompt: () => setSignInPrompt(true), closeSignInPrompt: () => setSignInPrompt(false),
  }), [ready, token, role, pinCode, setPinCode, signIn, signOut, wishlist, toggleWishlist, refreshWishlist, notifCount, refreshNotifCount, pinModalOpen, signInPrompt]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
