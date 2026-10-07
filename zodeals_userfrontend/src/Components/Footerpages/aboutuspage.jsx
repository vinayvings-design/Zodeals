import React from "react";
import { Container, Typography, Box, Grid, Paper, Divider } from "@mui/material";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import Colors from "../libs/Colors";

const AboutUs = () => {
  return (
    <>
    <Header/>
    <Container maxWidth="lg" sx={{ py: 6, fontFamily: "Poppins, sans-serif" }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4"  style={{color:Colors.primary, fontFamily:'poppins', fontWeight:'600'}}>
          About ZoDeals
        </Typography>
        <Typography variant="h6" mt={2} color="text.secondary">
          Your ultimate savings destination – Best deals. Verified coupons. Unmatched savings.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Who We Are
        </Typography>
       <Typography variant="body1" color="text.secondary">
          <strong>ViratConnects</strong> presents <strong>ZoDeals</strong>, India's growing online coupon and deals discovery platform
          dedicated to helping shoppers save big on every purchase. From electronics and gadgets
          to health, beauty, travel, and food – we bring together deals from your favorite online
          stores like Amazon, Flipkart, Zomato, Nykaa, and many more.
        </Typography>

      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              What We Offer
            </Typography>
            <ul style={{ paddingLeft: 20 }}>
              <li><Typography>🎯 100% Verified Coupons and Promo Codes</Typography></li>
              <li><Typography>🛒 Category-wise curated deals</Typography></li>
              <li><Typography>📦 Offers on top stores & brands</Typography></li>
              <li><Typography>📢 Limited-time flash deals and discounts</Typography></li>
              <li><Typography>🔔 Alerts for trending deals</Typography></li>
            </ul>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Why Zodeals.in?
            </Typography>
            <ul style={{ paddingLeft: 20 }}>
              <li><Typography>🚀 Easy-to-use platform with instant code copy</Typography></li>
              <li><Typography>💸 Maximize your savings across categories</Typography></li>
              <li><Typography>📊 Freshly updated deals – every day</Typography></li>
              <li><Typography>🧠 Smart filters to help you find what matters</Typography></li>
              <li><Typography>🙌 No hidden charges or login required</Typography></li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={8}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We believe shopping should be exciting, not expensive. Our mission is to make online shopping more affordable and enjoyable by helping users access hidden discounts, exclusive promo codes, and seasonal offers – all in one place. Whether you're shopping for a birthday gift or planning a holiday, Zodeals.in helps you save at every step.
        </Typography>
      </Box>

      <Box mt={8}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Categories We Serve
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We cover a wide variety of categories to ensure there's something for everyone:
        </Typography>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><Typography>💻 Electronics & Accessories</Typography></li>
          <li><Typography>💄 Skincare & Beauty Products</Typography></li>
          <li><Typography>🧴 Perfumes & Fragrances</Typography></li>
          <li><Typography>✈️ Travel & Vacation Deals</Typography></li>
          <li><Typography>👗 Fashion & Lifestyle</Typography></li>
          <li><Typography>🍽️ Food & Grocery Offers</Typography></li>
          <li><Typography>🏥 Health & Wellness Coupons</Typography></li>
        </ul>
      </Box>

      <Box mt={8} mb={4}>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight="medium" textAlign="center" color="text.secondary">
          Join thousands of smart shoppers who trust <strong>ZoDeals</strong> every day to get more value for their money.
        </Typography>
        <Typography variant="h5" textAlign="center" mt={3} fontWeight="bold" color="primary">
          Start saving more – the smart way!
        </Typography>
      </Box>
    </Container>
    <Footer/>
    </>
  );
};

export default AboutUs;
