import React, { useState, useEffect, useContext } from 'react';
import {
  Box, InputBase, IconButton, Menu, MenuItem,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  useMediaQuery, useTheme, Divider, Typography, Badge, Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search, Heart, Bell, User, Menu as MenuIcon, X,
  ShoppingBag, Plane, Utensils, Shirt, Laptop,
  Sparkles, LogOut, LogIn, Home, Store,
  Tag, Smartphone, ChevronRight, LayoutGrid,
} from 'lucide-react';
import Logo from '../../assets/images/zodealsLogo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import SearchResults from '../Serachresults/searchResult';
import { SearchContext } from './SearchContext';

// ── Navbar — unique lucide icon per item, no repeats ──
const NAV_ITEMS = [
  { label: 'Home',        Icon: Home,        color: '#4B5563', bg: '#F3F4F6', border: '#D1D5DB', path: '/' },
  { label: 'Stores',      Icon: Store,        color: '#FF6B35', bg: '#FFF0EA', border: '#FFD8CC', path: '/stores' },
  { label: 'Shopping',    Icon: ShoppingBag,  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', path: '/categories' },
  { label: 'Travel',      Icon: Plane,        color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', path: '/categories' },
  { label: 'Food',        Icon: Utensils,     color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', path: '/categories' },
  { label: 'Fashion',     Icon: Shirt,        color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8', path: '/categories' },
  { label: 'Electronics', Icon: Laptop,       color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD', path: '/categories' },
  { label: 'Beauty',      Icon: Sparkles,     color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', path: '/categories' },
  { label: 'Mobile',      Icon: Smartphone,   color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', path: '/categories' },
  { label: 'All Deals',   Icon: Tag,          color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', path: '/alldeals' },
];

// Styled search box — pill shape
const SearchBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#F5F7FA',
  border: '1.5px solid #E8ECF4',
  borderRadius: 50,
  padding: '7px 18px',
  flex: '1 1 0',
  minWidth: 0,
  transition: 'border-color 0.22s, box-shadow 0.22s, background 0.22s',
  '&:focus-within': {
    backgroundColor: '#fff',
    borderColor: '#FF6B35',
    boxShadow: '0 0 0 3px rgba(255,107,53,0.12)',
  },
}));

export default function Header({ showTabs = true }) {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl]     = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetch(`${hosturl}/notification/count`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.status && typeof d.result === 'number') setNotifCount(d.result); })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    ['token', 'role', 'userPinCode'].forEach(k => localStorage.removeItem(k));
    setAnchorEl(null);
    window.location.replace('/');
  };

  // ── Nav item — unique SVG icon, perfectly aligned ──
  const NavItem = ({ label, Icon, color, bg, border, path }) => {
    const active = location.pathname === path;
    return (
      <Box
        onClick={() => { navigate(path); setSearchQuery(''); }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          py: 0.8,
          px: { xs: 0.8, sm: 1.2, md: 1.6 },
          flexShrink: 0,
          cursor: 'pointer',
          borderBottom: `2.5px solid ${active ? color : 'transparent'}`,
          transition: 'all 0.2s ease',
          borderRadius: '8px 8px 0 0',
          '&:hover': {
            backgroundColor: bg,
            transform: 'translateY(-2px)',
            '& .ni-box': {
              borderColor: color,
              boxShadow: `0 4px 12px ${color}25`,
            },
            '& .ni-label': { color },
          },
        }}
      >
        {/* Unique icon box */}
        <Box
          className="ni-box"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: bg,
            border: `1.5px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: `0 1px 4px ${color}10`,
          }}
        >
          <Icon size={17} color={color} strokeWidth={2} />
        </Box>

        {/* Label */}
        <Typography
          className="ni-label"
          sx={{
            fontSize: { xs: 9.5, sm: 10, md: 10.5 },
            fontWeight: 700,
            color: active ? color : '#6B7280',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
            transition: 'color 0.2s ease',
            mt: 0.2,
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  };



  return (
    <Box
      component="header"
      sx={{
        position: 'sticky', top: 0, zIndex: 1100,
        backgroundColor: '#fff',
        boxShadow: '0 1px 0 #E8ECF4, 0 4px 16px rgba(15,27,53,0.06)',
      }}
    >
      {/* ── ANNOUNCEMENT BAR ── */}
      <Box sx={{
        background: 'linear-gradient(90deg, #0F1B35 0%, #1a2d54 50%, #0F1B35 100%)',
        color: '#fff', minHeight: 30, px: { xs: 2, md: 4 },
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
      }}>
        <Typography sx={{
          fontSize: 11, fontWeight: 600, letterSpacing: 0.15,
          fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.88)',
        }}>
          ✨ Save more on the brands you love — verified deals, updated daily.
        </Typography>
        {!isMobile && (
          <Box
            onClick={() => navigate('/alldeals')}
            sx={{
              fontSize: 11, fontWeight: 800, color: '#FFD60A',
              cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif', letterSpacing: 0.5,
              display: 'flex', alignItems: 'center', gap: 0.3,
              '&:hover': { color: '#FFE55C' },
              transition: 'color 0.2s',
            }}
          >
            TODAY'S TOP DEALS <ChevronRight size={13} />
          </Box>
        )}
      </Box>

      {/* ── TOP ROW ── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 },
        px: { xs: 1.5, md: 4 }, py: { xs: 0.8, md: 1.2 },
        borderBottom: '1px solid #F3F4F7',
      }}>
        {/* Logo */}
        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer', flexShrink: 0 }}>
          <img src={Logo} alt="ZoDeals" height={isMobile ? 30 : 38} style={{ objectFit: 'contain', display: 'block' }} />
        </Box>

        {/* Search — desktop */}
        {!isMobile && (
          <SearchBox>
            <Search size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
            <InputBase
              sx={{
                ml: 1.2, flex: 1, fontSize: 13.5,
                fontFamily: 'Inter, sans-serif',
                '& input::placeholder': { color: '#9CA3AF' },
              }}
              placeholder="Search stores, coupons, brands..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.3, ml: 0.5 }}>
                <X size={13} color="#9CA3AF" />
              </IconButton>
            )}
          </SearchBox>
        )}

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.2, md: 0.8 }, flexShrink: 0, ml: 'auto' }}>
          {/* Mobile search */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileSearch(p => !p)}
              sx={{
                width: 36, height: 36,
                backgroundColor: mobileSearch ? '#FFF0EA' : 'transparent',
                borderRadius: '10px',
                '&:hover': { backgroundColor: '#F5F7FA' },
              }}
            >
              <Search size={18} color="#374151" />
            </IconButton>
          )}

          {/* Favourites */}
          <Box
            onClick={() => navigate('/favorites')}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 0.15, cursor: 'pointer', px: { xs: 0.6, md: 1 }, py: { xs: 0.4, md: 0.6 },
              borderRadius: '10px', transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#FFF0EA' },
            }}
          >
            <Heart size={isMobile ? 20 : 19} color="#FF6B35" strokeWidth={1.8} />
            {!isMobile && (
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Saved
              </Typography>
            )}
          </Box>

          {/* Notifications */}
          <Box
            onClick={() => navigate('/notifications')}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 0.15, cursor: 'pointer', px: { xs: 0.6, md: 1 }, py: { xs: 0.4, md: 0.6 },
              borderRadius: '10px', transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#F5F7FA' },
            }}
          >
            <Badge
              badgeContent={notifCount}
              color="error"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 9, minWidth: 16, height: 16, fontFamily: 'Inter, sans-serif',
                },
              }}
            >
              <Bell size={19} color="#374151" strokeWidth={1.8} />
            </Badge>
            {!isMobile && (
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Alerts
              </Typography>
            )}
          </Box>

          {/* Account */}
          <Box
            onClick={e => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.15,
              cursor: 'pointer', px: { xs: 0.7, md: 1.2 }, py: { xs: 0.4, md: 0.6 },
              borderRadius: '10px', border: '1.5px solid',
              borderColor: token ? '#FF6B35' : '#E8ECF4',
              backgroundColor: token ? '#FFF0EA' : 'transparent',
              '&:hover': {
                borderColor: '#FF6B35',
                backgroundColor: '#FFF0EA',
              },
              transition: 'all 0.2s',
            }}
          >
            <User size={17} color={token ? '#FF6B35' : '#374151'} strokeWidth={token ? 2.2 : 1.8} />
            {!isMobile && (
              <Typography sx={{
                fontSize: 10, fontWeight: 700,
                color: token ? '#FF6B35' : '#374151',
                fontFamily: 'Inter, sans-serif',
              }}>
                Account
              </Typography>
            )}
          </Box>

          {/* Mobile menu */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ width: 36, height: 36, borderRadius: '10px', '&:hover': { backgroundColor: '#F5F7FA' } }}
            >
              <MenuIcon size={20} color="#374151" />
            </IconButton>
          )}
        </Box>

        {/* Account menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1.2, borderRadius: '14px', minWidth: 180,
              boxShadow: '0 8px 40px rgba(15,27,53,0.12)',
              border: '1px solid #E8ECF4',
              overflow: 'hidden',
            },
          }}
        >
          {token ? [
            <MenuItem
              key="profile"
              onClick={() => { navigate('/profile'); setAnchorEl(null); }}
              sx={{ gap: 1.5, fontSize: 13, fontFamily: 'Inter, sans-serif', py: 1.3, '&:hover': { backgroundColor: '#FFF0EA' } }}
            >
              <Box sx={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} color="#FF6B35" />
              </Box>
              <Typography fontSize={13} fontFamily="Inter, sans-serif" fontWeight={600}>Profile</Typography>
            </MenuItem>,
            <Divider key="d" sx={{ my: 0.5, mx: 1.5 }} />,
            <MenuItem
              key="logout"
              onClick={handleLogout}
              sx={{ gap: 1.5, fontSize: 13, color: '#DC2626', fontFamily: 'Inter, sans-serif', py: 1.3, '&:hover': { backgroundColor: '#FEF2F2' } }}
            >
              <Box sx={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={14} color="#DC2626" />
              </Box>
              <Typography fontSize={13} fontFamily="Inter, sans-serif" fontWeight={600} color="#DC2626">Logout</Typography>
            </MenuItem>,
          ] : (
            <MenuItem
              onClick={() => { navigate('/login'); setAnchorEl(null); }}
              sx={{ gap: 1.5, fontSize: 13, fontFamily: 'Inter, sans-serif', py: 1.3, '&:hover': { backgroundColor: '#FFF0EA' } }}
            >
              <Box sx={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogIn size={14} color="#FF6B35" />
              </Box>
              <Typography fontSize={13} fontFamily="Inter, sans-serif" fontWeight={600}>Login / Sign up</Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* Mobile search drop */}
      {isMobile && mobileSearch && (
        <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #F3F4F7', backgroundColor: '#FAFBFD' }}>
          <SearchBox style={{ maxWidth: '100%' }}>
            <Search size={15} color="#9CA3AF" />
            <InputBase
              sx={{ ml: 1.2, flex: 1, fontSize: 14, fontFamily: 'Inter, sans-serif' }}
              placeholder="Search stores, coupons..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.2 }}>
                <X size={13} color="#9CA3AF" />
              </IconButton>
            )}
          </SearchBox>
        </Box>
      )}

      {/* ── CATEGORY NAV ROW ── */}
      {showTabs && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'space-evenly' },
          gap: 0,
          px: { xs: 1.5, md: 0 },
          py: 0.4,
          overflowX: 'auto',
          backgroundColor: '#fff',
          borderBottom: '1px solid #F0F2F7',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}>
          {NAV_ITEMS.map(item => (
            <Box key={item.label} sx={{ flex: { xs: '0 0 auto', md: '1 1 0' }, display: 'flex', justifyContent: 'center' }}>
              <NavItem {...item} />
            </Box>
          ))}
        </Box>
      )}

      {/* Search results */}
      {searchQuery && (
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 1, backgroundColor: '#fff', maxHeight: '60vh', overflowY: 'auto' }}>
          <SearchResults />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderRadius: '0 20px 20px 0', width: 272 } }}
      >
        <Box sx={{ width: 272, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer header */}
          <Box sx={{
            p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(135deg, #0F1B35, #1a3060)',
            borderRadius: '0 20px 0 0',
          }}>
            <img src={Logo} alt="ZoDeals" height={32} style={{ filter: 'brightness(0) invert(1)' }} />
            <IconButton
              onClick={() => setDrawerOpen(false)}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <X size={16} color="#fff" />
            </IconButton>
          </Box>

          <List dense sx={{ pt: 1, flex: 1 }}>
            {[
              { label: 'Home',       path: '/',           Icon: Home,       color: '#0F1B35' },
              { label: 'Stores',     path: '/stores',     Icon: Store,      color: '#FF6B35' },
              { label: 'Categories', path: '/categories', Icon: LayoutGrid, color: '#7C3AED' },
              { label: 'All Deals',  path: '/alldeals',   Icon: Tag,        color: '#F59E0B' },
            ].map(({ label, path, Icon, color }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  onClick={() => { navigate(path); setSearchQuery(''); setDrawerOpen(false); }}
                  sx={{
                    gap: 1.5, py: 1.2, mx: 1, borderRadius: '10px',
                    '&:hover': { backgroundColor: `${color}10` },
                    transition: 'background 0.2s',
                  }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', backgroundColor: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} color={color} />
                  </Box>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14 }}
                  />
                  <ChevronRight size={15} color="#D1D5DB" />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1, mx: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => { navigate('/favorites'); setDrawerOpen(false); }}
                sx={{ gap: 1.5, py: 1.2, mx: 1, borderRadius: '10px', '&:hover': { backgroundColor: '#FFF0EA' } }}
              >
                <Box sx={{ width: 34, height: 34, borderRadius: '9px', backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={17} color="#FF6B35" />
                </Box>
                <ListItemText primary="Saved Deals" primaryTypographyProps={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }} />
                <ChevronRight size={15} color="#D1D5DB" />
              </ListItemButton>
            </ListItem>
            {token ? (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{ gap: 1.5, py: 1.2, mx: 1, borderRadius: '10px', '&:hover': { backgroundColor: '#FEF2F2' } }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogOut size={17} color="#DC2626" />
                  </Box>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#DC2626', fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => { navigate('/login'); setDrawerOpen(false); }}
                  sx={{ gap: 1.5, py: 1.2, mx: 1, borderRadius: '10px', '&:hover': { backgroundColor: '#FFF0EA' } }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogIn size={17} color="#FF6B35" />
                  </Box>
                  <ListItemText primary="Login / Sign up" primaryTypographyProps={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
