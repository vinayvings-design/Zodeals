import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Container, CircularProgress, Chip } from "@mui/material";
import { ChevronRight } from 'lucide-react';
import axios from "axios";
import { hosturl } from "../libs/Constant";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import AllStoresPage from "./allstoresPage";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
  const [storeLogos, setStoreLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const pincode = localStorage.getItem("userPinCode");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresByPin = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${hosturl}/stores`, {
          params: { pinCode: pincode ? pincode : "" },
        });
        if (response.data?.status && response.data?.result?.matchedStores?.length > 0) {
          setStoreLogos(response.data.result.matchedStores);
        } else {
          setStoreLogos([]);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStoreLogos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStoresByPin();
  }, [pincode]);

  return (
    <Box sx={{ backgroundColor: '#F7F8FC', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ mt: 5, mb: 5 }}>
        {/* Heading */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            variant="h6"
            className="section-title"
            sx={{ fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif', color: '#1A1A2E' }}
          >
            Featured Stores
          </Typography>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.3,
              color: '#FF6B35', fontSize: 13, fontWeight: 700,
              fontFamily: 'Nunito Sans, sans-serif', cursor: 'pointer',
            }}
          >
            All Stores <ChevronRight size={15} />
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center" mt={6}>
            <CircularProgress sx={{ color: '#FF6B35' }} />
          </Box>
        ) : storeLogos.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="#9CA3AF" fontFamily="Nunito Sans, sans-serif">
              No stores found for pin code <strong>{pincode}</strong>.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {storeLogos.slice(0, 24).map((store, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Box
                  onClick={() =>
                    navigate("/single-store-page", {
                      state: { storeId: store._id, logo: store.logo, name: store.name },
                    })
                  }
                  sx={{
                    position: 'relative',
                    height: 90,
                    borderRadius: 2.5,
                    border: '1.5px solid #F3F4F6',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    '&:hover': {
                      borderColor: '#FF6B35',
                      boxShadow: '0 6px 20px rgba(255,107,53,0.15)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Chip
                    label="Offers"
                    size="small"
                    sx={{
                      position: 'absolute', top: 6, right: 6,
                      height: 18, fontSize: 9, fontWeight: 700,
                      backgroundColor: '#00A862', color: '#fff',
                      fontFamily: 'Nunito Sans, sans-serif',
                    }}
                  />
                  <img
                    crossOrigin="anonymous"
                    src={`${hosturl}${store.logo}`}
                    alt={store.name || `Store ${index}`}
                    style={{ maxHeight: 46, maxWidth: "75%", objectFit: "contain" }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <AllStoresPage />
      <Footer />
    </Box>
  );
};

export default ShopPage;
