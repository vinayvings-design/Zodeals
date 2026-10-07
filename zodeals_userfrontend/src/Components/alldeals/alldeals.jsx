import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardActions,
  Button,
  Container,
  Grid,
  Divider,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SellIcon from '@mui/icons-material/Sell';
import Colors from '../libs/Colors';
import { useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import Header from '../MainPage/Header';
import Footer from '../Homepages/footerpage';


const TopDeals = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pincode = localStorage.getItem('userPinCode');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${hosturl}/home/deals?pinCode=${pincode}`);
        const data = await response.json();
        if (data.statusCode !== 200 || !data.result) {
          throw new Error(data.displayMessage || 'Failed to fetch deals');
        }
        setDeals(data.result?.matchedDeals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [pincode]);

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
      <Container sx={{ mt: 5, px: 5, mb: 10 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : deals.length === 0 ? (
          <Typography>No deals available for your area.</Typography>
        ) : (
          <Grid container spacing={3}>
            {deals.map((deal, idx) => (
              <Grid item xs={12} sm={6} md={4} key={deal._id || idx}>
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
                  {/* Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <img
                      crossOrigin="anonymous"
                      src={`${hosturl}${deal.logo}`}
                      alt="store logo"
                      style={{ width: 'auto', height: '30px', objectFit: 'contain' }}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton size="small" onClick={() => toggleWishlist(deal._id)}>
                        {wishlist.includes(deal._id) ? (
                          <FavoriteIcon color="error" fontSize="small" />
                        ) : (
                          <FavoriteBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                      <VisibilityIcon fontSize="small" />
                      <Typography fontSize={12}>{deal.viewCount}</Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Content */}
                  <Box sx={{ px: 2, flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={0.5} mt={2} mb={1}>
                      <SellIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {deal.applicableProducts?.[0] || 'Offer'}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold" fontSize={14} mb={1}>
                      {deal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {deal.description}
                    </Typography>
                  </Box>

                  {/* Footer */}
                  <CardActions sx={{ justifyContent: 'flex-end', px: 0, pb: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          setOpenSignInDialog(true);
                        } else {
                          handleOpenDialog(deal); // <-- Open dialog with selected deal
                        }
                      }}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: Colors.secondary,
                        textTransform: 'none',
                        px: 4,
                        width: 130,
                      }}
                    >
                      View Deal
                    </Button>
                  </CardActions>

                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialogs */}
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
};

export default TopDeals;
