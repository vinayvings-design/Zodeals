import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Modal, 
  TextField, 
  Button, 
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { keyframes } from '@emotion/react';

// Floating animation for the coupon icon
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const PinCodeModal = ({ onPinSubmit, onClose, open }) => {
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    if (!pinCode || pinCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit pin code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPinSubmit(pinCode);
    }, 800);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* Header with close button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Enter Pincode
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Main content */}
        <Box sx={{ p: 3, pt: 2 }}>
          <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
            Enter your location pin code to discover exclusive coupons and deals near you!
          </Typography>

          <TextField
            fullWidth
            label="6-digit Pin Code"
            variant="outlined"
            type="number"
            value={pinCode}
            onChange={(e) => {
              if (e.target.value.length <= 6) {
                setPinCode(e.target.value);
                setErrorMsg('');
              }
            }}
            InputProps={{
              startAdornment: (
                <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {errorMsg && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMsg}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Find Deals'
            )}
          </Button>

          <Divider sx={{ my: 1 }} />

          <Typography variant="body2" color="text.secondary" textAlign="center">
            We'll show you the best offers from stores in your area
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default PinCodeModal;