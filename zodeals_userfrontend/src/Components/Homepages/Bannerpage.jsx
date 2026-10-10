import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  BadgePercent, ChevronRight, ChevronLeft, CircleCheck,
  Sparkles, Star, Shirt, Zap,
} from 'lucide-react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { hosturl } from '../libs/Constant';
import heroShopping  from '../../assets/images/deals-hero-shopping.png';
import bgFashion      from '../../assets/images/bg_womens_fashion.jpg';
import bgElectronics  from '../../assets/images/bg_electronics.jpg';

/* ─── Static data ─────────────────────────────────────────── */
const STATS = [
  { value: '5,000+', label: 'Live Deals' },
  { value: '500+',   label: 'Top Brands' },
  { value: '100%',   label: 'Verified'   },
];

const SLIDES = [
  {
    id: 'deals',
    badge: 'Verified savings, every day',
    badgeBg: '#0F1B35',
    badgeIcon: <Sparkles size={13} color="#FFD60A" />,
    headline: <>Your shortcut to{' '}<span className="hero-accent">better deals.</span></>,
    accentColor: '#FF6B35',
    accentGrad: 'linear-gradient(90deg, #FF6B35, #e63946)',
    subtitle: 'Explore handpicked offers, coupon codes and price drops from the brands you already love.',
    ctaPrimary:   { label: 'Explore deals',  path: '/alldeals' },
    ctaSecondary: { label: 'Browse stores',  path: '/stores'   },
    ctaPrimaryGrad:  'linear-gradient(135deg, #FF6B35, #e63946)',
    ctaPrimaryGradHover: 'linear-gradient(135deg, #e55a26, #c62a35)',
    ctaPrimaryShadow: 'rgba(255,107,53,0.35)',
    ctaSecondaryBorder: '#0F1B35',
    badges: ['Fresh offers daily', 'Curated top brands', 'Quick, simple savings'],
    bg: 'linear-gradient(135deg, #FFF9E6 0%, #FFF4D6 40%, #FFF0E8 100%)',
    dotGrid: '#EDCF6A',
    blob: 'rgba(255,107,53,0.10)',
    heroImg: heroShopping,
    floatCard1: {
      icon: <BadgePercent size={18} color="#fff" />,
      iconBg: 'linear-gradient(135deg, #FF6B35, #FF4500)',
      iconShadow: 'rgba(255,107,53,0.3)',
      title: 'Savings that feel good',
      sub: 'Verified & updated daily',
    },
    floatCard2: {
      icon: <Star size={18} color="#fff" fill="#fff" />,
      iconBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
      iconShadow: 'rgba(245,158,11,0.3)',
      title: '4.9 / 5.0 Rating',
      sub: 'Trusted by users',
    },
  },
  {
    id: 'fashion',
    badge: 'Latest fashion trends',
    badgeBg: '#6D28D9',
    badgeIcon: <Shirt size={13} color="#F9A8D4" />,
    headline: <>Dress to impress,{' '}<span className="hero-accent-fashion">spend less.</span></>,
    accentColor: '#8B5CF6',
    accentGrad: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    subtitle: 'Discover exclusive fashion deals from top brands — women\'s, men\'s, and accessories all in one place.',
    ctaPrimary:   { label: 'Shop fashion',  path: '/alldeals'  },
    ctaSecondary: { label: 'Browse stores', path: '/stores'    },
    ctaPrimaryGrad:  'linear-gradient(135deg, #8B5CF6, #EC4899)',
    ctaPrimaryGradHover: 'linear-gradient(135deg, #7C3AED, #DB2777)',
    ctaPrimaryShadow: 'rgba(139,92,246,0.35)',
    ctaSecondaryBorder: '#6D28D9',
    badges: ['Trending styles', 'Top designer brands', 'Unbeatable prices'],
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 40%, #FCE7F3 100%)',
    dotGrid: '#C4B5FD',
    blob: 'rgba(139,92,246,0.10)',
    heroImg: bgFashion,
    isBgImg: true,
    floatCard1: {
      icon: <Shirt size={18} color="#fff" />,
      iconBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      iconShadow: 'rgba(139,92,246,0.3)',
      title: 'New arrivals weekly',
      sub: 'Curated fashion picks',
    },
    floatCard2: {
      icon: <Star size={18} color="#fff" fill="#fff" />,
      iconBg: 'linear-gradient(135deg, #EC4899, #DB2777)',
      iconShadow: 'rgba(236,72,153,0.3)',
      title: 'Up to 70% off',
      sub: 'On premium brands',
    },
  },
  {
    id: 'electronics',
    badge: 'Best tech deals today',
    badgeBg: '#0369A1',
    badgeIcon: <Zap size={13} color="#38BDF8" />,
    headline: <>Power up with{' '}<span className="hero-accent-tech">epic tech deals.</span></>,
    accentColor: '#0EA5E9',
    accentGrad: 'linear-gradient(90deg, #0EA5E9, #6366F1)',
    subtitle: 'Shop the latest gadgets, smartphones, laptops and accessories at prices you won\'t find anywhere else.',
    ctaPrimary:   { label: 'Shop electronics', path: '/alldeals' },
    ctaSecondary: { label: 'Browse stores',    path: '/stores'   },
    ctaPrimaryGrad:  'linear-gradient(135deg, #0EA5E9, #6366F1)',
    ctaPrimaryGradHover: 'linear-gradient(135deg, #0284C7, #4F46E5)',
    ctaPrimaryShadow: 'rgba(14,165,233,0.35)',
    ctaSecondaryBorder: '#0369A1',
    badges: ['Latest gadgets', 'Certified sellers', 'Price-drop alerts'],
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #E0F2FE 100%)',
    dotGrid: '#93C5FD',
    blob: 'rgba(14,165,233,0.10)',
    heroImg: bgElectronics,
    isBgImg: true,
    floatCard1: {
      icon: <Zap size={18} color="#fff" />,
      iconBg: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
      iconShadow: 'rgba(14,165,233,0.3)',
      title: 'Flash sales daily',
      sub: 'Limited-time tech offers',
    },
    floatCard2: {
      icon: <Star size={18} color="#fff" fill="#fff" />,
      iconBg: 'linear-gradient(135deg, #6366F1, #4F46E5)',
      iconShadow: 'rgba(99,102,241,0.3)',
      title: 'Top-rated products',
      sub: 'Verified by buyers',
    },
  },
];

