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
import OfferCard from '../Categories/OfferCard';
import SignInRequiredPrompt from '../authentications/SigninOverlay';

const CouponCard = (props) => <OfferCard {...props} isDeal={false} />;
const DealCard = (props) => <OfferCard {...props} isDeal />;

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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(350px, 400px))' }, justifyContent: { sm: 'start' }, gap: 4 }}>
            {coupons.map(coupon => (
              <Box key={coupon._id} sx={{ minWidth: 0 }}>
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
              </Box>
            ))}
          </Box>
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

