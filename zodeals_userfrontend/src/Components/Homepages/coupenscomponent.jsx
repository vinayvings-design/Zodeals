import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, CircularProgress,
  Dialog, DialogContent, Chip, IconButton,
} from '@mui/material';
import { Scissors, Heart, Eye, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import premiumBg from '../../assets/images/premium_section_bg.jpg';

// ─────────────────────────────────────────────
//  Polished horizontal coupon card
// ─────────────────────────────────────────────
const CouponCard = ({ coupon, wishlist, toggleWishlist, handleOpenDialog, setOpenSignInDialog }) => {
  const {
    _id, title, description, validTill, logo,
    viewCount = 0, discountValue, discountType, type,
  } = coupon;

  const isWishlisted = wishlist.includes(_id);
  const isCode = type === 'Coupon';
  const expiryStr = validTill
    ? new Date(validTill).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  const handleReveal = () => {
    const token = localStorage.getItem('token');
    if (!token) setOpenSignInDialog(true);
    else handleOpenDialog(coupon);
  };

  const stripBg = isCode
    ? 'linear-gradient(160deg, #6D28D9, #4C1D95)'
    : 'linear-gradient(160deg, #FF6B35, #e55a26)';

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '16px',
        border: '1.5px solid #E8ECF4',
        backgroundColor: '#fff',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(15,27,53,0.05)',
        transition: 'box-shadow 0.22s, transform 0.22s, border-color 0.22s',
        '&:hover': {
          boxShadow: '0 8px 28px rgba(15,27,53,0.10)',
          transform: 'translateY(-2px)',
          borderColor: isCode ? 'rgba(109,40,217,0.25)' : 'rgba(255,107,53,0.25)',
        },
      }}
    >
      {/* ── LEFT: Coloured discount strip ── */}
      <Box
        sx={{
          width: 76, flexShrink: 0,
          background: stripBg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          py: 2, px: 1, position: 'relative',
        }}
      >
        <Typography
          sx={{
            color: '#fff', fontWeight: 900,
            fontSize: discountValue && String(discountValue).length > 2 ? 13 : 22,
            fontFamily: 'Inter, sans-serif', lineHeight: 1, textAlign: 'center',
          }}
        >
          {discountValue
            ? (discountType === 'Flat' ? `₹${discountValue}` : `${discountValue}%`)
            : isCode ? 'CODE' : 'DEAL'}
        </Typography>
        {discountValue && (
          <Typography sx={{
            color: 'rgba(255,255,255,0.75)', fontSize: 9,
            fontFamily: 'Inter, sans-serif', textAlign: 'center', mt: 0.3,
            letterSpacing: 0.5, fontWeight: 700,
          }}>
            {discountType === 'Flat' ? 'FLAT' : 'OFF'}
          </Typography>
        )}
        <Box sx={{ mt: 1.5 }}>
          <Scissors size={13} color="rgba(255,255,255,0.6)" style={{ transform: 'rotate(-90deg)' }} />
        </Box>
      </Box>

      {/* ── MIDDLE: Content ── */}
      <Box sx={{ flex: 1, px: 2, py: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        {/* Store logo + tags */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.8}>
          <Box display="flex" alignItems="center" gap={1}>
            {logo && (
              <img
                crossOrigin="anonymous"
                src={`${hosturl}${logo}`}
                alt="brand"
                style={{ height: 22, width: 'auto', objectFit: 'contain', maxWidth: 72 }}
              />
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={0.6}>
            <Chip
              label={isCode ? 'COUPON' : 'DEAL'}
              size="small"
              sx={{
                height: 18, fontSize: 9, fontWeight: 800,
                backgroundColor: isCode ? '#EDE9FE' : '#FFF0EA',
                color: isCode ? '#7C3AED' : '#FF6B35',
                fontFamily: 'Inter, sans-serif',
                border: `1px solid ${isCode ? '#C4B5FD' : '#FDCFB8'}`,
                borderRadius: '6px',
                letterSpacing: 0.3,
              }}
            />
            <IconButton
              size="small" sx={{ p: 0.35, borderRadius: '8px', '&:hover': { backgroundColor: '#FEF2F2' } }}
              onClick={e => { e.stopPropagation(); toggleWishlist(_id); }}
            >
              <Heart size={14} color={isWishlisted ? '#F43F5E' : '#D1D5DB'} fill={isWishlisted ? '#F43F5E' : 'none'} />
            </IconButton>
          </Box>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 700, fontSize: 13.5,
            fontFamily: 'Inter, sans-serif',
            color: '#111827', lineHeight: 1.3, mb: 0.4,
            display: '-webkit-box', WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            letterSpacing: '-0.005em',
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: 12, color: '#6B7280',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.5, mb: 0.6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {description}
        </Typography>

        {/* Footer row */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={0.5}>
            <Clock size={11} color="#D1D5DB" />
            <Typography fontSize={11} color="#9CA3AF" fontFamily="Inter, sans-serif">
              Expires: {expiryStr}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.4}>
            <Eye size={11} color="#D1D5DB" />
            <Typography fontSize={11} color="#9CA3AF" fontFamily="Inter, sans-serif">{viewCount}</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Dashed separator ── */}
      <Box sx={{
        width: '1px',
        background: 'repeating-linear-gradient(to bottom, #E8ECF4 0, #E8ECF4 5px, transparent 5px, transparent 10px)',
        flexShrink: 0, my: 1.5,
      }} />

      {/* ── RIGHT: Reveal button ── */}
      <Box
        onClick={handleReveal}
        sx={{
          width: 88, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 0.7, cursor: 'pointer', px: 1,
          position: 'relative',
          transition: 'background 0.2s',
          '&:hover': { backgroundColor: '#FFF5F0' },
          borderRadius: '0 16px 16px 0',
        }}
      >
        {/* top notch */}
        <Box sx={{
          position: 'absolute', left: -9, top: '42%',
          width: 18, height: 18, borderRadius: '50%',
          backgroundColor: '#F5F7FA', border: '1.5px solid #E8ECF4',
        }} />
        {/* bottom notch */}
        <Box sx={{
          position: 'absolute', left: -9, top: '55%',
          width: 18, height: 18, borderRadius: '50%',
          backgroundColor: '#F5F7FA', border: '1.5px solid #E8ECF4',
        }} />
        <Box sx={{
          width: 36, height: 36, borderRadius: '10px',
          backgroundColor: isCode ? '#EDE9FE' : '#FFF0EA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Scissors size={16} color={isCode ? '#7C3AED' : '#FF6B35'} style={{ transform: 'rotate(-90deg)' }} />
        </Box>
        <Typography
          sx={{
            color: isCode ? '#7C3AED' : '#FF6B35',
            fontWeight: 800, fontSize: 10.5,
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center', letterSpacing: 0.5,
            lineHeight: 1.25,
          }}
        >
          {isCode ? 'SHOW\nCODE' : 'GET\nDEAL'}
        </Typography>
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────
//  Section
// ─────────────────────────────────────────────
export default function CouponsSection() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const pincode = localStorage.getItem('userPinCode');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        let url = `${hosturl}/home/coupons`;
        if (pincode && pincode !== 'null') url += `?pinCode=${pincode.trim()}`;
        const r = await fetch(url);
        const d = await r.json();
        if (d.statusCode !== 200) throw new Error(d.displayMessage || 'Failed');
        const matched = Array.isArray(d.result?.matchedCoupons) ? d.result.matchedCoupons : [];
        const panIndia = Array.isArray(d.result?.panIndiaCoupons) ? d.result.panIndiaCoupons : [];
        setCoupons([...matched, ...panIndia]);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    fetchCoupons();
  }, [pincode]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${hosturl}/user/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data?.result?.couponIds) setWishlist(r.data.result.couponIds.map(i => i._id)); })
      .catch(() => {});
  }, []);

  const toggleWishlist = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) { setOpenSignInDialog(true); return; }
    const has = wishlist.includes(id);
    try {
      if (has) {
        await axios.delete(`${hosturl}/user/wishlist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist(p => p.filter(x => x !== id));
      } else {
        await axios.post(`${hosturl}/user/wishlist`, { couponId: id }, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist(p => [...p, id]);
      }
    } catch { alert('Failed to update wishlist.'); }
  };

  return (
    <Box sx={{
      position: 'relative',
      py: 5,
      backgroundColor: '#F8FAFC',
      backgroundImage: `radial-gradient(ellipse at top right, rgba(124,58,237,0.07), transparent 60%), radial-gradient(ellipse at bottom left, rgba(91,33,182,0.04), transparent 60%), url(${premiumBg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      borderTop: '1px solid rgba(226,232,240,0.8)',
      borderBottom: '1px solid rgba(226,232,240,0.8)',
    }}>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
            }}>
              🏷️
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 18, fontFamily: 'Inter, sans-serif',
              color: '#0F1B35', letterSpacing: '-0.01em',
            }}>
              Top Coupons &amp; Offers
            </Typography>
          </Box>
          <Box
            onClick={() => window.location.href = '/categories'}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.4,
              color: '#FF6B35', fontSize: 13, fontWeight: 700,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              borderRadius: '8px', px: 1.2, py: 0.5,
              '&:hover': { backgroundColor: '#FFF0EA' }, transition: 'background 0.2s',
            }}
          >
            See All <ChevronRight size={15} />
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress sx={{ color: '#FF6B35' }} />
          </Box>
        ) : error ? (
          <Typography color="error" fontSize={13} fontFamily="Inter, sans-serif">{error}</Typography>
        ) : coupons.length === 0 ? (
          <Typography fontSize={13} color="#9CA3AF" fontFamily="Inter, sans-serif">No coupons for your area.</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {coupons.slice(0, 6).map((c, i) => (
              <CouponCard
                key={i}
                coupon={c}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleOpenDialog={coupon => { setSelectedCoupon(coupon); setOpenDialog(true); }}
                setOpenSignInDialog={setOpenSignInDialog}
              />
            ))}
          </Box>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xl" fullWidth>
        <DialogContent>
          {selectedCoupon && <CouponDetailDialog coupon={selectedCoupon} onClose={() => setOpenDialog(false)} />}
        </DialogContent>
      </Dialog>
      <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} fullWidth maxWidth="xs">
        {openSignInDialog && <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />}
      </Dialog>
    </Box>
  );
}
