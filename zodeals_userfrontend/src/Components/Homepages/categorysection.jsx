import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import {
  Plane, ShoppingBag, Shirt, Laptop, Sparkles, Smartphone,
  MapPin, Utensils, ShoppingCart, Car, Camera, GraduationCap,
  Heart, Pill, Building2, Home, Leaf, Shield,
  CreditCard, Scissors, Dumbbell, Wrench, Truck, Tag,
  Package, Coffee, Gift, Stethoscope, Baby, Watch, Headphones,
  UtensilsCrossed, Tv, Gamepad2, Music, PawPrint, Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';

// Brand logo indigo color
const BRAND = '#4338CA';

const CAT_ICON_MAP = {
  'flight':                       Plane,
  'travel':                       MapPin,
  'cabs':                         Car,
  'automobiles':                  Car,
  'fashion':                      Shirt,
  'womens fashion':               Shirt,
  "women's fashion":              Shirt,
  'mens fashion':                 Shirt,
  "men's fashion":                Shirt,
  'kids fashion':                 Baby,
  'footwears':                    Watch,
  'footwear':                     Watch,
  'jewellery':                    Sparkles,
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
  'food':                         Utensils,
  'grocery':                      ShoppingCart,
  'fmcg':                         ShoppingCart,
  'bekary':                       Coffee,
  'bakery':                       Coffee,
  'caterings':                    UtensilsCrossed,
  'catering':                     UtensilsCrossed,
  'restaurants':                  Utensils,
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
  'sports':                       Dumbbell,
  'home':                         Home,
  'home decor and interiors':     Home,
  'furnitures':                   Home,
  'furniture':                    Home,
  'banking':                      CreditCard,
  'finance':                      CreditCard,
  'insurance':                    Shield,
  'delivery':                     Package,
  'shopping':                     ShoppingBag,
  'e - commerce':                 ShoppingBag,
  'deals':                        Tag,
  'offers':                       Gift,
  'education':                    GraduationCap,
  'gaming':                       Gamepad2,
  'music':                        Music,
  'event planners':               Gift,
  'pets':                         PawPrint,
};

const FALLBACK = [
  ShoppingBag, Plane, Shirt, Laptop, Smartphone,
  Sparkles, Utensils, Heart, Tag, Package,
];

const getIcon = (title, idx) =>
  CAT_ICON_MAP[title?.toLowerCase().trim()] || FALLBACK[idx % FALLBACK.length];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [couponCounts, setCouponCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${hosturl}/category`)
      .then(r => r.json())
      .then(d => {
        if (d.statusCode === 200 && Array.isArray(d.result)) {
          setCategories(d.result);
          // fetch coupon counts for every category in parallel
          Promise.all(
            d.result.map(cat =>
              fetch(`${hosturl}/category/coupons/${cat._id}`)
                .then(r => r.json())
                .then(res => ({
                  id: cat._id,
                  count: Array.isArray(res.result) ? res.result.length : 0,
                }))
                .catch(() => ({ id: cat._id, count: 0 }))
            )
          ).then(results => {
            const map = {};
            results.forEach(({ id, count }) => { map[id] = count; });
            setCouponCounts(map);
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ backgroundColor: '#fff', py: { xs: 4, md: 6 }, borderBottom: '1px solid #F0F2F7' }}>
      <Container maxWidth="xl">

        {/* Heading */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #4338CA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(67,56,202,0.35)',
            }}>
              <ShoppingBag size={20} color="#fff" />
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 20,
              fontFamily: 'Inter, sans-serif',
              color: '#0F1B35', letterSpacing: '-0.01em',
            }}>
              Shop by Category
            </Typography>
          </Box>
          <Box
            onClick={() => navigate('/categories')}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.4,
              color: BRAND, fontSize: 13, fontWeight: 700,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              borderRadius: '8px', px: 1.2, py: 0.5,
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#EEF2FF' },
            }}
          >
            View All <ChevronRight size={15} />
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress sx={{ color: BRAND }} size={26} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(4, 1fr)',
                sm: 'repeat(6, 1fr)',
                md: 'repeat(8, 1fr)',
              },
              gap: { xs: '16px 8px', sm: '20px 12px', md: '24px 16px' },
              justifyItems: 'center',
              px: { xs: 1, sm: 2, md: 3 },
              py: { xs: 1.5, md: 2 },
            }}
          >
            {categories.slice(0, 16).map((cat, idx) => {
              const IconComp = getIcon(cat.title, idx);
              const count = couponCounts[cat._id] ?? null;
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
                        boxShadow: '0 8px 20px rgba(67,56,202,0.20)',
                        borderColor: '#6366F1',
                      },
                      '& .coupon-overlay': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  {/* Card with overlay */}
                  <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', mb: 1.2 }}>
                    {/* White outline card */}
                    <Box
                      className="cat-card"
                      sx={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        maxWidth: { xs: '68px', sm: '80px', md: '96px' },
                        borderRadius: '14px',
                        backgroundColor: '#fff',
                        border: '1.5px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <IconComp size={26} color={BRAND} strokeWidth={1.5} />

                      {/* Coupon count overlay */}
                      {count !== null && (
                        <Box
                          className="coupon-overlay"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '13px',
                            background: 'linear-gradient(135deg, #4338CA, #6366F1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transform: 'translateY(6px)',
                            transition: 'opacity 0.22s ease, transform 0.22s ease',
                            gap: 0.2,
                          }}
                        >
                          <Typography sx={{
                            fontSize: { xs: 15, sm: 17 },
                            fontWeight: 800,
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: 1,
                          }}>
                            {count}
                          </Typography>
                          <Typography sx={{
                            fontSize: 8.5,
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.85)',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: 0.3,
                            lineHeight: 1,
                          }}>
                            COUPONS
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Label */}
                  <Typography
                    sx={{
                      fontSize: { xs: 10, sm: 11 },
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      color: '#374151',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word',
                      minHeight: '24px',
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
  );
};

export default CategoriesSection;
