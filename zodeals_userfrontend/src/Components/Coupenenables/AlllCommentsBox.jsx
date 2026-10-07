import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, CardContent, CircularProgress, Alert } from '@mui/material';
import axios from 'axios'; // Make sure you have axios installed
import { hosturl } from '../libs/Constant';

export default function CommentsBox({ couponID }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Coupon ID:", couponID);
  useEffect(() => {
    if (!couponID) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${hosturl}/coupon/comment/${couponID}`);

    if (response.data && response.data.result && Array.isArray(response.data.result.comments)) {
      setComments(response.data.result.comments);
      } else {
        setComments([]);
      }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [couponID]);

  return (
    <Box mt={3} sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
      <Typography style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Poppins' }}>Comments</Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && comments.length === 0 && (
        <Typography variant="body2" color="text.secondary" mt={2}>No comments available.</Typography>
      )}

      {comments.map((item, idx) => (
        <Card key={idx} variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
          <CardContent>
            <Typography fontWeight="600" fontSize={14}>Name: {item.name}</Typography>
            <Typography fontSize={12}>Comment: {item.comment}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
