import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, CircularProgress,
  Dialog, DialogContent, IconButton,
} from '@mui/material';
import { Heart, Eye, ChevronRight, Clock } from 'lucide-react';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import premiumBg from '../../assets/images/premium_section_bg.jpg';

// ── Same card style as Top Deals ──
const DealCard = ({ deal, onDealClick, wishlist, toggleWishlist }) => {
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
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.22s ease',
      boxShadow: '0 1px 4px rgba(15,27,53,0.05)',
      height: '100%',
      '&:hover': {
        boxShadow: '0 10px 32px rgba(15,27,53,0.10)',
        transform: 'translateY(-4px)',
        borderColor: 'rgba(255,107,53,0.35)',
      },
    }}>
      {/* Image area */}
      <Box sx={{
        position: 'relative',
        backgroundColor: '#FAFBFD',
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
          boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
          letterSpacing: 0.2,
        }}>
          🔥 {pct}
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

        <img
          crossOrigin="anonymous"
          src={`${hosturl}${deal.logo}`}
          alt="store"
          style={{ height: 46, maxWidth: 100, objectFit: 'contain' }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ px: 1.5, pt: 1.2, pb: 0.5, flex: 1 }}>
        <Typography sx={{
          fontWeight: 700, fontSize: 12.5,
          fontFamily: 'Inter, sans-serif',
          color: '#111827', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {deal.title}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.6}>
          <Eye size={11} color="#D1D5DB" />
          <Typography fontSize={11} color="#9CA3AF" fontFamily="Inter, sans-serif">
            {deal.viewCount || 0} views
          </Typography>
        </Box>
      </Box>

      {/* CTA */}
      <Box
        onClick={() => onDealClick(deal)}
        sx={{
          mx: 1.2, mb: 1.2, borderRadius: '10px',
          background: 'linear-gradient(135deg, #FF6B35, #e55a26)',
          py: 1, textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 3px 10px rgba(255,107,53,0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e55a26, #c94a1e)',
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

export default function LatestDeals() {
  const [deals, setDeals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const pincode = localStorage.getItem('userPinCode');

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        let url = `${hosturl}/home/last/deals`;
        if (pincode && pincode !== 'null' && pincode.trim() !== '') url += `?pinCode=${pincode.trim()}`;
        const r = await fetch(url);
        const d = await r.json();
        if (d.statusCode !== 200 || !d.result) throw new Error(d.displayMessage || 'Failed');
        const matched = Array.isArray(d.result.matchedDeals) ? d.result.matchedDeals : [];
        const panIndia = Array.isArray(d.result.panIndiaDeals) ? d.result.panIndiaDeals : [];
        setDeals([...matched, ...panIndia]);
      } catch {}
      finally { setLoading(false); }
    };
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const { data } = await axios.get(`${hosturl}/user/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
        if (data?.result?.couponIds) setWishlist(data.result.couponIds.map(i => i._id));
      } catch {}
    };
    fetchDeals(); fetchWishlist();
  }, [pincode]);

  const toggleWishlist = async (couponId) => {
    const token = localStorage.getItem('token');
    if (!token) { setOpenSignInDialog(true); return; }
    const isIn = wishlist.includes(couponId);
    try {
      if (isIn) {
        await axios.delete(`${hosturl}/user/wishlist/${couponId}`, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist(p => p.filter(id => id !== couponId));
      } else {
        await axios.post(`${hosturl}/user/wishlist`, { couponId }, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist(p => [...p, couponId]);
      }
    } catch {}
  };

  const handleDealClick = (deal) => {
    const token = localStorage.getItem('token');
    if (!token) { setOpenSignInDialog(true); return; }
    setSelectedDeal(deal); setOpenCouponDialog(true);
  };

  const paginatedDeals = deals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(deals.length / itemsPerPage);

  return (
    <Box sx={{
      position: 'relative',
      py: 5,
      backgroundColor: '#F8FAFC',
      backgroundImage: `radial-gradient(ellipse at top right, rgba(255,107,53,0.06), transparent 60%), radial-gradient(ellipse at bottom left, rgba(230,57,70,0.04), transparent 60%), url(${premiumBg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      borderTop: '1px solid rgba(226,232,240,0.8)',
      borderBottom: '1px solid rgba(226,232,240,0.8)',
    }}>
      <Container>
        {/* Heading */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35, #e63946)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
            }}>
              🕐
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 18,
              fontFamily: 'Inter, sans-serif',
              color: '#0F1B35', letterSpacing: '-0.01em',
            }}>
              Latest Deals
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.3,
            color: '#FF6B35', fontSize: 13, fontWeight: 700,
            fontFamily: 'Inter, sans-serif', cursor: 'pointer',
            borderRadius: '8px', px: 1.2, py: 0.5,
            transition: 'all 0.2s',
            '&:hover': { backgroundColor: '#FFF0EA' },
          }}>
            View All <ChevronRight size={14} />
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: '#FF6B35' }} />
          </Box>
        ) : deals.length === 0 ? (
          <Typography fontSize={13} color="#9CA3AF" fontFamily="Inter, sans-serif">
            No deals available for your location.
          </Typography>
        ) : (
          <>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 2,
              '@media (max-width:900px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
              '@media (max-width:600px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
            }}>
              {paginatedDeals.map((deal, idx) => (
                <DealCard
                  key={deal._id || idx}
                  deal={deal}
                  onDealClick={handleDealClick}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              ))}
            </Box>

            {/* Pagination dots */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3} gap={0.8}>
                {[...Array(totalPages)].map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    sx={{
                      width: i === currentPage ? 24 : 8, height: 8,
                      borderRadius: 4, cursor: 'pointer',
                      backgroundColor: i === currentPage ? '#FF6B35' : '#E5E7EB',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Container>

      <Dialog open={openCouponDialog} onClose={() => setOpenCouponDialog(false)} maxWidth="xl" fullWidth>
        <DialogContent>
          {selectedDeal && <CouponDetailDialog coupon={selectedDeal} onClose={() => setOpenCouponDialog(false)} />}
        </DialogContent>
      </Dialog>
      <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} fullWidth maxWidth="xs">
        <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />
      </Dialog>
    </Box>
  );
}
