import React from "react";
import { Box, Typography, Button, Grid, Container, Chip } from "@mui/material";
import { Heart, ArrowRight, Star, Handshake, TrendingUp, Users, BadgePercent } from 'lucide-react';
import bgImage from "../../assets/images/merchant_partner_bg.jpg";
import couponImage from "../../assets/images/coupenimage.png";

/* ─────────────────────────────────────────
   Merchant Partner Banner
───────────────────────────────────────── */
export const MerchantPartnerBanner = () => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 8, md: 11 },
      // Realistic photographic background with rich dark luxury overlay
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(8,16,32,0.94) 0%, rgba(10,22,40,0.88) 55%, rgba(255,107,53,0.28) 100%)',
        backdropFilter: 'blur(1px)',
        zIndex: 1,
      },
    }}
  >
    {/* Decorative top-right glow */}
    <Box sx={{
      position: 'absolute', top: -60, right: -60,
      width: 320, height: 320, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)',
      zIndex: 2, pointerEvents: 'none',
    }} />

    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">

        {/* LEFT — copy */}
        <Grid item xs={12} md={7}>
          {/* Pill badge */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.8,
            bgcolor: 'rgba(255,107,53,0.18)', border: '1px solid rgba(255,107,53,0.4)',
            borderRadius: 50, px: 2, py: 0.7, mb: 2.5,
          }}>
            <Handshake size={14} color="#FF6B35" />
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#FF6B35', letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
              Merchant Partnership
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              color: '#fff', fontWeight: 900,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.8rem' },
              lineHeight: 1.1, letterSpacing: '-0.03em',
              fontFamily: 'Inter, sans-serif', mb: 2,
            }}
          >
            Grow Your Business{' '}
            <Box component="span" sx={{ color: '#FF6B35' }}>
              with ZoDeals
            </Box>
          </Typography>

          <Typography sx={{
            color: 'rgba(255,255,255,0.75)', fontSize: { xs: 14, md: 16 },
            fontFamily: 'Inter, sans-serif', lineHeight: 1.7, mb: 3.5, maxWidth: 520,
          }}>
            Partner with India's fastest-growing deals platform. Reach thousands of deal-seeking customers in your city or across the nation. List your coupons, offers and deals — and watch your sales soar.
          </Typography>

          {/* Stat chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
            {[
              { icon: <Users size={13} />, label: '50K+ Active Users' },
              { icon: <TrendingUp size={13} />, label: '500+ Partner Brands' },
              { icon: <BadgePercent size={13} />, label: '5,000+ Live Deals' },
            ].map(({ icon, label }) => (
              <Box key={label} sx={{
                display: 'flex', alignItems: 'center', gap: 0.7,
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 50, px: 1.8, py: 0.6,
                color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600,
              }}>
                {icon} {label}
              </Box>
            ))}
          </Box>

          {/* CTA */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              href="https://partner.zodeals.in"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #e63946)',
                color: '#fff', fontWeight: 800, fontSize: 14,
                px: 3.5, py: 1.4, borderRadius: '12px',
                textTransform: 'none', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 6px 24px rgba(255,107,53,0.45)',
                display: 'flex', alignItems: 'center', gap: 0.8,
                '&:hover': {
                  background: 'linear-gradient(135deg, #e55a26, #c62a35)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 32px rgba(255,107,53,0.55)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              Become a Partner <ArrowRight size={16} />
            </Button>
            <Button
              href="/product/pricing/policy"
              variant="outlined"
              sx={{
                color: '#fff', borderColor: 'rgba(255,255,255,0.35)',
                fontWeight: 700, fontSize: 14,
                px: 3, py: 1.35, borderRadius: '12px',
                textTransform: 'none', fontFamily: 'Inter, sans-serif',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: '#fff',
                },
                transition: 'all 0.25s ease',
              }}
            >
              View Pricing
            </Button>
          </Box>
        </Grid>

        {/* RIGHT — stat cards */}
        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, width: '100%' }}>
            {[
              { emoji: '📈', title: 'Boost Visibility', desc: 'Get discovered by thousands of active deal hunters daily.' },
              { emoji: '🎯', title: 'Targeted Reach', desc: 'Target by pincode, city, state or go PAN India — your choice.' },
              { emoji: '✅', title: 'Easy Onboarding', desc: 'List your deals in minutes. Our team handles the rest.' },
            ].map(({ emoji, title, desc }) => (
              <Box key={title} sx={{
                bgcolor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '16px', p: 2.5,
                backdropFilter: 'blur(10px)',
                display: 'flex', gap: 1.5, alignItems: 'flex-start',
              }}>
                <Box sx={{ fontSize: 24, lineHeight: 1, mt: 0.2 }}>{emoji}</Box>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Inter, sans-serif', mb: 0.4 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                    {desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

      </Grid>
    </Container>
  </Box>
);

/* ─────────────────────────────────────────
   Favourite Deals Banner (unchanged logic)
───────────────────────────────────────── */
const FavoriteDealsBanner = () => {
  const token = localStorage.getItem("token");

  return (
    <Box sx={{ backgroundColor: '#FFF4EF', py: { xs: 4, md: 5 }, px: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF6B35 0%, #e63946 100%)',
            overflow: 'hidden',
            position: 'relative',
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -20, left: '40%', width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <Heart size={22} color="#FFD700" fill="#FFD700" />
                <Typography sx={{ color: '#FFD700', fontWeight: 800, fontSize: 13, fontFamily: 'Nunito Sans, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Favourites Feature
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1.5, lineHeight: 1.2 }}>
                Never Miss a Deal You Love ❤️
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Nunito Sans, sans-serif', mb: 3, lineHeight: 1.6 }}>
                Save your favourite coupons and deals. Get notified when prices drop or new offers arrive.
              </Typography>

              {!token ? (
                <Button href="/login" variant="contained" sx={{
                  backgroundColor: '#fff', color: '#FF6B35', fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 800, fontSize: 14, px: 3.5, py: 1.2, borderRadius: 2,
                  textTransform: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  '&:hover': { backgroundColor: '#FFF4EF', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: 0.8,
                }}>
                  Sign In to Save <ArrowRight size={16} />
                </Button>
              ) : (
                <Button href="/favorites" variant="contained" sx={{
                  backgroundColor: '#fff', color: '#FF6B35', fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 800, fontSize: 14, px: 3.5, py: 1.2, borderRadius: 2,
                  textTransform: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  '&:hover': { backgroundColor: '#FFF4EF', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: 0.8,
                }}>
                  View My Wishlist <Heart size={16} fill="#FF6B35" />
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={couponImage}
                alt="Favourite Deals"
                sx={{ height: { xs: 140, md: 200 }, objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))', animation: 'float 3s ease-in-out infinite' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FavoriteDealsBanner;

