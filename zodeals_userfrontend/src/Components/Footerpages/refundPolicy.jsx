import React from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  Link,
  Divider,
} from "@mui/material";
import Footer from "../Homepages/footerpage";
import Header from "../MainPage/Header";
import Colors from "../libs/Colors";

const RefundPolicy = () => {
  return (
    <>
      <Header />
      <Container sx={{ fontFamily: "Poppins, sans-serif", mt: 4, mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight={600} color={Colors.primary}>
            Refund Policy
          </Typography>
           <Typography variant="body2" color="text.secondary" gutterBottom>
            Last updated: August 12, 2025
          </Typography>
        </Box>

        <Box>

         
          <Typography paragraph>
            Thank you for shopping at Zodeals. If, for any reason, you are not
            completely satisfied with a purchase, we invite you to review our
            policy on refunds and returns. The following terms are applicable
            for any products that you purchased with us.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Interpretation and Definitions
          </Typography>

          <Typography variant="subtitle1" fontWeight={600}>
            Interpretation
          </Typography>
          <Typography paragraph>
            Words with capitalized initial letters have meanings defined below.
            The definitions apply regardless of whether they appear in singular
            or plural.
          </Typography>

          <Typography variant="subtitle1" fontWeight={600}>
            Definitions
          </Typography>
          <Typography paragraph>
            For the purposes of this Return and Refund Policy:
          </Typography>

          <List sx={{ pl: 3 }}>
            <ListItem disableGutters>
              <Typography>
                <strong>Company</strong> refers to Zodeals, also referred to as
                "the Company", "We", "Us" or "Our".
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                <strong>Goods</strong> refer to the items offered for sale on
                the Service.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                <strong>Orders</strong> mean a request by You to purchase Goods
                from Us.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                <strong>Service</strong> refers to the Website.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                <strong>Website</strong> refers to Zodeals, accessible from{" "}
                <Link
                  href="https://zodeals.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://zodeals.in/
                </Link>
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                <strong>You</strong> means the individual or entity using the
                Service.
              </Typography>
            </ListItem>
          </List>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Your Order Cancellation Rights
          </Typography>
          <Typography paragraph>
            You are entitled to cancel your Order within 7 days without giving
            any reason. The deadline is 7 days from the date you received the
            Goods or a third party you appointed (not the carrier) received the
            Goods.
          </Typography>
          <Typography paragraph>
            To exercise your right of cancellation, contact us via:
          </Typography>
          <List sx={{ pl: 3 }}>
            <ListItem disableGutters>
              <Typography>📧 Email: contact@zodeals.in</Typography>
            </ListItem>
          </List>
          <Typography paragraph>
            We will reimburse you within 14 days of receiving the returned
            Goods, using the same payment method with no additional fees.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Conditions for Returns
          </Typography>
          <Typography paragraph>
            Please ensure the following conditions are met for a return:
          </Typography>
          <List sx={{ pl: 3 }}>
            <ListItem disableGutters>
              <Typography>The Goods were purchased in the last 7 days.</Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>The Goods are in the original packaging.</Typography>
            </ListItem>
          </List>

          <Typography paragraph>
            The following Goods cannot be returned:
          </Typography>
          <List sx={{ pl: 3 }}>
            <ListItem disableGutters>
              <Typography>
                Custom or personalized items.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                Perishable Goods or those with expired dates.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                Opened items not suitable for return for hygiene reasons.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <Typography>
                Goods inseparably mixed with other items post-delivery.
              </Typography>
            </ListItem>
          </List>

          <Typography paragraph>
            We may refuse returns that do not meet these conditions. Sale items
            cannot be refunded unless required by law.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Returning Goods
          </Typography>
          <Typography paragraph>
            You are responsible for the cost and risk of returning items. Please
            return items to:
          </Typography>
          <Typography paragraph>
            1606, 16th Floor, Babu Khan Estates, Basheer Bagh, Hyderabad – 500001
          </Typography>
          <Typography paragraph>
            Use an insured and trackable mail service. We cannot issue a refund
            without receiving the Goods or proof of return.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Gifts
          </Typography>
          <Typography paragraph>
            If the Goods were marked as a gift and shipped directly to you,
            you'll receive a gift credit upon return. Otherwise, the refund will
            go to the original purchaser.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            If you have questions, feel free to contact us:
          </Typography>
          <List sx={{ pl: 3 }}>
            <ListItem disableGutters>
              <Typography>📧 Email: contact@zodeals.in</Typography>
            </ListItem>
          </List>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default RefundPolicy;
