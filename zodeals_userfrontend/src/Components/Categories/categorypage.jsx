import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Plane, ShoppingBag, Shirt, Laptop, Sparkles, Smartphone,
  MapPin, Utensils, ShoppingCart, Car, Camera, GraduationCap,
  BookOpen, Heart, Pill, Building2, Home, Leaf, Shield,
  CreditCard, Scissors, Dumbbell, Wrench, Truck, Tag,
  Package, Coffee, Hotel, Zap, Monitor, Wifi, Store,
  FlameIcon, Gift, Stethoscope, Baby, Watch, Headphones,
  UtensilsCrossed, Bike, Tv, Gamepad2, Music, PawPrint,
} from 'lucide-react';
import Footer from '../Homepages/footerpage';
import Header from '../MainPage/Header';
import { hosturl } from '../libs/Constant';

// ── Brand color — matches the logo/header indigo ──
const BRAND = '#4338CA';

// ── Map every category title → lucide icon component ──
const CAT_ICON_MAP = {
  // Travel & Commute
  'flight':                       Plane,
  'travel':                       MapPin,
  'cabs':                         Car,
  'automobiles':                  Car,
  'vehicles':                     Car,

  // Fashion & Apparel
  'fashion':                      Shirt,
  'womens fashion':               Shirt,
  "women's fashion":              Shirt,
  'mens fashion':                 Shirt,
  "men's fashion":                Shirt,
  'kids fashion':                 Baby,
  'footwears':                    Watch,
  'footwear':                     Watch,
  'jewellery':                    Sparkles,

  // Electronics & Devices
  'electronics':                  Laptop,
  'laptops':                      Laptop,
  'mobiles':                      Smartphone,
  'mobile':                       Smartphone,
  'cameras':                      Camera,
  'consumer durables':            Tv,
  'hardware and sanitary':        Wrench,
  'heavy equipments':             Truck,
  'headphones':                   Headphones,
  'recharge':                     Zap,

  // Food & Grocery
  'food':                         Utensils,
  'grocery':                      ShoppingCart,
  'fmcg':                         ShoppingCart,
  'bekary':                       Coffee,
  'bakery':                       Coffee,
  'caterings':                    UtensilsCrossed,
  'catering':                     UtensilsCrossed,
  'restaurants':                  Utensils,

  // Health & Beauty
  'beauty':                       Sparkles,
  'beauty parlours and wellnesss': Scissors,
  'skin care':                    Heart,
  'skincare':                     Heart,
  'pharmacy':                     Pill,
  'medicines':                    Pill,
  'diagnostics':                  Stethoscope,
  'hospitals':                    Building2,
  'herbals and ayurveda':         Leaf,
  'health':                       Heart,
  'fitness and gym':              Dumbbell,
  'fitness':                      Dumbbell,
  'sports':                       Dumbbell,

  // Home & Living
  'home':                         Home,
  'home decor and interiors':     Home,
  'furnitures':                   Monitor,
  'furniture':                    Monitor,
  'kitchen':                      Utensils,

  // Finance & Services
  'banking':                      CreditCard,
  'finance':                      CreditCard,
  'insurance':                    Shield,
  'delivery':                     Package,

  // Shopping & Offers
  'shopping':                     ShoppingBag,
  'e - commerce':                 ShoppingBag,
  'ecommerce':                    ShoppingBag,
  'deals':                        Tag,
  'offers':                       Gift,

  // Education & Entertainment
  'education':                    GraduationCap,
  'books':                        BookOpen,
  'gaming':                       Gamepad2,
  'music':                        Music,
  'entertainment':                Tv,
  'event planners':               Gift,

  // Pets & More
  'pets':                         PawPrint,
  'outdoor':                      Leaf,
};

const FALLBACK_ICONS = [
  ShoppingBag, Plane, Shirt, Laptop, Smartphone,
  Sparkles, Utensils, Heart, Tag, Package,
];

const getIcon = (title, idx) =>
  CAT_ICON_MAP[title?.toLowerCase().trim()] || FALLBACK_ICONS[idx % FALLBACK_ICONS.length];

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${hosturl}/category`)
      .then(r => r.json())
      .then(d => {
        if (d.statusCode === 200 && Array.isArray(d.result)) setCategories(d.result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: '#F5F7FA', minHeight: '100vh', pb: 10 }}>
        <Container maxWidth="lg" sx={{ pt: 4 }}>

          {/* Page heading */}
          <Box display="flex" alignItems="center" gap={1.5} mb={4}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #4338CA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(67,56,202,0.35)',
            }}>
              <ShoppingBag size={22} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{
                fontWeight: 800, fontSize: 22, fontFamily: 'Inter, sans-serif',
                color: '#111827', letterSpacing: '-0.01em', lineHeight: 1.2,
              }}>
                All Categories
              </Typography>
              <Typography sx={{
                fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', fontWeight: 500,
              }}>
                {categories.length} categories available
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box textAlign="center" py={10}>
              <CircularProgress sx={{ color: '#4338CA' }} size={36} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                  sm: 'repeat(4, 1fr)',
                  md: 'repeat(5, 1fr)',
                  lg: 'repeat(6, 1fr)',
                },
                gap: { xs: '16px', sm: '20px', md: '24px' },
                justifyItems: 'center',
                alignItems: 'start',
                mx: 'auto',
              }}
            >
              {categories.map((cat, idx) => {
                const IconComp = getIcon(cat.title, idx);
                return (
                  <Box
                    key={cat._id}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(`/category/${cat.title}`, { state: { id: cat._id, title: cat.title } });
                    }}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        '& .cat-card': {
                          boxShadow: `0 8px 24px rgba(67,56,202,0.18)`,
                          borderColor: '#C7D2FE',
                        },
                      },
                    }}
                  >
                    {/* White Card */}
                    <Box
                      className="cat-card"
                      sx={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        maxWidth: { xs: '90px', sm: '110px', md: '120px' },
                        borderRadius: '16px',
                        backgroundColor: '#fff',
                        border: '1.5px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s ease',
                        mb: 1,
                      }}
                    >
                      <IconComp
                        size={32}
                        color={BRAND}
                        strokeWidth={1.5}
                      />
                    </Box>

                    {/* Label */}
                    <Typography
                      sx={{
                        fontSize: { xs: 10.5, sm: 11.5 },
                        fontWeight: 700,
                        fontFamily: 'Inter, sans-serif',
                        color: '#374151',
                        textAlign: 'center',
                        lineHeight: 1.25,
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                        minHeight: '28px',
                      }}
                    >
                      {cat.title}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CategoriesPage;
