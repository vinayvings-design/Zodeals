import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

import CouponDetailDialog from '../Coupenenables/coupenenable';
import Header from '../MainPage/Header';
import Footer from '../Homepages/footerpage';
import { useLocation, useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import OfferCard from './OfferCard';
import SignInRequiredPrompt from '../authentications/SigninOverlay';

const CouponCard = (props) => <OfferCard {...props} isDeal={false} />;
const DealCard = (props) => <OfferCard {...props} isDeal />;

export default function SingleCategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const categoryId = location.state?.id;
  const categoryTitle = location.state?.title;
  useEffect(() => {
    if (!categoryId || !categoryTitle) {
      navigate('/categories');
    }
  }, [categoryId, categoryTitle, navigate]);

  useEffect(() => {
  if (!categoryId) return;

  setCoupons([]); // Clear previous data if any
  setError(null);
  setLoading(true);

  const fetchCoupons = async () => {
    try {
      const pinCode = localStorage.getItem('userPinCode');

      const url = pinCode
        ? `${hosturl}/category/coupons/${categoryId}?pinCode=${encodeURIComponent(pinCode)}`
        : `${hosturl}/category/coupons/${categoryId}`;

      const { data } = await axios.get(url);

      if (!data.status || !data.result) {
        setCoupons([]);
        setError(data.displayMessage || 'No coupons found.');
      } else {
        setCoupons(data.result);
        setError(null);
      }
    } catch (err) {
      setCoupons([]);
      setError(err.response?.data?.error || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  fetchCoupons();
}, [categoryId]);


  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${hosturl}/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data?.result?.couponIds) {
          setWishlist(data.result.couponIds.map((item) => item._id));
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (couponId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    const isInWishlist = wishlist.includes(couponId);

    try {
      if (isInWishlist) {
        await axios.delete(`${hosturl}/user/wishlist/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== couponId));
      } else {
        await axios.post(
          `${hosturl}/user/wishlist`,
          { couponId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist((prev) => [...prev, couponId]);
      }
    } catch (error) {
      alert('Failed to update wishlist.');
    }
  };

  const handleOpenDialog = (coupon) => {
    setSelectedCoupon(coupon);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCoupon(null);
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" style={{ paddingBottom: '100px' }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography
            variant="body2"
            onClick={() => navigate('/categories')}
            sx={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', mr: 1 }}
          >
            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 25 }} />
          </Typography>
          <Typography variant="h6" fontFamily="Poppins" fontWeight="600">
            {/* {categoryTitle} */}
            Category
          </Typography>
        </Box>

        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="300px"
            width="100%"
            textAlign="center"
          >
            <CircularProgress sx={{ color: '#888' }} />
            <Typography
              variant="h6"
              sx={{ mt: 2, color: '#555', fontWeight: 500, fontFamily: 'Poppins' }}
            >
              Loading coupons...
            </Typography>
          </Box>
        ) : coupons.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="300px"
            width="100%"
            textAlign="center"
          >
            <LocalOfferIcon sx={{ fontSize: 60, color: '#888' }} />
            <Typography
              variant="h6"
              sx={{ mt: 2, color: '#555', fontWeight: 500, fontFamily: 'Poppins' }}
            >
              No coupons found for this store.
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(350px, 400px))' }, justifyContent: { sm: 'start' }, gap: 4 }}>
          {coupons.map((coupon, index) => (
            <Box key={coupon._id || index} sx={{ minWidth: 0 }}>
              {coupon.type === 'Deal' ? (
                <DealCard
                  {...coupon}
                  couponId={coupon._id}
                  onViewDetails={() => handleOpenDialog(coupon)}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(coupon._id)}
                  viewCount={coupon.viewCount}

                />
              ) : (
                <CouponCard
                  {...coupon}
                  couponId={coupon._id}
                  expiry={coupon.validTill}
                  coupencode={coupon.code}
                  footerColor="#F8C433"
                  onViewDetails={() => handleOpenDialog(coupon)}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(coupon._id)}
                  viewCount={coupon.viewCount}
                />
              )}
            </Box>
          ))}
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
          <DialogContent>
            <CouponDetailDialog coupon={selectedCoupon} onClose={handleCloseDialog} />
          </DialogContent>
        </Dialog>

        <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} fullWidth maxWidth="xs">
          {openSignInDialog && <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />}
        </Dialog>
      </Container>
      <Footer />
    </>
  );
}
