import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, CircularProgress,
  Dialog, DialogContent, IconButton,
} from '@mui/material';
import { Heart, Eye, ChevronRight, Flame } from 'lucide-react';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import SignInRequiredPrompt from '../authentications/SigninOverlay';

// ── Dummy fallback deals ──
const DUMMY_DEALS = [
  { _id: 'dd1', title: 'Amazon — Best offers this month', discountValue: 35, discountType: '%', viewCount: 1200, emoji: '🛒', storeColor: '#FF9900', storeBg: '#FFF8EC', link: '/alldeals' },
  { _id: 'dd2', title: 'Flipkart — Big Billion Days',     discountValue: 40, discountType: '%', viewCount: 980,  emoji: '📦', storeColor: '#2874F0', storeBg: '#EFF4FF', link: '/alldeals' },
  { _id: 'dd3', title: 'Myntra — End of Season Sale',    discountValue: 50, discountType: '%', viewCount: 2100, emoji: '👗', storeColor: '#FF3F6C', storeBg: '#FFF0F3', link: '/alldeals' },
  { _id: 'dd4', title: 'Swiggy — Free delivery offer',   discountValue: null, discountType: '%', viewCount: 560, emoji: '🍔', storeColor: '#FC8019', storeBg: '#FFF4EC', link: '/alldeals' },
  { _id: 'dd5', title: 'Nykaa — Skincare Sale',          discountValue: 30, discountType: '%', viewCount: 870,  emoji: '💄', storeColor: '#FC2779', storeBg: '#FFF0F7', link: '/alldeals' },
];

// ── Dummy card image box ──
const DummyImage = ({ deal }) => (
  <Box sx={{
    width: 64, height: 64, borderRadius: '14px',
    background: deal.storeBg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 36,
  }}>
    {deal.emoji}
  </Box>
);

// ── Deal Card ──
const DealCard = ({ deal, onDealClick, wishlist, toggleWishlist, isDummy }) => {
  const isWishlisted = wishlist.includes(deal._id);
  const pct = deal.discountValue
    ? `${deal.discountValue}${deal.discountType === 'Flat' ? ' OFF' : '% OFF'}`
    : 'DEAL';

  return (
    <Box sx={{
      borderRadius: '16px',
      border: '1.5px solid #E8ECF4',
      backgroundColor: '#fff',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.22s ease',
      boxShadow: '0 1px 4px rgba(15,27,53,0.05)',
      '&:hover': {
        boxShadow: '0 10px 32px rgba(15,27,53,0.10)',
        transform: 'translateY(-4px)',
        borderColor: 'rgba(255,107,53,0.35)',
      },
    }}>
      {/* Image area */}
      <Box sx={{
        position: 'relative',
        backgroundColor: isDummy ? (deal.storeBg || '#FAFBFD') : '#FAFBFD',
        p: 2.5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 110,
        borderBottom: '1px solid #F0F2F7',
      }}>
        {/* Discount badge */}
        <Box sx={{
          position: 'absolute', top: 10, left: 10,
          background: 'linear-gradient(135deg, #FF6B35, #e63946)',
          color: '#fff', borderRadius: '8px', px: 1, py: 0.4,
          fontSize: 10.5, fontWeight: 800, fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: 0.4,
          boxShadow: '0 2px 8px rgba(255,107,53,0.3)', letterSpacing: 0.2,
        }}>
          <Flame size={10} color="#fff" /> {pct}
        </Box>

        {/* Wishlist */}
        <IconButton
          size="small"
          onClick={() => toggleWishlist(deal._id)}
          sx={{
            position: 'absolute', top: 8, right: 8,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(15,27,53,0.1)',
            p: 0.7, borderRadius: '10px',
            border: isWishlisted ? '1.5px solid #F43F5E' : '1.5px solid transparent',
            '&:hover': { backgroundColor: '#FEF2F2', transform: 'scale(1.1)' },
            transition: 'all 0.2s',
          }}
        >
          <Heart size={13} color={isWishlisted ? '#F43F5E' : '#9CA3AF'} fill={isWishlisted ? '#F43F5E' : 'none'} />
        </IconButton>

        {/* Image */}
        {isDummy ? (
          <DummyImage deal={deal} />
        ) : (
          <img
            crossOrigin="anonymous"
            src={`${hosturl}${deal.logo}`}
            alt="store"
            style={{ height: 46, maxWidth: 100, objectFit: 'contain' }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ px: 1.5, pt: 1.2, pb: 0.5, flex: 1 }}>
        <Typography sx={{
          fontWeight: 700, fontSize: 12.5, fontFamily: 'Inter, sans-serif',
          color: '#111827', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-0.005em',
        }}>
          {deal.title}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.6}>
          <Eye size={11} color="#D1D5DB" />
          <Typography fontSize={11} color="#9CA3AF" fontFamily="Inter, sans-serif">
            {deal.viewCount >= 1000 ? `${(deal.viewCount / 1000).toFixed(1)}k` : deal.viewCount || 0} views
          </Typography>
        </Box>
      </Box>

      {/* CTA */}
      <Box
        onClick={() => onDealClick(deal)}
        sx={{
          mx: 1.2, mb: 1.2, borderRadius: '10px',
          background: 'linear-gradient(135deg, #FF6B35, #e55a26)',
          py: 1, textAlign: 'center', cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 3px 10px rgba(255,107,53,0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e55a26, #c94a1e)',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 16px rgba(255,107,53,0.35)',
          },
        }}
      >
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'Inter, sans-serif', letterSpacing: 0.3 }}>
          Get Deal →
        </Typography>
      </Box>
    </Box>
  );
};

