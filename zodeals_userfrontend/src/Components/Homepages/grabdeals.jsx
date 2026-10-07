import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import {
  Box, Typography, CircularProgress, useTheme, useMediaQuery, Container,
} from '@mui/material';
import { Timer } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { hosturl } from '../libs/Constant';
import bgGrabDeals from '../../assets/images/bg_grab_deals.jpg';

const DealsCarousel = () => {
  const [timer, setTimer] = useState('23:59:59');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pincode = localStorage.getItem('userPinCode');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Countdown
  useEffect(() => {
    const getNextMidnight = () => {
      const now = new Date();
      const m = new Date(now); m.setHours(24, 0, 0, 0); return m.getTime();
    };
    const target = getNextMidnight();
    const iv = setInterval(() => {
      const dist = target - Date.now();
      if (dist <= 0) { setTimer('00:00:00'); clearInterval(iv); return; }
      const h = String(Math.floor((dist / 3600000) % 24)).padStart(2, '0');
      const m = String(Math.floor((dist / 60000) % 60)).padStart(2, '0');
      const s = String(Math.floor((dist / 1000) % 60)).padStart(2, '0');
      setTimer(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Fetch
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        let url = `${hosturl}/home/deals`;
        if (pincode && pincode !== 'null' && pincode.trim() !== '') url += `?pinCode=${pincode}`;
        const r = await fetch(url);
        const d = await r.json();
        if (d.statusCode !== 200 || !d.result) throw new Error(d.displayMessage || 'Failed');
        const matched = Array.isArray(d.result.matchedDeals) ? d.result.matchedDeals : [];
        const panIndia = Array.isArray(d.result.panIndiaDeals) ? d.result.panIndiaDeals : [];
        setDeals([...matched, ...panIndia]);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchDeals();
  }, [pincode]);

  const settings = {
    dots: false, infinite: true, autoplay: true, autoplaySpeed: 3000,
    speed: 500, slidesToShow: 3, slidesToScroll: 1,
    centerMode: true, centerPadding: '0px', arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: true } },
      { breakpoint: 600,  settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  const [hh, mm, ss] = timer.split(':');

  return (
    <Box sx={{
      position: 'relative',
      py: 6,
      overflow: 'hidden',
      backgroundColor: '#0A1122',
      backgroundImage: `linear-gradient(180deg, rgba(10,17,34,0.86) 0%, rgba(15,23,42,0.92) 100%), url(${bgGrabDeals})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderTop: '2px solid rgba(255,107,53,0.3)',
      borderBottom: '2px solid rgba(255,107,53,0.3)',
      boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
    }}>
      <Container>
        {/* Heading row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 46, height: 46, borderRadius: '14px',
              background: 'linear-gradient(135deg, #FF6B35, #FF1744)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 0 20px rgba(255,107,53,0.6)',
              animation: 'pulse 2s infinite',
            }}>
              ⚡
            </Box>
            <Box>
              <Typography sx={{
                fontWeight: 900, fontSize: { xs: 20, sm: 24 }, fontFamily: 'Inter, sans-serif',
                color: '#FFFFFF', letterSpacing: '-0.02em',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}>
                Grab Before It Ends
              </Typography>
              <Typography sx={{
                fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Inter, sans-serif',
              }}>
                🔥 Flash sale discounts refreshed daily
              </Typography>
            </Box>
          </Box>

          {/* Timer display */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,107,53,0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px', px: 2.5, py: 1.2,
            boxShadow: '0 0 25px rgba(255,107,53,0.25)',
          }}>
            <Timer size={18} color="#FFD60A" />
            <Typography sx={{
              fontSize: 11.5, fontWeight: 800, color: '#FFD60A',
              fontFamily: 'Inter, sans-serif', mr: 0.5, letterSpacing: 0.8,
            }}>
              ENDS IN
            </Typography>
            {[hh, mm, ss].map((unit, i) => (
              <React.Fragment key={i}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #FF1744)',
                  color: '#fff',
                  borderRadius: '9px', px: 1.2, py: 0.4,
                  fontWeight: 900, fontSize: 16,
                  fontFamily: '"Inter", monospace, sans-serif',
                  minWidth: 34, textAlign: 'center', lineHeight: 1.3,
                  boxShadow: '0 2px 10px rgba(255,107,53,0.5)',
                }}>
                  {unit}
                </Box>
                {i < 2 && (
                  <Typography fontWeight={900} fontSize={16} color="#FFD60A">:</Typography>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center" py={5}><CircularProgress sx={{ color: '#FF6B35' }} /></Box>
        ) : error ? (
          <Typography color="error" fontSize={14} fontFamily="Inter, sans-serif">{error}</Typography>
        ) : (
          <Box sx={{ mx: isMobile ? 0 : -3 }}>
            <Slider {...settings}>
              {deals.map((item, idx) => {
                const isCenter = idx === currentSlide % deals.length;
                return (
                  <Box key={idx} px={1.5}>
                    <Box
                      className="hover-lift"
                      sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: isCenter ? '2.5px solid #FF6B35' : '1.5px solid rgba(255,255,255,0.15)',
                        overflow: 'hidden',
                        height: 275,
                        display: 'flex', flexDirection: 'column',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isCenter && !isMobile ? 'scale(1.05)' : 'scale(0.96)',
                        boxShadow: isCenter
                          ? '0 20px 45px rgba(255,107,53,0.35), 0 0 20px rgba(255,107,53,0.2)'
                          : '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Gradient top strip */}
                      <Box sx={{
                        height: 5,
                        background: isCenter
                          ? 'linear-gradient(90deg, #FF6B35, #FF1744)'
                          : 'linear-gradient(90deg, #E2E8F0, #CBD5E1)',
                      }} />

                      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.2}>
                          <img
                            crossOrigin="anonymous"
                            src={`${hosturl}${item.logo}`}
                            alt="logo"
                            style={{ height: 32, maxWidth: 100, objectFit: 'contain' }}
                          />
                          <Box sx={{
                            background: 'rgba(255,107,53,0.12)',
                            color: '#FF6B35',
                            px: 1, py: 0.3, borderRadius: '6px',
                            fontSize: 10.5, fontWeight: 800, fontFamily: 'Inter, sans-serif',
                          }}>
                            ⚡ LIMITED
                          </Box>
                        </Box>

                        <Typography sx={{
                          fontWeight: 800, fontSize: 14,
                          fontFamily: 'Inter, sans-serif',
                          color: '#0F1B35', mb: 0.6,
                          lineHeight: 1.35, letterSpacing: '-0.01em',
                        }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{
                          fontSize: 12, color: '#64748B',
                          fontFamily: 'Inter, sans-serif', flex: 1, lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {item.description}
                        </Typography>
                      </Box>

                      <Box sx={{
                        background: isCenter
                          ? 'linear-gradient(135deg, #FF6B35, #FF1744)'
                          : '#F1F5F9',
                        py: 1.4, textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.25s',
                        boxShadow: isCenter ? '0 -2px 10px rgba(255,107,53,0.3)' : 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55a26, #d50000)',
                        },
                      }}>
                        <Typography sx={{
                          color: isCenter ? '#fff' : '#475569',
                          fontWeight: 900, fontSize: 12.5,
                          fontFamily: 'Inter, sans-serif',
                          letterSpacing: 0.8,
                        }}>
                          GRAB DEAL NOW →
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Slider>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DealsCarousel;
