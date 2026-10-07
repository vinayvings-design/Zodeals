import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Menu,
  Button,
  IconButton
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../MainPage/SearchContext';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const SearchResults = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [storeLogos, setStoreLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const pincode = localStorage.getItem('userPinCode');
  const navigate = useNavigate();
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    const fetchStoresByPin = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${hosturl}/stores/${pincode}`);
        if (response.data?.status && response.data?.result?.length > 0) {
          setStoreLogos(response.data.result);
        } else {
          setStoreLogos([]);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setStoreLogos([]);
      } finally {
        setLoading(false);
      }
    };

    if (pincode) {
      fetchStoresByPin();
    }
  }, [pincode]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setAnchorEl(null);
  };

  const filteredStores = storeLogos.filter((store) => {
    const name = store.name?.toLowerCase() || '';
    const matchesLetter = selectedLetter === 'All' || name.startsWith(selectedLetter.toLowerCase());
    const matchesQuery = !searchQuery || name.includes(searchQuery.toLowerCase());
    return matchesLetter && matchesQuery;
  });

  return (
    <Container sx={{ mt: 5, paddingBottom: '100px' }}>
      <Box mb={3}>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{ disablePadding: true }}
          PaperProps={{
            sx: {
              backgroundColor: '#0c2d59',
              padding: 2,
              maxWidth: 250,
              marginTop: '10px'
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 1,
              fontSize: '13px',
            }}
          >
            A to Z Stores
          </Typography>

          <Grid container spacing={1} justifyContent="center">
            {alphabet.map((letter) => (
              <Grid item xs={2.4} sm={2.4} key={letter} sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={() => handleLetterSelect(letter)}
                  sx={{
                    color: 'white',
                    fontSize: '12px',
                    padding: '6px',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: selectedLetter === letter ? '2px solid white' : 'none',
                    '&:hover': {
                      backgroundColor: '#17457a',
                    },
                  }}
                >
                  {letter}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Menu>
      </Box>

      {filteredStores.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
        >
          <SearchOffIcon sx={{ fontSize: 60, color: '#888' }} />
          <Typography
            variant="h6"
            sx={{ mt: 2, color: '#555', fontWeight: 500, fontFamily: 'Poppins' }}
          >
            No stores found, please try another one
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredStores.map((store, index) => (
            <Grid item xs={4} sm={2} md={2} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  navigate('/single-store-page', {
                    state: {
                      storeId: store._id,
                    },
                  })
                }
                sx={{
                  height: 70,
                  borderRadius: 2,
                  borderBottomRightRadius: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 1,
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <img
                  crossOrigin="anonymous"
                  src={`${hosturl}${store.logo}`}
                  alt={store.name || `Store ${index}`}
                  style={{
                    maxHeight: 40,
                    maxWidth: '80%',
                    objectFit: 'contain',
                  }}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