/* ─── Admin-managed banners ────────────────────────────────── */
// Admin banners reuse the look of the three built-in slides, chosen by colour theme.
const THEME_BASE = { orange: SLIDES[0], purple: SLIDES[1], blue: SLIDES[2] };

// Only in-site paths and http(s) links are ever followed.
const isSafeLink = (link) => {
  if (typeof link !== 'string' || !link) return false;
  if (link.startsWith('/') && !link.startsWith('//')) return true;
  return /^https?:\/\//i.test(link);
};

const buildHeadline = (headline, accentText) => {
  const idx = accentText ? headline.indexOf(accentText) : -1;
  if (idx === -1) return headline;
  return (
    <>
      {headline.slice(0, idx)}
      <span className="hero-accent">{accentText}</span>
      {headline.slice(idx + accentText.length)}
    </>
  );
};

const buildSlideFromBanner = (b) => {
  const base = THEME_BASE[b.theme] || SLIDES[0];
  return {
    id: b._id,
    badge: b.badge || '',
    badgeBg: base.badgeBg,
    badgeIcon: base.badgeIcon,
    headline: buildHeadline(b.headline, b.accentText),
    alt: b.headline,
    accentColor: base.accentColor,
    accentGrad: base.accentGrad,
    subtitle: b.subtitle || '',
    ctaPrimary: b.primaryLabel && isSafeLink(b.primaryLink) ? { label: b.primaryLabel, path: b.primaryLink } : null,
    ctaSecondary: b.secondaryLabel && isSafeLink(b.secondaryLink) ? { label: b.secondaryLabel, path: b.secondaryLink } : null,
    ctaPrimaryGrad: base.ctaPrimaryGrad,
    ctaPrimaryGradHover: base.ctaPrimaryGradHover,
    ctaPrimaryShadow: base.ctaPrimaryShadow,
    ctaSecondaryBorder: base.ctaSecondaryBorder,
    badges: [],
    bg: base.bg,
    dotGrid: base.dotGrid,
    blob: base.blob,
    heroImg: `${hosturl}${b.image}`,
    isBgImg: true,
    isRemoteImg: true,
    floatCard1: null,
    floatCard2: null,
  };
};

/* ─── Custom arrow buttons ─────────────────────────────────── */
const ArrowBtn = ({ onClick, direction }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      [direction === 'prev' ? 'left' : 'right']: { xs: 6, md: 16 },
      zIndex: 10,
      width: { xs: 36, md: 44 },
      height: { xs: 36, md: 44 },
      borderRadius: '50%',
      bgcolor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': { bgcolor: '#fff', boxShadow: '0 6px 22px rgba(0,0,0,0.18)', transform: 'translateY(-50%) scale(1.08)' },
    }}
  >
    {direction === 'prev'
      ? <ChevronLeft  size={20} color="#0F1B35" />
      : <ChevronRight size={20} color="#0F1B35" />}
  </Box>
);

