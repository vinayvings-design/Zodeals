// SignInRequiredPrompt.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Fade, IconButton } from '@mui/material';
import { Close as CloseIcon, Lock as LockIcon } from '@mui/icons-material';

const SignInRequiredPrompt = ({ onClose }) => {
  const navigate = useNavigate();

  const onSignIn = () => {
    navigate('/login');
  };

  return (
    <Fade in={true}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Paper 
          sx={{ 
            padding: 4, 
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
            position: 'relative',
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 6,
              background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
            }
          }}
          elevation={8}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              }
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          
          <LockIcon 
            sx={{ 
              fontSize: 60,
              color: 'primary.main',
              mb: 2,
              background: 'rgba(63, 81, 181, 0.1)',
              borderRadius: '50%',
              padding: 2,
            }} 
          />
          
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              color: 'text.primary',
              mt: 1, fontWeight: 500,fontFamily:'poppins',

            }}
          >
            Signin Required
          </Typography>
          
          <Typography 
            variant="body1" 
            gutterBottom
            sx={{
              color: 'text.secondary',
              mb: 3,fontWeight: 200,fontFamily:'poppins',

            }}
          >
            You need to be signed in to access this content. Please log in or create an account to continue.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2,
              mt: 3,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={onClose}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,fontFamily:'poppins',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Maybe Later
            </Button>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onSignIn}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,fontFamily:'poppins',
                boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Sign In Now
            </Button>
          </Box>
          
          <Typography 
            variant="caption" 
            sx={{
              display: 'block',
              mt: 3,
              color: 'text.disabled', fontWeight: 500,fontFamily:'poppins',

            }}
          >
            Don't have an account?{' '}
            <Button 
              size="small" 
              sx={{
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',fontWeight: 500,fontFamily:'poppins',
                textDecoration: 'underline',
                color: 'primary.main',
                '&:hover': {
                  background: 'transparent',
                  textDecoration: 'underline',
                }
              }}
              onClick={() => navigate('/signup')}
            >
              Create one
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};

export default SignInRequiredPrompt;