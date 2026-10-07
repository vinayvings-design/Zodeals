import React from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  Divider,
  Link,
} from "@mui/material";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import Colors from "../libs/Colors";

const ProductPricingPolicy = () => {
  return (
    <>
      <Header />
      <Container sx={{ fontFamily: "Poppins, sans-serif", mt: 4, mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight={600} color={Colors.primary}>
            Product Pricing Policy
          </Typography>
        </Box>

        <Box>
          <Typography paragraph>
            At Zodeals, we offer digital products in the form of coupons,
            promotional codes, and access to special deals from third-party
            merchants.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <List sx={{ pl: 3 }}>
            <ListItem disableGutters>
              <Typography>
                <strong>Pricing:</strong> All prices are listed in INR and are
                final, inclusive of applicable taxes.
              </Typography>
            </ListItem>

            <ListItem disableGutters>
              <Typography>
                <strong>Nature of Products:</strong> We do not sell physical
                goods. All products are digital and delivered instantly after
                payment.
              </Typography>
            </ListItem>

            <ListItem disableGutters>
              <Typography>
                <strong>Payment Terms:</strong> Payments are collected in
                advance through our secure payment gateway.
              </Typography>
            </ListItem>

            <ListItem disableGutters>
              <Typography>
                <strong>Price Changes:</strong> Prices may change at any time
                without prior notice, but changes will not affect purchases
                already completed.
              </Typography>
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography>
            For any pricing-related queries, please contact us at{" "}
            <Link href="mailto:contact@zodeals.in">contact@zodeals.in</Link>.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ProductPricingPolicy;