// ── Main ──
const TopDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDummy, setUseDummy] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const pincode = localStorage.getItem('userPinCode');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        let url = `${hosturl}/home/deals`;
        if (pincode && pincode !== 'null') url += `?pinCode=${pincode}`;
        const r = await fetch(url);
        const d = await r.json();
        if (d.statusCode !== 200) throw new Error(d.displayMessage);
        const m = Array.isArray(d.result?.matchedDeals) ? d.result.matchedDeals : [];
        const p = Array.isArray(d.result?.panIndiaDeals) ? d.result.panIndiaDeals : [];
        const all = [...m, ...p];
        if (all.length > 0) { setDeals(all); setUseDummy(false); }
        else { setUseDummy(true); }
      } catch { setUseDummy(true); }
      finally { setLoading(false); }
    };
    fetchDeals();
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

  const handleOpenDialog = (coupon) => {
    if (useDummy) { window.location.href = '/alldeals'; return; }
    const token = localStorage.getItem('token');
    if (!token) { setOpenSignInDialog(true); return; }
    setSelectedCoupon(coupon); setOpenDialog(true);
  };

  const displayDeals = useDummy ? DUMMY_DEALS : deals;

  return (
    <Box sx={{ backgroundColor: '#F5F7FA', py: 5 }}>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 14px rgba(255,107,53,0.35)',
            }}>⚡</Box>
            <Typography sx={{ fontWeight: 800, fontSize: 20, fontFamily: 'Inter, sans-serif', color: '#111827', letterSpacing: '-0.01em' }}>
              Top Deals
            </Typography>
          </Box>
          <Box
            onClick={() => window.location.href = '/alldeals'}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.4,
              color: '#FF6B35', fontSize: 13, fontWeight: 700,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              borderRadius: '8px', px: 1.2, py: 0.5,
              '&:hover': { backgroundColor: '#FFF0EA' }, transition: 'background 0.2s',
            }}
          >
            View All <ChevronRight size={15} />
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress sx={{ color: '#FF6B35' }} />
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)', md: 'repeat(5,1fr)' },
            gap: 2,
          }}>
            {displayDeals.slice(0, 10).map((deal, idx) => (
              <DealCard
                key={deal._id || idx}
                deal={deal}
                isDummy={useDummy}
                onDealClick={handleOpenDialog}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </Box>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xl" fullWidth>
        <DialogContent><CouponDetailDialog coupon={selectedCoupon} onClose={() => setOpenDialog(false)} /></DialogContent>
      </Dialog>
      <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} fullWidth maxWidth="xs">
        {openSignInDialog && <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />}
      </Dialog>
    </Box>
  );
};

export default TopDeals;
