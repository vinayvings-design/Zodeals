import React from "react";
import { Box, Typography, Button, Container, Paper, Fade } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import LockIcon from '@mui/icons-material/Lock';
import { keyframes } from '@emotion/react';

// Create a gentle pulse animation
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export default function ProtectedRoute() {
  const navigate = useNavigate();
  
  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ 
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6
      }}>
        <Fade in={true} timeout={500}>
          <Paper elevation={6} sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            },
            animation: `${pulse} 3s ease-in-out infinite`,
            maxWidth: '100%',
            width: '100%'
          }}>
            <LockIcon sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }} />
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: 'text.primary',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Login Required
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 3,
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              You need to be logged in to view this page. Please sign in to continue.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    backgroundColor: 'action.hover'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Go Home
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
      <Footer />
    </>
  );
}