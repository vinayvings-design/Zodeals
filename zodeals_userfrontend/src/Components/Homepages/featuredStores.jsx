import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { ChevronRight, Tag } from 'lucide-react';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import { useNavigate } from 'react-router-dom';
import PinCodeModal from '../MainPage/Pincodemodel';

// ── Dummy fallback stores ──
const DUMMY_STORES = [
  { _id: 'd1', name: 'Amazon',  emoji: '🛒', dealCount: 7,  color: '#FF9900', bg: '#FFF8EC' },
  { _id: 'd2', name: 'Myntra',  emoji: 'M',  dealCount: 10, color: '#FF3F6C', bg: '#FFF0F3' },
  { _id: 'd3', name: 'Flipkart',emoji: '🛍️', dealCount: 5,  color: '#2874F0', bg: '#EFF4FF' },
  { _id: 'd4', name: 'AJIO',    emoji: 'AJIO',dealCount: 5, color: '#111',    bg: '#F5F5F5' },
  { _id: 'd5', name: 'Nykaa',   emoji: '💄', dealCount: 8,  color: '#FC2779', bg: '#FFF0F7' },
  { _id: 'd6', name: 'Swiggy',  emoji: '🍔', dealCount: 12, color: '#FC8019', bg: '#FFF4EC' },
  { _id: 'd7', name: 'Meesho',  emoji: '🎁', dealCount: 6,  color: '#9B59B6', bg: '#F8F0FF' },
  { _id: 'd8', name: 'Zomato',  emoji: '🍕', dealCount: 9,  color: '#CB202D', bg: '#FFF0F0' },
];

// ── Store Logo Box (for dummy) ──
const DummyLogo = ({ store }) => (
  <Box sx={{
    width: 64, height: 64, borderRadius: '14px',
    background: store.bg, border: `1.5px solid ${store.color}22`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: store.emoji.length > 2 ? 14 : 32,
    fontWeight: 900, color: store.color, fontFamily: 'Inter, sans-serif',
    letterSpacing: '-0.5px',
  }}>
    {store.emoji}
  </Box>
);

// ── Store Card (same card style as Top Deals) ──
const StoreCard = ({ store, count, isDummy, onClick }) => (
  <Box
    role="link"
    tabIndex={0}
    aria-label={`${store.name} deals`}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    sx={{
      borderRadius: '16px',
      border: '1.5px solid #E8ECF4',
      backgroundColor: '#fff',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
      transition: 'all 0.22s ease',
      boxShadow: '0 1px 4px rgba(15,27,53,0.05)',
      '&:hover': {
        boxShadow: '0 10px 32px rgba(15,27,53,0.10)',
        transform: 'translateY(-4px)',
        borderColor: 'rgba(255,107,53,0.35)',
      },
      '&:focus-visible': { outline: '2px solid #FF6B35', outlineOffset: 2 },
    }}
  >
    {/* Logo area */}
    <Box sx={{
      backgroundColor: isDummy ? (store.bg || '#FAFBFD') : '#FAFBFD',
      p: 2.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 110,
      borderBottom: '1px solid #F0F2F7',
    }}>
      {isDummy ? (
        <DummyLogo store={store} />
      ) : (
        <img
          crossOrigin="anonymous"
          src={`${hosturl}${store.logo}`}
          alt={store.name}
          style={{ height: 46, maxWidth: 100, objectFit: 'contain', display: 'block' }}
        />
      )}
    </Box>

    {/* Content */}
    <Box sx={{ px: 1.5, pt: 1.2, pb: 0.5, flex: 1 }}>
      <Typography sx={{
        fontWeight: 700, fontSize: 12.5, fontFamily: 'Inter, sans-serif',
        color: '#111827', lineHeight: 1.35,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        letterSpacing: '-0.005em',
      }}>
        {store.name}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5} mt={0.6}>
        <Tag size={11} color="#D1D5DB" />
        <Typography fontSize={11} color="#9CA3AF" fontFamily="Inter, sans-serif">
          {count != null ? `${count} ${count === 1 ? 'deal' : 'deals'}` : 'Deals available'}
        </Typography>
      </Box>
    </Box>

    {/* CTA */}
    <Box sx={{
      mx: 1.2, mb: 1.2, borderRadius: '10px',
      background: 'linear-gradient(135deg, #FF6B35, #e55a26)',
      py: 1, textAlign: 'center',
      transition: 'all 0.2s',
      boxShadow: '0 3px 10px rgba(255,107,53,0.25)',
      '[role="link"]:hover > &': {
        background: 'linear-gradient(135deg, #e55a26, #c94a1e)',
        boxShadow: '0 6px 16px rgba(255,107,53,0.35)',
      },
    }}>
      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'Inter, sans-serif', letterSpacing: 0.3 }}>
        View Deals →
      </Typography>
    </Box>
  </Box>
);