/* ─── Single slide ─────────────────────────────────────────── */
const HeroSlide = ({ slide, navigate }) => {
  const go = (path) => {
    if (path.startsWith('/')) navigate(path);
    else window.open(path, '_blank', 'noopener,noreferrer');
  };
  return (
  <Box sx={{
    position: 'relative', overflow: 'hidden',
    background: slide.bg,
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  }}>
    {/* Dot grid */}
    <Box sx={{
      position: 'absolute', inset: 0,
      backgroundImage: `radial-gradient(${slide.dotGrid} 1px, transparent 1px)`,
      backgroundSize: '22px 22px', opacity: 0.22,
      pointerEvents: 'none',
    }} />
    {/* Blob */}
    <Box sx={{
      position: 'absolute', top: -80, right: -80,
      width: 360, height: 360, borderRadius: '50%',
      background: `radial-gradient(circle, ${slide.blob} 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />

    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 5, md: 7.5 } }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
        gap: { xs: 3, md: 6 },
        alignItems: 'center',
      }}>
        {/* LEFT */}
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          {/* Badge */}
          {slide.badge && (
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.8,
            bgcolor: slide.badgeBg, color: '#fff',
            borderRadius: 50, px: 1.6, py: 0.7, mb: 2.5,
            boxShadow: '0 4px 14px rgba(15,27,53,0.18)',
          }}>
            {slide.badgeIcon}
            <Typography sx={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.9, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
              {slide.badge}
            </Typography>
          </Box>
          )}

          {/* Headline */}
          <Typography component="h1" sx={{
            color: '#0F1B35', fontWeight: 900,
            fontSize: { xs: '2.3rem', sm: '3rem', md: '3.75rem' },
            lineHeight: 1.06, letterSpacing: '-0.05em',
            mb: 2, fontFamily: 'Inter, sans-serif',
            '& .hero-accent, & .hero-accent-fashion, & .hero-accent-tech': {
              color: slide.accentColor,
              position: 'relative',
              '&::after': {
                content: '""', position: 'absolute',
                bottom: 2, left: 0, right: 0, height: '3px',
                background: slide.accentGrad, borderRadius: 2,
              },
            },
          }}>
            {slide.headline}
          </Typography>

          {/* Subtitle */}
          {slide.subtitle && (
          <Typography sx={{
            color: '#4A5568', fontSize: { xs: 14, md: 16 },
            maxWidth: 500, mx: { xs: 'auto', md: 0 },
            lineHeight: 1.7, mb: 3.5,
            fontFamily: 'Inter, sans-serif', fontWeight: 400,
          }}>
            {slide.subtitle}
          </Typography>
          )}

          {/* CTAs */}
          {(slide.ctaPrimary || slide.ctaSecondary) && (
          <Box sx={{
            display: 'flex', gap: 1.5,
            justifyContent: { xs: 'center', md: 'flex-start' },
            flexWrap: 'wrap', mb: 3.5,
          }}>
            {slide.ctaPrimary && (
            <Button
              onClick={() => go(slide.ctaPrimary.path)}
              sx={{
                background: slide.ctaPrimaryGrad,
                color: '#fff', fontWeight: 800, fontSize: 14,
                px: 3.2, py: 1.3, borderRadius: '12px',
                textTransform: 'none',
                boxShadow: `0 6px 20px ${slide.ctaPrimaryShadow}`,
                fontFamily: 'Inter, sans-serif',
                '&:hover': {
                  background: slide.ctaPrimaryGradHover,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 10px 28px ${slide.ctaPrimaryShadow}`,
                },
                transition: 'all 0.25s ease',
              }}
            >
              {slide.ctaPrimary.label} <ChevronRight size={16} style={{ marginLeft: 2 }} />
            </Button>
            )}
            {slide.ctaSecondary && (
            <Button
              onClick={() => go(slide.ctaSecondary.path)}
              sx={{
                color: slide.ctaSecondaryBorder,
                border: `2px solid ${slide.ctaSecondaryBorder}`,
                fontWeight: 700, fontSize: 14,
                px: 3, py: 1.25, borderRadius: '12px',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: slide.ctaSecondaryBorder,
                  color: '#fff', transform: 'translateY(-2px)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {slide.ctaSecondary.label}
            </Button>
            )}
          </Box>
          )}

          {/* Trust badges */}
          {slide.badges.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: { xs: 1.5, md: 2.5 }, flexWrap: 'wrap',
          }}>
            {slide.badges.map(label => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#374151' }}>
                <CircleCheck size={15} color="#10B981" strokeWidth={2.5} />
                <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
          )}
        </Box>

        {/* RIGHT: image */}
        <Box sx={{
          position: 'relative', minHeight: { xs: 260, md: 380 },
          display: { xs: 'none', md: 'block' },
        }}>
          <Box
            component="img"
            src={slide.heroImg}
            alt={slide.alt || slide.badge || ''}
            crossOrigin={slide.isRemoteImg ? 'anonymous' : undefined}
            sx={slide.isBgImg ? {
              position: 'absolute',
              width: '110%', maxWidth: 580,
              right: -30, top: '50%',
              transform: 'translateY(-50%)',
              borderRadius: '20px',
              objectFit: 'cover',
              height: 360,
              filter: 'drop-shadow(0 24px 28px rgba(15,27,53,0.16))',
            } : {
              position: 'absolute',
              width: '118%', maxWidth: 620,
              right: -46, top: '50%',
              transform: 'translateY(-50%)',
              filter: 'drop-shadow(0 24px 28px rgba(15,27,53,0.14))',
            }}
          />

          {/* Float card 1 — bottom right */}
          {slide.floatCard1 && (
          <Box sx={{
            position: 'absolute', right: 24, bottom: 20,
            bgcolor: '#fff', borderRadius: '14px',
            px: 1.8, py: 1.2,
            display: 'flex', alignItems: 'center', gap: 1,
            boxShadow: '0 12px 32px rgba(15,27,53,0.14)',
            border: '1px solid #F0F2F7',
          }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: slide.floatCard1.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${slide.floatCard1.iconShadow}` }}>
              {slide.floatCard1.icon}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 12, color: '#0F1B35', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                {slide.floatCard1.title}
              </Typography>
              <Typography sx={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {slide.floatCard1.sub}
              </Typography>
            </Box>
          </Box>

          )}

          {/* Float card 2 — top left */}
          {slide.floatCard2 && (
          <Box sx={{
            position: 'absolute', left: 20, top: 30,
            bgcolor: '#fff', borderRadius: '14px',
            px: 1.8, py: 1.2,
            display: 'flex', alignItems: 'center', gap: 1,
            boxShadow: '0 12px 32px rgba(15,27,53,0.12)',
            border: '1px solid #F0F2F7',
          }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: slide.floatCard2.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${slide.floatCard2.iconShadow}` }}>
              {slide.floatCard2.icon}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 12, color: '#0F1B35', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                {slide.floatCard2.title}
              </Typography>
              <Typography sx={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {slide.floatCard2.sub}
              </Typography>
            </Box>
          </Box>
          )}
        </Box>
      </Box>

      {/* Stats strip */}
      <Box sx={{
        mt: { xs: 4, md: 5 },
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-start' },
        gap: { xs: 3, md: 5 }, flexWrap: 'wrap',
      }}>
        {STATS.map(({ value, label }) => (
          <Box key={label} sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontWeight: 900, fontSize: { xs: '1.5rem', md: '1.9rem' },
              color: '#0F1B35', fontFamily: 'Inter, sans-serif',
              lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter, sans-serif', fontWeight: 500, mt: 0.2 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
  );
};

/* ─── Main component ───────────────────────────────────────── */
const BannerPage = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  // null while loading; then admin banners, or the built-in slides as fallback.
  const [slides, setSlides] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios.get(`${hosturl}/banners`, { timeout: 6000 })
      .then((res) => {
        const list = Array.isArray(res.data?.result) ? res.data.result : [];
        const built = list.filter((b) => b && b.image && b.headline).map(buildSlideFromBanner);
        if (!cancelled) setSlides(built.length > 0 ? built : SLIDES);
      })
      .catch(() => { if (!cancelled) setSlides(SLIDES); });
    return () => { cancelled = true; };
  }, []);

  const multiple = (slides?.length || 0) > 1;

  const settings = {
    dots: multiple,
    infinite: multiple,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: multiple,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,          // we render custom arrows
    appendDots: dots => (
      <Box sx={{ position: 'absolute', bottom: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ul style={{ margin: 0, padding: 0, display: 'flex', gap: 8 }}>{dots}</ul>
      </Box>
    ),
    customPaging: () => (
      <Box sx={{
        width: 8, height: 8, borderRadius: '50%',
        bgcolor: 'rgba(15,27,53,0.25)',
        transition: 'all 0.3s ease',
        '.slick-active &': { bgcolor: '#0F1B35', width: 24, borderRadius: 4 },
      }} />
    ),
  };

  // Reserve the hero's space while banners load so the page doesn't jump or flash old slides.
  if (slides === null) {
    return <Box sx={{ minHeight: { xs: 480, md: 560 }, background: SLIDES[0].bg }} />;
  }

  return (
    <Box sx={{ position: 'relative', '& .slick-dots li button:before': { display: 'none' } }}>
      <Slider ref={sliderRef} {...settings}>
        {slides.map(slide => (
          <HeroSlide key={slide.id} slide={slide} navigate={navigate} />
        ))}
      </Slider>

      {/* Custom nav arrows */}
      {multiple && <ArrowBtn direction="prev" onClick={() => sliderRef.current?.slickPrev()} />}
      {multiple && <ArrowBtn direction="next" onClick={() => sliderRef.current?.slickNext()} />}
    </Box>
  );
};

export default BannerPage;
