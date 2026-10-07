

// Mens Fashion.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  Link,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { hosturl } from "../libs/Constant";
import CouponDetailDialog from "../Coupenenables/coupenenable";
import SignInRequiredPrompt from "../authentications/SigninOverlay";
import VisibilityIcon from '@mui/icons-material/Visibility';
import premiumBg from "../../assets/images/premium_section_bg.jpg";

const CouponCard = ({
  coupon,
  brand,
  discount,
  offer,
  buttonLabel,
  buttonColor,
  logo,
  coupenCode,
  link,
  coupens,
  toggleWishlist,
  wishlist,
  handleOpenDialog,
  setOpenSignInDialog, viewCount
}) => {
  const isCodeCoupon = buttonLabel === "Code";

  return (
    <Card
      sx={{
        width: 260,
        height: "100%",
        minHeight: "280px",
        borderRadius: 3,
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          paddingBottom: "8px !important",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Stack direction="row" alignItems="center">
            <IconButton size="small" onClick={() => toggleWishlist(coupon._id)}>
              {wishlist.includes(coupon._id) ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <VisibilityIcon sx={{ fontSize: 16, color: "green" }} />
            <Typography sx={{ fontSize: 12 }}>{viewCount}</Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
            // mt: 2,
          }}
        >
          <img
            crossOrigin="anonymous"
            src={logo}
            alt={brand}
            style={{
              width: 'auto',
              height: "80px",
              // marginTop: "10px",
            }}
          />
        </Box>

        <Typography
          color="green"
          fontWeight={600}
          fontSize={16}
          textAlign="center"
          mb={0.5} mt={1.5}
        >
          {discount}
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body2"
            fontSize={12}
            color="text.primary"
            sx={{
              whiteSpace: "pre-line",
              textAlign: "center",
              fontWeight: 600,
              mt: 2,
            }}
          >
            {offer}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ position: "relative", height: 35 }}>
        {isCodeCoupon ? (
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Typography
              sx={{
                backgroundColor: "#102E50",
                height: "100%",
                width: "100%",
                filter: "blur(0.8px)",
                color: "white",
                fontWeight: "bold",
                fontSize: 13,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 0,
                marginLeft: "30px",
              }}
            >
              {coupenCode}
            </Typography>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#F8C433",
                  clipPath: "polygon(0 0, 85% 0, 75% 100%, 0% 100%)",
                  height: "100%",
                  width: "75%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                }}
              >
                <Button
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      setOpenSignInDialog(true);
                    } else {
                      handleOpenDialog(coupon);
                    }
                  }}
                  fullWidth
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: 14,
                    height: "100%",
                    minWidth: 0,
                    px: 0,
                    fontFamily: "poppins",
                  }}
                >
                  Code
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: "100%", height: "100%" }}>
            <Button
              fullWidth
              onClick={() => {
                const token = localStorage.getItem('token');
                if (!token) {
                  setOpenSignInDialog(true);
                } else {
                  handleOpenDialog(coupon);
                }
              }}
              variant="contained"
              sx={{
                height: "100%",
                textTransform: "none",
                backgroundColor: buttonColor,
                borderRadius: "6px",
                fontWeight: "bold",
                fontFamily: "poppins",
                fontSize: 12,
                "&:hover": {
                  backgroundColor: buttonColor,
                  opacity: 0.95,
                },
              }}
            >
              {buttonLabel}
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

const Pharmacy = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem('token');
      const pinCode = localStorage.getItem("userPinCode");

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
    console.log("couen", coupon);
    setSelectedCoupon(coupon);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCoupon(null);
  };
useEffect(() => {
  const fetchCoupons = async () => {
    setLoading(true);
    setError("");

    try {

      let url = `${hosturl}/home/deals-coupons`;
      if (pinCode && pinCode !== "null" && pinCode.trim() !== "") {
        url += `?pinCode=${pinCode.trim()}`;
      }

      const { data } = await axios.get(url);

      if (data.statusCode !== 200 || !data.result) {
        throw new Error(data.displayMessage || "Failed to fetch coupons");
      }

      const matchedCoupons = Array.isArray(data.result.matched) ? data.result.matched : [];
      const panIndiaCoupons = Array.isArray(data.result.panIndia) ? data.result.panIndia : [];

      setCoupons([...matchedCoupons, ...panIndiaCoupons]);
    } catch (err) {
      setError(err.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  fetchCoupons();
}, []);


  return (
    <Box sx={{
      position: 'relative',
      py: 5,
      backgroundColor: '#F8FAFC',
      backgroundImage: `radial-gradient(ellipse at top right, rgba(16,185,129,0.06), transparent 60%), radial-gradient(ellipse at bottom left, rgba(5,150,105,0.04), transparent 60%), url(${premiumBg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      borderTop: '1px solid rgba(226,232,240,0.8)',
      borderBottom: '1px solid rgba(226,232,240,0.8)',
    }}>
      <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
          }}>
            💊
          </Box>
          <Typography sx={{
            fontWeight: 800, fontSize: 20, fontFamily: 'Inter, sans-serif',
            color: '#111827', letterSpacing: '-0.01em',
          }}>
            Pharmacy & Health
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
          See all ›
        </Box>
      </Box>

      {loading ? (
        <Stack alignItems="center" mt={4}>
          <CircularProgress />
        </Stack>
      ) : error ? (
        <Alert severity="warning">{error}</Alert>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {coupons
            .filter(item => item.category?.title === "Pharmacy")
            .slice(0, 4)
            .map((item, index) => (
              <Grid item key={index}>
                <CouponCard
                  coupon={item}
                  brand={item.title}
                  discount={
                    item.discountType === "Flat"
                      ? `Flat ₹${item.discountValue} Off`
                      : `Get ${item.discountValue}% Off`
                  }
                  offer={item.description}
                  buttonLabel={item.type === "Coupon" ? "Code" : "Deal"}
                  buttonColor={item.type === "Coupon" ? "#ffde03" : "#b71c1c"}
                  logo={`${hosturl}${item.logo}`}
                  coupenCode={item.code}
                  link={item.link}
                  coupens={76}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  handleOpenDialog={handleOpenDialog}
                  setOpenSignInDialog={setOpenSignInDialog}
                  viewCount={item.viewCount}
                />
              </Grid>
            ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogContent>
          <CouponDetailDialog coupon={selectedCoupon} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>

      <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} fullWidth maxWidth="xs">
        {openSignInDialog && <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />}
      </Dialog>
      </Container>
    </Box>
  );
};

export default Pharmacy;
