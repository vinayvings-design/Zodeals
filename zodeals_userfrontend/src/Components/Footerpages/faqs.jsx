import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../Homepages/footerpage";
import Header from "../MainPage/Header";
import Colors from "../libs/Colors";

const Faqs = () => {
  return (
    <>
     <Header/>
    <Container maxWidth="md" sx={{ py: 6, fontFamily: "Poppins, sans-serif" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" style={{fontFamily:'poppins', fontWeight:'600', color:Colors.primary}}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={2}>
          Get answers to common questions about Zodeals and how it works.
        </Typography>
      </Box>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">What is Zodeals?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            Zodeals is a coupon and deals aggregator platform that brings you
            the best offers from top brands in categories like electronics, fashion,
            skincare, travel, and more.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">How do I use a coupon code?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            Simply click on the "Get Code" or "Grab Deal" button, and the code will
            be copied or applied automatically. You will then be redirected to the
            store’s website to complete your purchase with the discount.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Are the deals on Zodeals always up to date?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            We update our deals regularly to ensure you get the latest and working
            offers. However, deal validity depends on the merchant, so we recommend
            checking the expiry before applying.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Do I need to register to use Zodeals?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            No, you don’t need to create an account. All deals and coupons are
            accessible to everyone for free.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Can I submit a coupon?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            Absolutely! If you have a coupon you'd like to share, contact us through
            our support or email us at <strong>support@Zodeals</strong> and our team
            will verify and publish it if eligible.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Is there a mobile app for Zodeals?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            Not yet! But we’re working on a mobile-friendly version and will soon launch
            an app for a seamless deals experience on the go.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">How can I stay updated on new deals?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            You can subscribe to our newsletter or follow us on social media to receive
            updates on the latest deals, seasonal offers, and exclusive discounts.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
    <Footer/>
    </>
  );
};

export default Faqs;
