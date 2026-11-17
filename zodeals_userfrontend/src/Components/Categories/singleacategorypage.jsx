import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
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

import CouponDetailDialog from '../Coupenenables/coupenenable';
import Header from '../MainPage/Header';
import Footer from '../Homepages/footerpage';
import { useLocation, useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import CommentBox from './commentBox';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import FavoriteIcon from '@mui/icons-material/Favorite';

// One card design for both coupons and deals: logo, offer headline, description,
// a blue action button (with the blurred code peeking out for coupons) and a footer.
const OfferCard = ({
  brand,
  logo,
  title,
  description,
  coupencode,
  applicableProducts,
  isDeal,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  couponId,
  viewCount,
}) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  // original button colours: yellow for coupons, navy for deals
  const BTN = isDeal ? '#12253d' : '#F8C433';
  const BTN_TEXT = isDeal ? '#fff' : '#000';

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        backgroundColor: '#fff',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' },
      }}
    >
      <Box sx={{ flexGrow: 1, px: 3.5, pt: 3, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Logo */}
        <Box sx={{ height: 80, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
          {logo && !logoFailed ? (
            <img
              crossOrigin="anonymous"
              src={`${hosturl}${logo}`}
              alt={brand || 'store'}
              onError={() => setLogoFailed(true)}
              style={{ maxWidth: '65%', maxHeight: 76, objectFit: 'contain' }}
            />
          ) : (
            <Typography sx={{ fontWeight: 800, fontSize: 22, color: '#111827' }}>{brand || 'Store'}</Typography>
          )}
        </Box>

        {showCommentBox ? (
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <CommentBox couponId={couponId} />
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 18,
                color: '#111827',
                lineHeight: 1.3,
                mb: 3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                color: '#1F2937',
                lineHeight: 1.45,
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          </>
        )}
      </Box>

      {/* Action button */}
      {!showCommentBox && (
        <Box sx={{ px: 3.5, pb: 2.5 }}>
          <Box sx={{ position: 'relative', height: 56, borderRadius: '4px', overflow: 'hidden', backgroundColor: BTN }}>
            <Button
              fullWidth
              onClick={onViewDetails}
              sx={{
                height: '100%',
                color: BTN_TEXT,
                fontWeight: 500,
                fontSize: 18,
                whiteSpace: 'nowrap',
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                borderRadius: 0,
                backgroundColor: BTN,
                pr: isDeal ? 0 : '16%',
                '&:hover': { backgroundColor: BTN, filter: 'brightness(0.95)' },
              }}
            >
              {isDeal ? 'View Deal' : 'View Code'}
            </Button>
            {!isDeal && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  height: '100%',
                  width: '28%',
                  backgroundColor: '#8B0000',
                  clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 1.5,
                  pointerEvents: 'none',
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, filter: 'blur(1.2px)', userSelect: 'none' }}>
                  {String(coupencode || 'CODE').slice(-4)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px dashed #E5E7EB',
          px: 3.5,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6B7280' }}>
          <VisibilityIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13 }}>{viewCount || 0} views</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={() => setShowCommentBox((v) => !v)} aria-label="comments">
            <ModeCommentOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onToggleWishlist(couponId)} aria-label="favourite">
            {isWishlisted ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(350px, 1fr))' }, gap: 4 }}>
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
