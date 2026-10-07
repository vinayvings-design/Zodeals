import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Avatar,
  Divider,
  CardActions,
  Container,
  Dialog,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

import Colors from '../libs/Colors';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import Header from '../MainPage/Header';
import Footer from '../Homepages/footerpage';
import { useLocation, useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import CommentBox from './commentBox';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CouponCard = ({
  brand,
  logo,
  title,
  expiry,
  description,
  views,
  footerColor,
  onViewDetails,
  coupencode,
  onToggleWishlist,
  isWishlisted,
  couponId, applicableProducts, viewCount
}) => {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleToggleCommentBox = () => setShowCommentBox((prev) => !prev);

  return (
    <Card
      sx={{
        width: '100%',
        minHeight: 240,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent sx={{ p: 2, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <img
            crossOrigin='anonymous'
            src={`${hosturl}${logo}`}
            alt={brand} style={{ width: 100, height: 30 }} variant="square" />
          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton size="small" onClick={handleToggleCommentBox}>
              <ModeCommentOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onToggleWishlist(couponId)}>
              {isWishlisted ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>

            <VisibilityIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              {viewCount}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          {!showCommentBox && (
            <Typography variant="caption" fontSize="10px" px={1}>
              <LocalOfferIcon fontSize="inherit" /> {applicableProducts}
            </Typography>
          )}
        </Box>

        <Box mt={2}>
          {!showCommentBox && (
            <Typography fontWeight="bold" fontSize={14} mb={1} mt={0.5} px={2}>
              {title}
            </Typography>
          )}
          {showCommentBox ? (
            <CommentBox couponId={couponId} />
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="600"
              textAlign="center"
              mt="20px"
            >
              {description}
            </Typography>
          )}

        </Box>
      </CardContent>

      {!showCommentBox && (
        <Box sx={{ position: 'relative', height: 50 }}>
          <Typography
            sx={{
              backgroundColor: '#8B0000',
              height: '100%',
              width: '100%',
              filter: 'blur(1px)',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              marginLeft: '40px',
            }}
          >
            {coupencode}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '75%',
              backgroundColor: footerColor,
              clipPath: 'polygon(0 0, 90% 0, 80% 100%, 0% 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              borderTopLeftRadius: 15,
            }}
          >
            <Button
              sx={{ color: 'black', fontWeight: 'bold', textTransform: 'none', zIndex: 2 }}
              fullWidth
              onClick={onViewDetails}
            >
              View Code
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

const DealCard = ({
  logo,
  brand,
  applicableProducts,
  description,
  views,
  title,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  couponId, viewCount
}) => {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleToggleCommentBox = () => setShowCommentBox((prev) => !prev);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <img
          src={`${hosturl}${logo}`}
          crossOrigin="anonymous"
          alt="store"
          style={{ width: 100, height: 25 }}
        />
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={handleToggleCommentBox}>
            <ModeCommentOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onToggleWishlist(couponId)}>
            {isWishlisted ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>

          <VisibilityIcon fontSize="small" />
          <Typography fontSize={12}>{viewCount}</Typography>
        </Box>
      </Box>
      <Divider />

      <Box sx={{ px: 2, flexGrow: 1, p: 1 }}>
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          {!showCommentBox && (
            <Typography variant="caption" fontSize="10px" px={1}>
              <LocalOfferIcon fontSize="inherit" /> {applicableProducts}
            </Typography>
          )}
        </Box>

        {!showCommentBox && (
          <Typography fontWeight="bold" fontSize={14} mb={1} mt={0.5} px={2}>
            {title}
          </Typography>
        )}
        <Box px={2}>
          {!showCommentBox ? (
            <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
              {description}
            </Typography>
          ) : (
            <CommentBox couponId={couponId} />
          )}
        </Box>
      </Box>
      {!showCommentBox && (
        <CardActions sx={{ justifyContent: 'flex-end', py: 0, px: 0 }}>
          <Button
            size="small"
            variant="contained"
            sx={{ borderRadius: 2, backgroundColor: Colors.secondary, textTransform: 'none', width: 130 }}
            onClick={onViewDetails}
          >
            Deal
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

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
      <Container style={{ paddingBottom: '100px' }}>
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
        <Grid container spacing={3}>
          {coupons.map((coupon, index) => (
            <Grid item xs={12} sm={6} md={4} key={coupon._id || index}>
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
            </Grid>
          ))}
        </Grid>

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
