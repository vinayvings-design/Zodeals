import React, { useState, useEffect, useCallback } from 'react';
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
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentBox from '../Categories/commentBox';
import ProtectedRoute from '../ProtectedComponent/protected';

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
                        crossOrigin='anonymous'
                        src={`${hosturl}${logo}`}
                        alt={brand} style={{ width: 'auto', height: 30 }} variant="square" />
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
                    style={{ width: 'auto', height: 25 }}
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
