import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import Footer from "../Homepages/footerpage";
import Header from "../MainPage/Header";
import Colors from "../libs/Colors";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <Container sx={{ fontFamily: "Poppins, sans-serif" }}>
        <Box textAlign="center" mb={6} mt={2}>
          <Typography variant="h4" style={{ fontFamily: "Poppins", fontWeight: "600", color: Colors.primary }}>
            Privacy Policy
          </Typography>
          <Typography variant="body1" mt={2} color="text.secondary">
            Last updated: May 27, 2025
          </Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box mb={4}>
          <Typography variant="body1" color="text.secondary" paragraph>
            At Zodeals.in, we are committed to protecting the privacy and security of your personal information.
            This Privacy Policy describes how we collect, use, disclose, and safeguard your data when you visit
            our website. By accessing or using Zodeals.in, you agree to the terms and conditions outlined in
            this policy.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            When you interact with our platform, we may collect personal details such as your name, email
            address, contact number, and location, especially when you register or contact us. Additionally,
            we collect non-personal data such as browser type, IP address, device information, and site usage
            patterns through cookies and analytics tools. This data helps us understand how visitors use our
            website and allows us to enhance the user experience.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            The information we collect is primarily used to provide you with a seamless and personalized
            experience on our site. We may use your data to communicate with you, respond to inquiries,
            process transactions, and send you relevant updates or promotional materials. We are committed
            to using your data in a lawful, fair, and transparent manner, ensuring that your rights are always
            protected.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            We do not sell, trade, or rent your personal information to third parties. However, in some cases,
            we may share your information with trusted service providers who help us operate our website and
            deliver services to you. These partners are bound by confidentiality agreements and are only allowed
            to use your information for the purposes specified by Zodeals.in.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            To protect your data, we employ industry-standard security measures including encryption,
            access controls, and secure server hosting. However, no method of data transmission or storage
            is completely secure, and we cannot guarantee the absolute security of your information.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Our website uses cookies and similar tracking technologies to improve functionality and analyze
            traffic. Cookies are small files stored on your device that help remember your preferences and
            track your activity. You can manage your cookie settings through your browser, but disabling
            cookies may limit some features of the website.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            You have full control over your personal data. You may request access to the information we hold
            about you, ask us to correct inaccurate details, or request deletion of your data under certain
            circumstances. You can also opt out of receiving marketing communications at any time by using the
            unsubscribe link in our emails or by contacting us directly.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Zodeals.in is not designed for use by individuals under the age of 13. We do not knowingly collect
            personal information from children. If we become aware that we have unintentionally collected data
            from a child, we will promptly delete such information from our records.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            This Privacy Policy may be updated from time to time to reflect changes in our practices,
            technologies, or legal requirements. When we make changes, we will revise the "Last updated" date
            at the top of this page. We encourage you to review this policy periodically to stay informed about
            how we are protecting your data.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            If you have any questions or concerns regarding this Privacy Policy or how we handle your personal
            data, please contact us at <a href="mailto:support@zodeals.in">support@zodeals.in</a>. We value your
            trust and are committed to resolving any issues promptly and transparently.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
