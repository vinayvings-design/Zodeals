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
import CommentBox from '../Categories/commentBox';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { StarBorderOutlined } from '@mui/icons-material';

const CouponCard = ({
  brand,
  logo,
  category,
  expiry,
  description,
  views,
  footerColor,
  onViewDetails,
  coupencode,
  onToggleWishlist,
  isWishlisted,
  couponId, applicableProducts
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
            src={`${hosturl}${logo}`}
            crossOrigin="anonymous"
            alt="store"
            style={{ width: "auto", height: 25 }}
          />
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
              {views}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="caption" fontSize="10px">
            <LocalOfferIcon fontSize="inherit" /> {applicableProducts}
          </Typography>
          <Typography variant="caption" fontSize="10px">
            Expires: {expiry}
          </Typography>
        </Box>
        <Box mt={2}>
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
  couponId,
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
          style={{ width: "auto", height: 25 }}
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
          <Typography fontSize={12}>{views}</Typography>
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

const mergeDeals = (matchedDeals = [], panIndiaDeals = []) => {
  const map = new Map();
  matchedDeals.forEach(d => map.set(d._id, d));
  panIndiaDeals.forEach(d => {
    if (!map.has(d._id)) map.set(d._id, d);
  });
  return Array.from(map.values());
};
export default function SingleStoreAllOffers() {
  const location = useLocation();
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const storeId = location.state?.storeId;
  const storeName = location.state?.name || "Store";
  const storeLogo = location.state?.storelogo;

  useEffect(() => {
    if (!storeId) navigate("/stores");
  }, [storeId, navigate]);

  useEffect(() => {
    if (!storeId) return;

    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const pinCode = localStorage.getItem("userPinCode") || "";
        const { data } = await axios.get(
          `${hosturl}/home/deals?pinCode=${pinCode}&storeId=${storeId}&type=Coupon,Deal`
        );

        if (data?.status && data?.result) {
          setCoupons(data.result.matchedDeals);
          setError("");
        } else {
          setCoupons([]);
          setError("No coupons found");
        }
      } catch {
        setCoupons([]);
        setError("Failed to load coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [storeId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${hosturl}/user/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data?.result?.couponIds) {
          setWishlist(res.data.result.couponIds.map(i => i._id));
        }
      })
      .catch(() => { });
  }, []);

  const toggleWishlist = async couponId => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    const exists = wishlist.includes(couponId);

    try {
      if (exists) {
        await axios.delete(`${hosturl}/user/wishlist/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(wishlist.filter(id => id !== couponId));
      } else {
        await axios.post(
          `${hosturl}/user/wishlist`,
          { couponId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, couponId]);
      }
    } catch { }
  };

  return (
    <>
      <Header />
      <Container sx={{ pb: "100px" }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography
            variant="body2"
            onClick={() => navigate("/stores")}
            sx={{ cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center" }}
          >
            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 25 }} />
            Back
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            border: "1px solid #ddd",
            mb: 5
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 80,
                minWidth: 80,
                borderRight: "1px solid #ddd"
              }}
            >
              <Box
                component="img"
                crossOrigin="anonymous"
                src={`${hosturl}${storeLogo}`}
                alt={storeName}
                sx={{ height: 40, px: 1 }}
              />
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {storeName} Coupons & Deals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coupons.length} Coupons and Deals
              </Typography>
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" height={300} justifyContent="center">
            <CircularProgress />
            <Typography mt={2}>Loading store coupons...</Typography>
          </Box>
        ) : coupons.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" height={300} justifyContent="center">
            <LocalOfferIcon sx={{ fontSize: 60 }} />
            <Typography mt={2}>No coupons found for this store</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {coupons.map(coupon => (
              <Grid item xs={12} sm={6} md={4} key={coupon._id}>
                {coupon.type === "Deal" ? (
                  <DealCard
                    {...coupon}
                    couponId={coupon._id}
                    onViewDetails={() => {
                      setSelectedCoupon(coupon);
                      setOpenDialog(true);
                    }}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlist.includes(coupon._id)}
                  />
                ) : (
                  <CouponCard
                    {...coupon}
                    couponId={coupon._id}
                    expiry={coupon.validTill}
                    coupencode={coupon.code}
                    onViewDetails={() => {
                      setSelectedCoupon(coupon);
                      setOpenDialog(true);
                    }}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlist.includes(coupon._id)}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xl" fullWidth>
          <DialogContent>
            <CouponDetailDialog coupon={selectedCoupon} onClose={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} maxWidth="xs" fullWidth>
          <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />
        </Dialog>
      </Container>
      <Footer />
    </>
  );
}

