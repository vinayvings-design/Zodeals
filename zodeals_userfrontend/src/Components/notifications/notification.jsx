import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

import Footer from '../Homepages/footerpage';
import Header from '../MainPage/Header';
import { hosturl } from '../libs/Constant';
import ProtectedRoute from '../ProtectedComponent/protected';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
useEffect(() => {
     if (!token || role !=="user") {
      setUserNotFound(true);
      setLoading(false);
      return;
    }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${hosturl}/notification`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.status === false || !data.result) {
        throw new Error(data.displayMessage || 'Failed to fetch notifications.');
      }

     setNotifications(data.result.notification || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);

  if (userNotFound) {
    return (
      <ProtectedRoute/>
    );
  }

  return (
    <>
      <Header />
      <Container style={{paddingBottom:'100px'}}>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom style={{fontFamily:'poppins', fontWeight:'600'}}>
            Notifications
          </Typography>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && notifications.length === 0 && (
            <Typography>No notifications found.</Typography>
          )}
<Grid container spacing={2}>
  {notifications.map((notification, index) => (
    <Grid item xs={12} key={index}>
      <Box
        p={2}
        border={1}
        borderRadius={2}
        borderColor="grey.300"
        boxShadow={1}
        bgcolor="#f9f9f9"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle1"
            style={{ fontWeight: 600, fontFamily: 'Poppins' }}
          >
            {notification.title}
          </Typography>

          <Typography
            variant="caption"
            color="textSecondary"
            style={{ fontFamily: 'Poppins' }}
          >
            {new Date(notification.date).toLocaleString()}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          mt={1}
          style={{ fontFamily: 'Poppins' }}
        >
          {notification.content}
        </Typography>
      </Box>
    </Grid>
  ))}
</Grid>

        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Notifications;
