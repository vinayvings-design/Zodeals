import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import Colors from "../libs/Colors";

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <Container sx={{ fontFamily: "Poppins, sans-serif" }}>
        <Box textAlign="center" mb={6} mt={2}>
          <Typography variant="h4" style={{ fontFamily: 'poppins', fontWeight: '600', color: Colors.primary }}>
            Terms and Conditions
          </Typography>
          <Typography variant="body1" mt={2} color="text.secondary">
            Last updated: May 27, 2025
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            By accessing or using the zodeals platform, you agree to comply with and be legally bound by these terms. If you do not agree with any part of the terms, please stop using the site. These terms apply to all users who visit or interact with our services.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            zodeals is a web-based service that provides users with information about discount coupons, promotional offers, and deals from third-party eCommerce platforms. We act as a medium and are not directly involved in the sale of any products or services featured on the site.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            We make efforts to ensure that the offers and deals listed on our platform are accurate and current. However, we do not guarantee the validity, availability, or accuracy of any listed offers. Merchants may update, withdraw, or change offers without notifying zodeals.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            Our platform may contain external links to third-party websites. These websites operate independently, and we are not responsible for their content, privacy practices, or terms of service. We encourage users to review each third party's policies before engaging in transactions.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            You are expected to use zodeals responsibly and for lawful purposes only. Any misuse such as uploading malicious content, manipulating systems, or abusing coupons will result in termination of access and may lead to legal action.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            The content on zodeals, including logos, text, visuals, and layout, is protected by intellectual property laws. Any unauthorized copying, reproduction, or use of our content without permission is strictly prohibited.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            Our service is offered on an "as is" basis. We do not provide any warranties, express or implied, regarding the website’s reliability, performance, or availability. Use of the site is at your own risk.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            zodeals and its team shall not be held liable for any damages arising from the use or inability to use our services or from any transactions made using the deals listed on our platform. Users assume all responsibility when using third-party offers.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            We may revise these terms periodically to reflect changes in services or legal updates. Any modifications will be posted on this page, and continued use of zodeals implies acceptance of the updated terms.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary">
            For any questions or concerns regarding these Terms and Conditions, you can contact us at:
            <br />
            <a href="mailto:support@zodeals">support@zodeals</a>
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
