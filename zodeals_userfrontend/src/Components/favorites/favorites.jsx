import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Container,
    Dialog,
    DialogContent,
    CircularProgress,
} from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import Header from '../MainPage/Header';
import Footer from '../Homepages/footerpage';
import { useLocation, useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import OfferCard from '../Categories/OfferCard';
import ProtectedRoute from '../ProtectedComponent/protected';

const CouponCard = (props) => <OfferCard {...props} isDeal={false} />;
const DealCard = (props) => <OfferCard {...props} isDeal />;

export default function Favorites() {
    const location = useLocation();
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openSignInDialog, setOpenSignInDialog] = useState(false);
    const [wishlist, setWishlist] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    useEffect(() => {
        if (!token || role !=="user") {
            setUserNotFound(true);
            setLoading(false);
            return;
        }

        const fetchCoupons = async () => {
            try {
                const { data } = await axios.get(`${hosturl}/user/wishlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setCoupons(data.result?.couponIds ?? []);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load coupons');
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

 
    const fetchWishlist = useCallback(async () => {
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
    }, [hosturl]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);


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
                // Fetch wishlist again after deletion
                await fetchWishlist();
            } else {
                await axios.post(
                    `${hosturl}/user/wishlist`,
                    { couponId },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setWishlist((prev) => [...prev, couponId]);
               await fetchWishlist();

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
      if (userNotFound) {
        return (
          <ProtectedRoute/>
        );
      }

    return (
        <>
            <Header showTabs={true} />
            <Container style={{ paddingBottom: '100px', paddingTop: '50px' }}>
            <Box sx={{ mb: 2, flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 1 }}>
               <FavoriteBorderIcon/><Typography variant='h6' style={{fontFamily:'poppins', fontWeight:'600',}}>Wishlist</Typography>
            </Box>
                {loading && <Box sx={{ justifyContent: 'center', flex: 1 }}><CircularProgress /> </Box>}
                {!loading && coupons.length === 0 && <Typography>No wishlist found.</Typography>}

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