const FeaturedStores = () => {
  const [storeLogos, setStoreLogos] = useState([]);
  const [dealCounts, setDealCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [openPinModal, setOpenPinModal] = useState(false);
  const [useDummy, setUseDummy] = useState(false);
  const pincode = localStorage.getItem('userPinCode');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        let url = `${hosturl}/stores`;
        if (pincode && pincode !== 'null' && pincode.trim() !== '') url += `?pinCode=${pincode.trim()}`;
        const r = await axios.get(url);
        if (r.data?.statusCode === 200 && r.data?.result) {
          const { matchedStores, panIndiaStores } = r.data.result;
          const stores = Array.isArray(matchedStores) && matchedStores.length > 0
            ? matchedStores : (Array.isArray(panIndiaStores) ? panIndiaStores : []);
          if (stores.length > 0) {
            setStoreLogos(stores);
            const counts = {};
            await Promise.allSettled(
              stores.slice(0, 20).map(async (store) => {
                try {
                  const res = await axios.get(`${hosturl}/store/${store._id}/deals/count`);
                  if (res.data?.result !== undefined) counts[store._id] = res.data.result;
                } catch { counts[store._id] = store.dealCount ?? null; }
              })
            );
            setDealCounts(counts);
            setUseDummy(false);
          } else {
            setUseDummy(true);
          }
        } else {
          setUseDummy(true);
        }
      } catch { setUseDummy(true); }
      finally { setLoading(false); }
    };
    fetchStores();
  }, [pincode]);

  const displayStores = useDummy ? DUMMY_STORES : storeLogos;

  return (
    <Box sx={{ backgroundColor: '#F5F7FA', pt: 5, pb: 0 }}>
      <Container>
        {/* Heading row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 14px rgba(255,107,53,0.35)',
            }}>
              🏪
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 20,
              fontFamily: 'Inter, sans-serif',
              color: '#111827', letterSpacing: '-0.01em',
            }}>
              Top Stores
            </Typography>
          </Box>
          <Box
            onClick={() => navigate('/stores')}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.3,
              color: '#FF6B35', fontSize: 13, fontWeight: 700,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              borderRadius: '8px', px: 1.2, py: 0.5,
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#FFF0EA' },
            }}
          >
            All Stores <ChevronRight size={14} />
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center" py={3}>
            <CircularProgress sx={{ color: '#FF6B35' }} size={24} />
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)', md: 'repeat(5,1fr)' },
            gap: 2,
          }}>
            {displayStores.slice(0, 10).map((store, idx) => (
              <StoreCard
                key={store._id || idx}
                store={store}
                isDummy={useDummy}
                count={useDummy ? store.dealCount : dealCounts[store._id]}
                onClick={() => useDummy
                  ? navigate('/stores')
                  : navigate('/single-store-page', {
                      state: { storeId: store._id, storelogo: store.logo, name: store.name, description: store.description },
                    })}
              />
            ))}
          </Box>
        )}
      </Container>

      {openPinModal && (
        <PinCodeModal
          open
          onClose={() => setOpenPinModal(false)}
          onPinSubmit={p => { localStorage.setItem('userPinCode', p); setOpenPinModal(false); window.location.reload(); }}
        />
      )}
    </Box>
  );
};

export default FeaturedStores;
