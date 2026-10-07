import React, { useEffect, useState } from "react";
import {
  Box, Typography, Avatar, Rating, Stack,
  useTheme, useMediaQuery, Container,
} from "@mui/material";
import { Quote } from 'lucide-react';
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { hosturl } from "../libs/Constant";

const token = localStorage.getItem("token");
const axiosInstance = axios.create({
  baseURL: hosturl,
  headers: { Authorization: `Bearer ${token}` },
});

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cReview, setCReview] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axiosInstance.get("/testimonials/approved")
      .then(res => setCReview(
        res.data?.result?.map(i => ({
          name: i?.name,
          date: i?.createdAt?.slice(0, 10),
          rating: i?.rating,
          review: i?.review,
          avatar: i?.profilePic,
        })) || []
      ))
      .catch(console.error);
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 2500,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  if (!cReview.length) return null;

  return (
    <Box sx={{ backgroundColor: '#F5F7FA', py: 5, overflow: 'hidden' }}>
      <Container>
        {/* ── Section heading — matches TopDeals / LatestDeals / FeaturedStores style ── */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 14px rgba(255,107,53,0.35)',
            }}>⭐</Box>
            <Typography sx={{
              fontWeight: 800, fontSize: 20,
              fontFamily: 'Inter, sans-serif',
              color: '#111827', letterSpacing: '-0.01em',
            }}>
              What Our Users Say
            </Typography>
          </Box>
        </Box>

        {/* ── Slider — contained within the same Container ── */}
        <Box sx={{ mx: -1.5 }}>
          <Slider {...settings}>
            {cReview.map((item, idx) => {
              const isCenter = !isMobile && idx === currentSlide % cReview.length;
              return (
                <Box key={idx} px={1.5}>
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: 3,
                      border: isCenter ? '2px solid #FF6B35' : '1.5px solid #E8ECF4',
                      boxShadow: isCenter
                        ? '0 8px 32px rgba(255,107,53,0.14)'
                        : '0 1px 4px rgba(15,27,53,0.05)',
                      p: 2.5,
                      minHeight: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transform: isCenter ? 'scale(1.03)' : 'scale(1)',
                      transition: 'all 0.35s ease',
                    }}
                  >
                    {/* Quote + review text */}
                    <Box mb={1.5}>
                      <Quote size={22} color="#FF6B35" style={{ transform: 'rotate(180deg)' }} />
                      <Typography
                        fontSize={13}
                        color="#4B5563"
                        fontFamily="Inter, sans-serif"
                        lineHeight={1.6}
                        mt={0.8}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.review}
                      </Typography>
                    </Box>

                    {/* Avatar + name + rating */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar
                          alt={item.name}
                          src={item.avatar ? `${hosturl}${item.avatar}` : ""}
                          sx={{ width: 38, height: 38, border: '2px solid rgba(255,107,53,0.25)' }}
                          imgProps={{ crossOrigin: "anonymous" }}
                        />
                        <Box>
                          <Typography fontWeight={700} fontSize={13} fontFamily="Inter, sans-serif" color="#111827">
                            {item.name}
                          </Typography>
                          <Typography fontSize={11} color="#9CA3AF" fontFamily="Inter, sans-serif">
                            {item.date}
                          </Typography>
                        </Box>
                      </Stack>
                      <Rating
                        value={item.rating}
                        readOnly
                        size="small"
                        sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }}
                      />
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Slider>
        </Box>

        {/* ── Dot indicators ── */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, mt: 3 }}>
          {cReview.map((_, i) => (
            <Box
              key={i}
              sx={{
                height: 8,
                width: currentSlide === i ? 24 : 8,
                backgroundColor: currentSlide === i ? '#FF6B35' : '#E5E7EB',
                borderRadius: 4,
                transition: '0.3s',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerReviews;
