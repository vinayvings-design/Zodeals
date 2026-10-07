import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { ChevronRight } from 'lucide-react';
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
    width: 40, height: 40, borderRadius: '10px',
    background: store.bg, border: `1.5px solid ${store.color}22`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: store.emoji.length > 2 ? 9 : 18,
    fontWeight: 900, color: store.color, fontFamily: 'Inter, sans-serif',
    letterSpacing: '-0.5px',
  }}>
    {store.emoji}
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
    <Box sx={{ backgroundColor: '#fff', py: 4, borderBottom: '1px solid #F0F2F7' }}>
      <Container>
        {/* Heading row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
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
            display: 'flex', gap: 1.5,
            overflowX: 'auto', pb: 0.5,
            '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none',
          }}>
            {displayStores.slice(0, 30).map((store, idx) => {
              const count = useDummy ? store.dealCount : dealCounts[store._id];
              return (
                <Box
                  key={store._id || idx}
                  onClick={() => !useDummy && navigate('/single-store-page', {
                    state: { storeId: store._id, storelogo: store.logo, name: store.name, description: store.description },
                  })}
                  sx={{
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 1.4,
                    px: 2, py: 1.5,
                    minWidth: 160, maxWidth: 200,
                    borderRadius: '12px',
                    border: '1.5px solid #EBEBEB',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(15,27,53,0.04)',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      borderColor: '#FF6B35',
                      boxShadow: '0 6px 18px rgba(255,107,53,0.14)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Logo */}
                  {useDummy ? (
                    <DummyLogo store={store} />
                  ) : (
                    <Box sx={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        crossOrigin="anonymous"
                        src={`${hosturl}${store.logo}`}
                        alt={store.name}
                        style={{ maxWidth: 40, maxHeight: 36, objectFit: 'contain', display: 'block' }}
                      />
                    </Box>
                  )}

                  {/* Name + deal count */}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{
                      fontWeight: 700, fontSize: 13, color: '#111827',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3,
                    }}>
                      {store.name}
                    </Typography>
                    <Typography sx={{
                      fontSize: 12, color: '#FF6B35',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600, mt: 0.25, lineHeight: 1.2,
                    }}>
                      {count != null ? `${count} Deals` : 'View Deals'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
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
