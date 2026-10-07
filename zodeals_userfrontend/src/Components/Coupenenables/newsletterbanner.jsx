import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Grid, InputBase, Snackbar, Alert } from '@mui/material';
import { hosturl } from '../libs/Constant';

const NewsletterBanner = ({ coupon }) => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ open: false, type: '', message: '' });

  const handleSubmit = async () => {
    if (!email || !coupon?.storeId) {
      setAlert({ open: true, type: 'error', message: 'Email and store ID are required.' });
      return;
    }

    try {
      const response = await axios.post(`${hosturl}/coupon/store`, {
        storeId: coupon.storeId,
        email: email,
      });

      if (response.status === 200) {
        setAlert({ open: true, type: 'success', message: 'Email added successfully!' });
        setEmail('');
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Something went wrong.';
      setAlert({ open: true, type: 'error', message: errMsg });
    }
  };

  return (
    <Box sx={{ backgroundColor: '#0d2840', p: 2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={4}>
          <Typography color="white" fontWeight="bold">
            Deals & Coupon drop. You grab them. Simple!
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <InputBase
            fullWidth
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '30px',
              height: '40px',
              paddingLeft: '20px',
              fontFamily: 'Poppins',
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#fcd34d',
              color: '#000',
              borderRadius: '30px',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#facc15',
              },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.type}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewsletterBanner;
