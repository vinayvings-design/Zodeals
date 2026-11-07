import axios from 'axios';
import { HOST_URL } from '../config';

let authToken = null;
export const setAuthToken = (t) => { authToken = t; };

export const http = axios.create({ baseURL: HOST_URL, timeout: 20000 });
http.interceptors.request.use((cfg) => {
  if (authToken) cfg.headers.Authorization = `Bearer ${authToken}`;
  return cfg;
});

export const imgUrl = (p) => (!p ? null : /^https?:\/\//i.test(p) ? p : `${HOST_URL}${p}`);
export const errMsg = (e, fb = 'Something went wrong') => e?.response?.data?.displayMessage || e?.response?.data?.error || e?.message || fb;

const pin = (p) => (p && p !== 'null' && String(p).trim() !== '' ? String(p).trim() : '');
const arr = (v) => (Array.isArray(v) ? v : []);

/* ---- home / deals ---- */
export async function getDeals({ pinCode, storeId, type } = {}) {
  const params = {};
  if (pin(pinCode)) params.pinCode = pin(pinCode);
  if (storeId) params.storeId = storeId;
  if (type) params.type = type;
  const { data } = await http.get('/home/deals', { params });
  if (!data?.result) throw new Error(data?.displayMessage || 'Failed to load deals');
  return { matched: arr(data.result.matchedDeals), panIndia: arr(data.result.panIndiaDeals) };
}
export async function getLatestDeals(pinCode) {
  const { data } = await http.get('/home/last/deals', { params: pin(pinCode) ? { pinCode: pin(pinCode) } : {} });
  if (!data?.result) throw new Error(data?.displayMessage || 'Failed to load deals');
  return [...arr(data.result.matchedDeals), ...arr(data.result.panIndiaDeals)];
}
export async function getHomeCoupons(pinCode) {
  const { data } = await http.get('/home/coupons', { params: pin(pinCode) ? { pinCode: pin(pinCode) } : {} });
  if (!data?.result) throw new Error(data?.displayMessage || 'Failed to load coupons');
  return [...arr(data.result.matchedCoupons), ...arr(data.result.panIndiaCoupons)];
}
export async function getBanners() {
  const { data } = await http.get('/banners', { timeout: 6000 });
  return arr(data?.result).filter((b) => b && b.image && b.headline);
}
export async function getProducts() {
  const { data } = await http.get('/products');
  return arr(data?.result);
}
export const viewProduct = (id) => http.get(`/product/${id}`).catch(() => {});

/* ---- stores / categories ---- */
export async function getStores(pinCode) {
  const { data } = await http.get('/stores', { params: { pinCode: pin(pinCode) } });
  return { matched: arr(data?.result?.matchedStores), panIndia: arr(data?.result?.panIndiaStores) };
}
export async function getStoresByPin(pinCode) {
  const { data } = await http.get(`/stores/${pinCode}`);
  return arr(data?.result);
}
export const getStoreDealCount = async (id) => {
  const { data } = await http.get(`/store/${id}/deals/count`);
  return data?.result;
};
export async function getCategories() {
  const { data } = await http.get('/category');
  return arr(data?.result);
}
export async function getCategoryCoupons(id, pinCode) {
  const { data } = await http.get(`/category/coupons/${id}`, { params: pin(pinCode) ? { pinCode: pin(pinCode) } : {} });
  return arr(data?.result);
}

/* ---- coupon detail ---- */
export async function getCoupon(id) {
  const { data } = await http.get(`/coupon/${id}`);
  return data?.result || null;
}
export async function getFeedback(id) {
  const { data } = await http.get(`/coupons/working/${id}`);
  return { yes: data?.result?.yesCount || 0, no: data?.result?.noCount || 0 };
}
export const sendFeedback = (couponId, message) => http.post('/coupons/working', { couponId, message });
export async function getComments(id) {
  const { data } = await http.get(`/coupon/comment/${id}`);
  return arr(data?.result?.comments);
}
export const postComment = (couponId, name, comment) => http.post('/coupon/comment', { couponId, name, comment });
export const subscribeStore = (storeId, email) => http.post('/coupon/store', { storeId, email });
export async function getAllCoupons() {
  const { data } = await http.get('/coupons');
  return arr(data?.result);
}

/* ---- wishlist ---- */
export async function getWishlist() {
  const { data } = await http.get('/user/wishlist');
  return arr(data?.result?.couponIds);
}
export const addWishlist = (couponId) => http.post('/user/wishlist', { couponId });
export const removeWishlist = (couponId) => http.delete(`/user/wishlist/${couponId}`);

/* ---- auth / profile ---- */
export async function login(email, password) {
  const { data } = await http.post('/login', { email, password, role: 'user' });
  if (!data?.status) throw new Error('Invalid email or password');
  return data.result; // { token, role }
}
export const registerUser = (name, email, password, phoneNumber) => http.post('/user', { name, email, password, phoneNumber });
export const sendEmailCode = (email, tag) => http.post('/email/code', { email, tag, role: 'user' });
export const verifyEmailCode = (email, code, tag) => http.post('/email/verify', { email, code: Number(code), tag });
export const resetPassword = (userId, password) => http.post('/forgot/password', { userId, password });
export async function getProfile() {
  const { data } = await http.get('/profile');
  return data?.result || null;
}
export const updateProfile = (formData) => http.patch('/user', formData, { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (d) => d });

/* ---- misc ---- */
export async function getNotifications() {
  const { data } = await http.get('/notification');
  if (data?.status === false || !data?.result) throw new Error(data?.displayMessage || 'Failed to fetch notifications.');
  return arr(data.result.notification);
}
export async function getNotificationCount() {
  const { data } = await http.get('/notification/count');
  return data?.status && typeof data.result === 'number' ? data.result : 0;
}
export async function getTestimonials() {
  const { data } = await http.get('/testimonials/approved');
  return arr(data?.result);
}
export async function getContactInfo() {
  const { data } = await http.get('/contact-us');
  return data?.result || {};
}
export const createAgent = (form) => http.post('/admin/agent', form);
