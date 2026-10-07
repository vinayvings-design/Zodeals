import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link as RouterLink } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import logo from "../../assets/images/zodealsLogo.png";
import Addreview from "./Addreview";
import { hosturl } from "../libs/Constant";
import axios from "axios";

const footerLinks = {
  company: [
    { label: "About Us",           path: "/aboutus" },
    { label: "FAQ",                path: "/faq" },
    { label: "Privacy Policy",     path: "/privacy-policy" },
    { label: "Terms & Conditions", path: "/Terms-and-conditions" },
    { label: "Refund Policy",      path: "/refund/policy" },
    { label: "Product Pricing",    path: "/product/pricing/policy" },
  ],
};

const slugify = (t) => t.toLowerCase().replace(/\s+/g, "-");

const ColHeading = ({ children }) => (
  <Box mb={2.5}>
    <Typography sx={{
      fontWeight: 700, fontSize: 15, color: "#fff",
      fontFamily: "Inter, sans-serif", mb: 1, letterSpacing: 0.2,
    }}>
      {children}
    </Typography>
    <Box sx={{ width: 30, height: 3, borderRadius: 2, backgroundColor: "#FF6B35" }} />
  </Box>
);

const FooterLink = ({ to, children, state }) => (
  <ListItem sx={{ py: 0.5, px: 0 }}>
    <Box
      component={RouterLink} to={to} state={state}
      sx={{
        color: "#9CA3AF", fontSize: 13,
        fontFamily: "Inter, sans-serif", fontWeight: 400,
        textDecoration: "none", transition: "color 0.18s",
        "&:hover": { color: "#FF6B35" },
      }}
    >
      {children}
    </Box>
  </ListItem>
);

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [details, setDetails]       = useState({});

  useEffect(() => {
    fetch(`${hosturl}/category`)
      .then((r) => r.json())
      .then((d) => { if (d.result) setCategories(d.result.slice(0, 6)); });
    axios.get(`${hosturl}/contact-us`).then((r) => setDetails(r.data.result)).catch(() => {});
  }, []);

  const socialLinks = [
    { href: details?.facebook,  Icon: FacebookIcon,  color: "#3B82F6", label: "Facebook" },
    { href: details?.instagram, Icon: InstagramIcon, color: "#EC4899", label: "Instagram" },
    { href: details?.linkedIn,  Icon: LinkedInIcon,  color: "#2563EB", label: "LinkedIn" },
    { href: details?.twitter,   Icon: TwitterIcon,   color: "#06B6D4", label: "Twitter" },
  ];

  return (
    <Box component="footer" sx={{ backgroundColor: "#0A1628", color: "#fff" }}>
      {/* Top gradient accent border */}
      <Box sx={{ height: 3, background: "linear-gradient(90deg, #FF6B35 0%, #e63946 50%, #FF6B35 100%)" }} />

      <Container maxWidth="xl" sx={{ pt: 6, pb: 5 }}>
        {/* Single horizontal row: Brand | Top Stores | Categories | Company | Contact Us */}
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          gap: { xs: 4, md: 5 },
        }}>

          {/* 1. Brand column */}
          <Box sx={{ flexShrink: 0, width: { xs: "100%", md: 220 } }}>
            <Box sx={{
              display: "inline-flex", alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "14px", p: 1.5, mb: 2,
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            }}>
              <img src={logo} width={110} alt="ZoDeals"
                style={{ display: "block" }} />
            </Box>

            <Typography fontSize={13} color="#6B7280" fontFamily="Inter, sans-serif"
              mb={3} lineHeight={1.7}>
              Discover verified coupons, deals and offers from 500+ top brands across India.
            </Typography>

            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              {socialLinks.map(({ href, Icon, color, label }) => (
                <a key={label} href={href || "#"} target="_blank" rel="noopener noreferrer">
                  <Box sx={{
                    width: 38, height: 38, borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.22s",
                    "&:hover": {
                      backgroundColor: `${color}25`,
                      borderColor: `${color}60`,
                      transform: "translateY(-3px)",
                      boxShadow: `0 6px 16px ${color}30`,
                    },
                  }}>
                    <Icon sx={{ fontSize: 18, color: "rgba(255,255,255,0.75)" }} />
                  </Box>
                </a>
              ))}
            </Box>

            <Addreview />
          </Box>

          {/* 2-4. Three link columns in one row using CSS grid */}
          <Box sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
          }}>

            {/* Categories */}
            <Box>
              <ColHeading>Categories</ColHeading>
              <List disablePadding>
                {categories.map((cat) => (
                  <FooterLink
                    key={cat._id}
                    to={`/category/${slugify(cat.title)}`}
                    state={{ id: cat._id, title: cat.title }}
                  >
                    {cat.title}
                  </FooterLink>
                ))}
              </List>
            </Box>

            {/* Company */}
            <Box>
              <ColHeading>Company</ColHeading>
              <List disablePadding>
                {footerLinks.company.map((item) => (
                  <FooterLink key={item.label} to={item.path}>{item.label}</FooterLink>
                ))}
              </List>
            </Box>

            {/* Contact Us — same row as Company */}
            <Box>
              <ColHeading>Contact Us</ColHeading>

              {[
                { Icon: Mail,   text: details?.email,         label: "Email" },
                { Icon: Phone,  text: details?.primaryNumber, label: "Phone" },
                { Icon: MapPin, text: details?.location,      label: "Location" },
              ].map(({ Icon, text, label }) => text && (
                <Box key={label} display="flex" alignItems="flex-start" gap={1} mb={1.5}>
                  <Icon size={13} color="#FF6B35" style={{ marginTop: 3, flexShrink: 0 }} />
                  <Typography fontSize={13} color="#9CA3AF" fontFamily="Inter, sans-serif" lineHeight={1.5}>
                    {text}
                  </Typography>
                </Box>
              ))}

              <Box display="flex" flexDirection="column" gap={1} mt={2.5}>
                <Button
                  href="https://partner.zodeals.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #FF6B35, #e63946)",
                    color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12,
                    textTransform: "none", borderRadius: "8px",
                    "&:hover": { background: "linear-gradient(135deg, #e55a26, #c62a35)", transform: "translateY(-1px)" },
                    transition: "all 0.22s",
                  }}
                >
                  Merchant Partnership
                </Button>
                <Button
                  component={RouterLink}
                  to="/agent-contact"
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#9CA3AF", borderColor: "rgba(255,255,255,0.15)",
                    fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12,
                    textTransform: "none", borderRadius: "8px",
                    "&:hover": { backgroundColor: "#FF6B35", borderColor: "#FF6B35", color: "#fff" },
                    transition: "all 0.22s",
                  }}
                >
                  Become an Agent
                </Button>
              </Box>
            </Box>

          </Box>
        </Box>
      </Container>

      {/* Bottom bar */}
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", py: 2.5 }}>
        <Container maxWidth="xl">
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 1,
          }}>
            <Typography fontSize={12} color="#4B5563" fontFamily="Inter, sans-serif">
              © 2025 ZoDeals.in — All Rights Reserved
            </Typography>
            <Typography fontSize={12} color="#4B5563" fontFamily="Inter, sans-serif"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              Built with <Heart size={12} color="#FF6B35" fill="#FF6B35" /> by Aptapace
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
