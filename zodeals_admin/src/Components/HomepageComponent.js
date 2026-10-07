import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  TagOutlined,
  BellOutlined,
  MessageOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import './Homepagecomponent.css';
import logo from '../assets/images/zodealsLogo.png';

const { Header, Sider, Content } = Layout;

// Map path → menu key
const PATH_KEY_MAP = {
  '/dashboard':     '1',
  '/userpage':      '2',
  '/vendorpage':    '3',
  '/agents':        '4',
  '/payments':      '5',
  '/categorypage':  '6',
  '/products':      '7',
  '/notifications': '9',
  '/testimonial':   '10',
  '/helpandsupport':'11',
};

const HomepageComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = PATH_KEY_MAP[location.pathname] || '1';

  const handleResize = () => {
    const mobileView = window.innerWidth <= 768;
    setIsMobileView(mobileView);
    setCollapsed(mobileView);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  const menuItems = [
    { key: '1',  icon: <DashboardOutlined />,       path: '/dashboard',     label: 'Dashboard' },
    { key: '2',  icon: <UserOutlined />,             path: '/userpage',      label: 'Users' },
    { key: '3',  icon: <ShopOutlined />,             path: '/vendorpage',    label: 'Vendors' },
    { key: '4',  icon: <CreditCardOutlined />,       path: '/agents',        label: 'Agents' },
    { key: '5',  icon: <CreditCardOutlined />,       path: '/payments',      label: 'Payments' },
    { key: '6',  icon: <AppstoreOutlined />,         path: '/categorypage',  label: 'Categories' },
    { key: '7',  icon: <ShoppingOutlined />,         path: '/products',      label: 'Products' },
    { key: '9',  icon: <BellOutlined />,             path: '/notifications', label: 'Notifications' },
    { key: '10', icon: <MessageOutlined />,          path: '/testimonial',   label: 'Testimonials' },
    { key: '11', icon: <CustomerServiceOutlined />,  path: '/helpandsupport',label: 'Help & Support' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        width={240}
        collapsedWidth={60}
        collapsible={!isMobileView}
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={(c) => setCollapsed(c)}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <Link to="/dashboard">
            <img
              src={logo}
              width={collapsed ? 36 : 150}
              height={42}
              alt="Zodeals"
              style={{ cursor: 'pointer', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.92, transition: 'width 0.25s' }}
            />
          </Link>
        </div>

        <div className="menu-scroll-container">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            className="custom-menu"
          >
            {menuItems.map(({ key, icon, path, label }) => (
              <Menu.Item key={key} icon={icon}>
                <Link to={path}>{!collapsed && label}</Link>
              </Menu.Item>
            ))}
            <Menu.Item key="14" icon={<LogoutOutlined />} onClick={handleLogout}>
              {!collapsed && 'Logout'}
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700,
                color: '#0F1B35', letterSpacing: '-0.01em',
              }}>
                Admin Panel
              </span>
              <span style={{
                fontSize: 11, backgroundColor: '#FFF0EA', color: '#FF6B35',
                borderRadius: 6, padding: '2px 8px', fontWeight: 700,
                fontFamily: 'Inter, sans-serif', border: '1px solid #FDCFB8',
              }}>
                ZoDeals
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, #FF6B35, #e63946)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
              }}>
                A
              </div>
            </div>
          </div>
        </Header>

        <Content style={{ overflow: 'auto', height: 'calc(100vh - 64px)', backgroundColor: '#F5F7FA' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomepageComponent;
