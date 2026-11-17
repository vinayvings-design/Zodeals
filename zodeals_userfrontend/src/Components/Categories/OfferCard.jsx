import React, { useState } from 'react';
import { Box, Card, Typography, Button, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { hosturl } from '../libs/Constant';
import CommentBox from './commentBox';

// One card design for both coupons and deals: logo, offer headline, description,
// a blue action button (with the blurred code peeking out for coupons) and a footer.
const OfferCard = ({
  brand,
  logo,
  title,
  description,
  coupencode,
  applicableProducts,
  isDeal,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  couponId,
  viewCount,
}) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  // original button colours: yellow for coupons, navy for deals
  const BTN = isDeal ? '#12253d' : '#F8C433';
  const BTN_TEXT = isDeal ? '#fff' : '#000';

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        backgroundColor: '#fff',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' },
      }}
    >
      <Box sx={{ flexGrow: 1, px: 3.5, pt: 3, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Logo */}
        <Box sx={{ height: 80, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
          {logo && !logoFailed ? (
            <img
              crossOrigin="anonymous"
              src={`${hosturl}${logo}`}
              alt={brand || 'store'}
              onError={() => setLogoFailed(true)}
              style={{ maxWidth: '65%', maxHeight: 76, objectFit: 'contain' }}
            />
          ) : (
            <Typography sx={{ fontWeight: 800, fontSize: 22, color: '#111827' }}>{brand || 'Store'}</Typography>
          )}
        </Box>

        {showCommentBox ? (
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <CommentBox couponId={couponId} />
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 18,
                color: '#111827',
                lineHeight: 1.3,
                mb: 3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                color: '#1F2937',
                lineHeight: 1.45,
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          </>
        )}
      </Box>

      {/* Action button */}
      {!showCommentBox && (
        <Box sx={{ px: 3.5, pb: 2.5 }}>
          <Box sx={{ position: 'relative', height: 56, borderRadius: '4px', overflow: 'hidden', backgroundColor: BTN }}>
            <Button
              fullWidth
              onClick={onViewDetails}
              sx={{
                height: '100%',
                color: BTN_TEXT,
                fontWeight: 500,
                fontSize: 18,
                whiteSpace: 'nowrap',
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                borderRadius: 0,
                backgroundColor: BTN,
                pr: isDeal ? 0 : '16%',
                '&:hover': { backgroundColor: BTN, filter: 'brightness(0.95)' },
              }}
            >
              {isDeal ? 'View Deal' : 'View Code'}
            </Button>
            {!isDeal && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  height: '100%',
                  width: '28%',
                  backgroundColor: '#8B0000',
                  clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 1.5,
                  pointerEvents: 'none',
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, filter: 'blur(1.2px)', userSelect: 'none' }}>
                  {String(coupencode || 'CODE').slice(-4)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px dashed #E5E7EB',
          px: 3.5,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6B7280' }}>
          <VisibilityIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13 }}>{viewCount || 0} views</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={() => setShowCommentBox((v) => !v)} aria-label="comments">
            <ModeCommentOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onToggleWishlist(couponId)} aria-label="favourite">
            {isWishlisted ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default OfferCard;
