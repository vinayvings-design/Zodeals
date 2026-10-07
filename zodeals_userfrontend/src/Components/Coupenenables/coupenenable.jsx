import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Divider,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CloseIcon from '@mui/icons-material/Close';
import Colors from '../libs/Colors';
import RelatedOfffers from './relatedoffers';
import { hosturl } from '../libs/Constant';
import CommentsBox from './AlllCommentsBox';
import axios from 'axios';
import NewsletterBanner from './newsletterbanner';

const CouponDetailDialog = ({ coupon, onClose }) => {
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const token = localStorage.getItem('token');
 const [couponDetails, setCouponDetails] = useState(null);
const [loadingCoupon, setLoadingCoupon] = useState(true);

  useEffect(() => {
  if (!coupon || !coupon._id) return;

const fetchCouponDetails = async () => {
  if (!coupon || !coupon._id) return;

  try {
    const res = await axios.get(`${hosturl}/coupon/${coupon._id}`);
    
    const contentType = res.headers['content-type'];
    if (!contentType.includes('application/json')) {
      throw new Error('Unexpected response format. Expected JSON, got HTML or other.');
    }

    setCouponDetails(res.data.result);
  } catch (err) {
    console.error('Error fetching coupon details:', err);
    setCouponDetails(null); // Safe fallback
  } finally {
    setLoadingCoupon(false);
  }
};


  fetchCouponDetails();
}, [coupon]);


  useEffect(() => {
    if (!coupon || !coupon._id) return;

    const fetchFeedbackCounts = async () => {
      setLoadingCounts(true);
      try {
        const res = await axios.get(`${hosturl}/coupons/working/${coupon._id}`);
        if (res.data?.result) {
          setYesCount(res.data.result.yesCount);
          setNoCount(res.data.result.noCount);
        }
      } catch (err) {
        console.error('Error fetching feedback counts:', err);
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchFeedbackCounts();
  }, [coupon]);

  const submitFeedback = async (message) => {
    try {
      await axios.post(
        `${hosturl}/coupons/working`,
        { couponId: coupon._id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponse(message);

      const res = await axios.get(`${hosturl}/coupons/working/${coupon._id}`);
      if (res.data?.result) {
        setYesCount(res.data.result.yesCount);
        setNoCount(res.data.result.noCount);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  if (!coupon) return null;

 const {
  title,
  logo,
  category,
  validTill,
  description,
  type,
  code,
  link,
} = couponDetails || {};

const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.error('Fallback: Copy command was unsuccessful');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
};

const handleCopyCode = () => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  } else {
    fallbackCopyTextToClipboard(code);
  }
};


  return (
    <Box p={4} sx={{ fontFamily: 'Poppins, sans-serif', position: 'relative', backgroundColor: '#fff' }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
        <CloseIcon />
      </IconButton>

      <Grid container spacing={4} style={{display:"flex",justifyContent:"space-between"}}>
        {/* Left Section */}
        <Grid item xs={12} md={6} >
          <img src={`${hosturl}${logo}`} crossOrigin='anonymous' alt={title} style={{ width: 'auto', height: 40 }} />
          <Box display="flex" alignItems="center" gap={2} mb={1} mt={2}>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                {/* <img
                  src={`${hosturl}${category?.image}`}
                  alt={category?.title}
                  style={{ width: 24, height: 24 }}
                /> */}
                <Typography variant="body2">{category?.title}</Typography>
              </Box>
              <Typography variant="body2">
                Expires: {new Date(validTill).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>

          <Typography gutterBottom sx={{ fontSize: 17, fontWeight: 600 }}>Offer Description</Typography>
          <Typography whiteSpace="pre-line" mb={2} sx={{ fontSize: 15 }}>
            {description}
          </Typography>

          <CommentsBox couponID={coupon._id} />
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={6} mt={4}>
          {type === 'Deal' ? (
            <>
              <Box display='flex' justifyContent='center'>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: '#a52a2a', color: '#fff', fontWeight: 'bold', mb: 2, width: '250px' }}
                >
                  Deal Enabled
                </Button>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: '#ffc107', color: '#000' }}
                    href={link}
                    target="_blank"
                  >
                    Go to the {title} site
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="outlined" >
                    View all {title} Offers
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" sx={{ backgroundColor: '#0d2840' }}>
                    {title}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Button fullWidth variant="contained" onClick={handleCopyCode} sx={{ backgroundColor: '#a52a2a' }}>
                      Copy Code
                    </Button>
                    {copied && (
                      <Typography variant="body2" color="green" mt={1}>
                        Code copied successfully!
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box display="flex" gap={2} mb={3}>
                <Button
                  variant="contained"
                  href={link}
                  target="_blank"
                  style={{ backgroundColor: '#F8C433', textTransform: 'none' }}
                  rel="noopener noreferrer"
                  fullWidth
                >
                  Go to the {title} site
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  style={{ textTransform: 'none', border: '1px solid #98272B' }}
                >
                  View all {title} Offers
                </Button>
              </Box>
            </>
          )}

          {/* Feedback Section */}
          <Box display='flex' justifyContent='center'>
            <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', width: '100%', maxWidth: 400 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Is this coupon working?
              </Typography>
              <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <Button variant="contained" sx={{ backgroundColor: Colors.secondary, px: 5 }} onClick={() => submitFeedback('yes')} disabled={!token}>
                  Yes
                </Button>
                <Button variant="contained" sx={{ backgroundColor: Colors.secondary, px: 5 }} onClick={() => submitFeedback('no')} disabled={!token}>
                  No
                </Button>
              </Box>
              {response && (
                <Typography variant="body2" color="gray">
                  Thanks for your feedback!
                </Typography>
              )}
              {!token && (
                <Typography color="error" fontSize={12}>
                  Please log in to submit feedback.
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Feedback Count */}
          <Box display='flex' justifyContent='center'>
            <Card sx={{ p: 1, width: '400px' }}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">
                        <Typography fontWeight="bold">Yes</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold">No</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">
                        <Typography>
                          {loadingCounts ? '...' : yesCount}
                          <ThumbUpIcon fontSize="small" sx={{ color: 'green', ml: 1 }} />
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography>
                          {loadingCounts ? '...' : noCount}
                          <ThumbDownIcon fontSize="small" sx={{ color: 'red', ml: 1 }} />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: 'black', borderBottomWidth: 2, py: 1, mb: 1 }} />
      <RelatedOfffers />
      <NewsletterBanner coupon={coupon} />
    </Box>
  );
};

export default CouponDetailDialog;
