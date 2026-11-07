import React from "react";
import { Container, Typography, Box, Link, List, ListItem } from "@mui/material";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import Colors from "../libs/Colors";

const DeleteAccount = () => (
  <>
    <Header />
    <Container maxWidth="md" sx={{ fontFamily: "Poppins, sans-serif", mt: 4, mb: 8 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={600} color={Colors.primary}>
          Delete Your ZoDeals Account
        </Typography>
      </Box>

      <Typography paragraph>
        You can ask us to delete your ZoDeals account and the personal data linked to it. This covers the
        details you gave us when you signed up: your name, email address, phone number and profile photo, and
        your saved favourites and comments.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3 }}>How to request deletion</Typography>
      <List sx={{ listStyleType: "decimal", pl: 3 }}>
        <ListItem sx={{ display: "list-item", pl: 0.5 }}>
          Send an email to{" "}
          <Link href="mailto:contact@zodeals.in?subject=Account%20deletion%20request">contact@zodeals.in</Link>{" "}
          from the email address registered on your account.
        </ListItem>
        <ListItem sx={{ display: "list-item", pl: 0.5 }}>
          Use the subject line <b>Account deletion request</b>.
        </ListItem>
        <ListItem sx={{ display: "list-item", pl: 0.5 }}>
          In the ZoDeals app you can also go to <b>Account &rarr; Delete account</b>, which opens the same
          request.
        </ListItem>
      </List>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3 }}>What happens next</Typography>
      <Typography paragraph>
        We will check that the request comes from the account owner, then delete the account and the personal
        data associated with it. We may keep limited information where the law requires us to.
      </Typography>
    </Container>
    <Footer />
  </>
);

export default DeleteAccount;
