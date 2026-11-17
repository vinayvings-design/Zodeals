import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

import CouponDetailDialog from './coupenenable';
import Header from '../MainPage/Header';
import Footer from '../Homepages/footerpage';
import { useLocation, useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import OfferCard from '../Categories/OfferCard';
import NewsletterBanner from './newsletterbanner';

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
  console.log('coupons in relates',coupons)
  const categoryId = location.state?.id;
  const categoryTitle = location.state?.title;
const [randomCoupons, setRandomCoupons] = useState([]);


useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(`${hosturl}/coupons`);
      const allCoupons = data.result;

      // Shuffle and select 6 random coupons
      const shuffled = [...allCoupons].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 6);

      setCoupons(allCoupons); // (optional, if you still need all)
      setRandomCoupons(selected); // <- store only once
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  fetchCoupons();
}, []);


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
      <Container style={{ paddingBottom: '50px', paddingTop: '20px' }}>
        <Box display="flex" alignItems="center" mb={3}>
          {/* <Typography
            variant="body2"
            onClick={() => navigate('/categories')}
            sx={{ cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', mr: 1 }}
          >
            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 25 }} />
          </Typography> */}
          <Typography variant="h6" fontFamily="Poppins" fontWeight="600">
            RelatedOfffers For You
          </Typography>
        </Box>

        {loading &&  <Box  sx={{justifyContent:'center',flex:1}}><CircularProgress /> </Box>}
        {!loading && coupons.length === 0 && <Typography>No coupons found for this category.</Typography>}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(350px, 400px))' }, justifyContent: { sm: 'start' }, gap: 4 }}>
       {randomCoupons.map((coupon, index) => (

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

    </>
  );
}
