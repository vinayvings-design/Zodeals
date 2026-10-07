import React, { useState, useEffect } from "react";
import {
  Box, Typography, Container, CircularProgress,
} from "@mui/material";
import axios from "axios";
import { hosturl } from "../libs/Constant";
import { ChevronRight } from "lucide-react";

// ── Dummy fallback products ──
const DUMMY_PRODUCTS = [
  {
    _id: 'dp1',
    title: 'pTron Bassbuds Surge TWS Gaming Earbuds',
    storeName: 'Amazon', storeEmoji: '🛒', storeBg: '#FFF8EC', storeColor: '#FF9900',
    price: 3499, discountPercentage: 77, finalPrice: 799,
    productEmoji: '🎧', productBg: '#EEF2FF', link: '/alldeals',
  },
  {
    _id: 'dp2',
    title: 'glitchez Men Slim Fit Striped Casual Shirt',
    storeName: 'Myntra', storeEmoji: 'M', storeBg: '#FFF0F3', storeColor: '#FF3F6C',
    price: 1999, discountPercentage: 81, finalPrice: 379,
    productEmoji: '👕', productBg: '#F0FFF4', link: '/alldeals',
  },
  {
    _id: 'dp3',
    title: 'Tabelito Basic Laptop Sleeve Bag',
    storeName: 'Amazon', storeEmoji: '🛒', storeBg: '#FFF8EC', storeColor: '#FF9900',
    price: 999, discountPercentage: 75, finalPrice: 246,
    productEmoji: '💼', productBg: '#EEF2FF', link: '/alldeals',
  },
  {
    _id: 'dp4',
    title: 'AVAASA Women Leaf Print Straight Kurti',
    storeName: 'AJIO', storeEmoji: 'AJIO', storeBg: '#F5F5F5', storeColor: '#111',
    price: 599, discountPercentage: 49, finalPrice: 305,
    productEmoji: '👗', productBg: '#EEF2FF', link: '/alldeals',
  },
];

// ── Single Deal Card ──
const DealCard = ({ item, onView, isDummy }) => {
  const discount = item.discountPercentage || 0;
  const finalPrice = isDummy
    ? item.finalPrice
    : Math.round(item.price - (item.price * discount) / 100);

  return (
    <Box
      onClick={() => onView(item)}
      sx={{
        borderRadius: '18px',
        backgroundColor: '#fff',
        border: '1.5px solid #EBEBEB',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 2px 10px rgba(15,27,53,0.06)',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.015)',
          boxShadow: '0 20px 48px rgba(15,27,53,0.14)',
          borderColor: '#d0d8ff',
        },
      }}
    >
      {/* ── Image area ── */}
      <Box sx={{
        position: 'relative',
        backgroundColor: item.productBg || '#EEF2FF',
        minHeight: 190,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: 2.5,
      }}>
        {/* Store logo badge — top left */}
        <Box sx={{
          position: 'absolute', top: 12, left: 12,
          width: 42, height: 42, borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', border: '1.5px solid #F0F2F7',
          fontSize: isDummy && item.storeEmoji?.length > 2 ? 8 : 16,
          fontWeight: 900, color: item.storeColor || '#333',
          fontFamily: 'Inter, sans-serif',
        }}>
          {isDummy ? item.storeEmoji : (
            <img
              crossOrigin="anonymous"
              src={`${hosturl}${item.storeLogo}`}
              alt={item.storeName}
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          )}
        </Box>

        {/* Product image / emoji */}
        {isDummy ? (
          <Box sx={{ fontSize: 72, lineHeight: 1, userSelect: 'none' }}>
            {item.productEmoji}
          </Box>
        ) : (
          <img
            crossOrigin="anonymous"
            src={`${hosturl}${item.image}`}
            alt={item.description}
            style={{ maxHeight: 150, maxWidth: '85%', objectFit: 'contain', display: 'block' }}
          />
        )}

        {/* Discount badge — bottom center */}
        {discount > 0 && (
          <Box sx={{
            position: 'absolute', bottom: 0,
            left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#4361EE', color: '#fff',
            borderRadius: '8px 8px 0 0', px: 2, py: 0.5,
            fontWeight: 800, fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', letterSpacing: 0.3,
          }}>
            {discount} % OFF
          </Box>
        )}
      </Box>

      {/* ── Content ── */}
      <Box sx={{ px: 2, pt: 1.8, pb: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        <Typography sx={{
          fontWeight: 700, fontSize: 14, color: '#111827',
          fontFamily: 'Inter, sans-serif', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-0.01em',
        }}>
          {item.title || item.description}
        </Typography>

        {item.storeName && (
          <Typography sx={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            By {item.storeName}
          </Typography>
        )}

        {/* Price row */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 'auto', pt: 0.5 }}>
          <Typography sx={{
            fontWeight: 800, fontSize: 18, color: '#111827',
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1,
          }}>
            ₹{finalPrice?.toLocaleString('en-IN')}
          </Typography>
          {discount > 0 && (
            <Typography sx={{
              fontSize: 13, color: '#9CA3AF',
              fontFamily: 'Inter, sans-serif', fontWeight: 500,
              textDecoration: 'line-through', lineHeight: 1,
            }}>
              ₹{item.price?.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// ── Main section ──
export default function DealsOfTheDay() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDummy, setUseDummy] = useState(false);

  useEffect(() => {
    axios.get(`${hosturl}/products`)
      .then(r => {
        const data = Array.isArray(r.data.result) ? r.data.result : [];
        if (data.length > 0) { setProducts(data); setUseDummy(false); }
        else { setUseDummy(true); }
      })
      .catch(() => setUseDummy(true))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDeal = async (item) => {
    if (useDummy) { window.location.href = '/alldeals'; return; }
    try { await axios.get(`${hosturl}/product/${item._id}`); } catch {}
    if (item.link) window.open(item.link, '_blank');
  };

  const displayProducts = useDummy ? DUMMY_PRODUCTS : products;

  return (
    <Box sx={{ backgroundColor: '#F5F7FA', py: 5 }}>
      <Container>
        {/* Heading */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #4361EE, #3A56D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 14px rgba(67,97,238,0.35)',
            }}>🔥</Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 20,
              fontFamily: 'Inter, sans-serif',
              color: '#111827', letterSpacing: '-0.01em',
            }}>
              Deals of the Day
            </Typography>
          </Box>
          <Box
            component="a" href="/all/deals/today"
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.3,
              color: '#4361EE', fontSize: 13, fontWeight: 700,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              borderRadius: '8px', px: 1.2, py: 0.5, textDecoration: 'none',
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#EEF2FF' },
            }}
          >
            View All <ChevronRight size={14} />
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: '#4361EE' }} />
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}>
            {displayProducts.slice(0, 4).map((item) => (
              <DealCard key={item._id} item={item} onView={handleViewDeal} isDummy={useDummy} />
            ))}
          </Box>
        )}

        {/* Show More button */}
        {displayProducts.length > 0 && (
          <Box textAlign="center" mt={4}>
            <Box
              component="a" href="/all/deals/today"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.8,
                border: '2px solid #4361EE', color: '#4361EE',
                borderRadius: '12px', px: 4, py: 1.3,
                fontWeight: 700, fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none', cursor: 'pointer',
                transition: 'all 0.22s ease',
                '&:hover': {
                  backgroundColor: '#4361EE', color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(67,97,238,0.25)',
                },
              }}
            >
              Show More Deals <ChevronRight size={15} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
