import React, { useState } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Dialog,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import SignInRequiredPrompt from '../authentications/SigninOverlay'; // adjust path if needed
import axios from 'axios';
import { hosturl } from '../libs/Constant'; // adjust if needed

const CommentBox = ({ couponId }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    if (!name.trim() || !comment.trim()) {
      showSnackbar('Please fill in both name and comment.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${hosturl}/coupon/comment`,
        { couponId, name, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Comment added successfully!', 'success');
      setName('');
      setComment('');
    } catch (error) {
      if (error.response?.status === 401) {
        showSnackbar('Unauthorized. Please sign in again.', 'error');
        setOpenSignInDialog(true);
      } else if (error.response?.data?.error) {
        showSnackbar(error.response.data.error, 'error');
      } else {
        showSnackbar('Failed to add comment. Try again later.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box border="1px solid #ccc" borderRadius={1} p={2}>
      {/* Name Input */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          px: 1,
          py: 0.5,
          mb: 1.5,
        }}
      >
        <InputBase
          placeholder="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={{ style: { fontSize: '14px', color: 'black' } }}
        />
      </Box>

      {/* Comment Input and Submit */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          px: 1,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <InputBase
          placeholder="Comment"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          inputProps={{ style: { fontSize: '14px', color: 'black' } }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          multiline
          minRows={1}
          maxRows={4}
        />
        <IconButton size="small" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <CircularProgress size={18} />
          ) : (
            <TelegramIcon fontSize="small" sx={{ color: 'black' }} />
          )}
        </IconButton>
      </Box>

      {/* Sign In Dialog */}
      <Dialog
        open={openSignInDialog}
        onClose={() => setOpenSignInDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommentBox;
