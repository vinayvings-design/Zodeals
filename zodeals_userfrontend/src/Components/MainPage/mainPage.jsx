import React, { useState, useContext } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { MapPin } from 'lucide-react';

import Header from './Header';
import HomePage from '../Homepages/homePage';
import ShopPage from '../ShopPages/shopPage';
import CategoryPage from '../Categories/categorypage';
import Footer from '../Homepages/footerpage';
import { SearchContext } from './SearchContext';
import { useModal } from '../../context/ModalContext';

export default function MainPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const { searchQuery } = useContext(SearchContext);
  const { openPinModal } = useModal();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0: return <HomePage />;
      case 1: return <ShopPage />;
      case 2: return <CategoryPage />;
      default: return null;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#F7F8FC', minHeight: '100vh' }}>
      <Header tabIndex={tabIndex} handleTabChange={(_, v) => setTabIndex(v)} />
      {searchQuery === '' && renderTabContent()}
      <Footer />
      {isLoggedIn && (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 300 }}>
          <Tooltip title="Change Pin Code">
            <Fab
              onClick={openPinModal}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #e63946)',
                color: '#fff',
                '&:hover': { background: 'linear-gradient(135deg, #e55a26, #c62a35)' },
                boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
              }}
            >
              <MapPin size={22} />
            </Fab>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
