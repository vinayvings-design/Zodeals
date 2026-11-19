import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import './Homepagecomponent.css';
import logo from '../assets/images/zodealsLogo.png';
import logoMark from '../assets/images/zodealsMark.png';
import { hosturl } from './libs/Constant';

const { Header, Sider, Content } = Layout;

// Map path → menu key
const PATH_KEY_MAP = {
  '/dashboard':               '1',
  '/storesettings':           '2',
  '/addcoupens':              '3',
  '/get/all/vendor/coupens':  '4',
  '/contactus':               '5',
};

const HomepageComponent = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !role) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.replace('/');
  };

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />,      path: '/dashboard',              label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />,            path: '/storesettings',          label: 'Store Settings' },
    { key: '3', icon: <AppstoreOutlined />,        path: '/addcoupens',             label: 'Add Coupons' },
    { key: '4', icon: <AppstoreOutlined />,        path: '/get/all/vendor/coupens', label: 'Coupons & Deals' },
    { key: '5', icon: <CustomerServiceOutlined />, path: '/contactus',              label: 'Help & Support' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Phone: the menu is hidden and slides over the page from the header's menu button */}
      {isMobileView && !collapsed && (
        <div className="sidebar-backdrop" onClick={() => setCollapsed(true)} />
      )}
      <Sider
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobileView ? 'sidebar-mobile' : ''}`}
        width={240}
        collapsedWidth={isMobileView ? 0 : 60}
        collapsible
        trigger={isMobileView ? null : undefined}
        collapsed={collapsed}
        onCollapse={(c) => setCollapsed(c)}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#fff', borderRadius: 12,
            padding: collapsed ? '6px' : '10px 14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
            transition: 'all 0.25s',
          }}>
            <img
              src={collapsed ? logoMark : logo}
              width={collapsed ? 34 : 176}
              height={collapsed ? 34 : 34}
              alt="ZoDeals"
              style={{ cursor: 'pointer', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>

        <div className="menu-scroll-container">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            className="custom-menu"
          >
            {menuItems.map(({ key, icon, path, label }) => (
              <Menu.Item key={key} icon={icon} onClick={() => isMobileView && setCollapsed(true)}>
                <Link to={path}>{!collapsed && label}</Link>
              </Menu.Item>
            ))}
            <Menu.Item
              key="6"
              className="logout-item"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              {!collapsed && 'Logout'}
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {isMobileView && (
                <button
                  type="button"
                  aria-label="Open menu"
                  className="menu-toggle"
                  onClick={() => setCollapsed(false)}
                >
                  <MenuOutlined />
                </button>
              )}
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700,
                color: '#0F1B35', letterSpacing: '-0.01em',
              }}>
                Vendor Portal
              </span>
              <span style={{
                fontSize: 11, backgroundColor: '#FFF0EA', color: '#FF6B35',
                borderRadius: 6, padding: '2px 8px', fontWeight: 700,
                fontFamily: 'Inter, sans-serif', border: '1px solid #FDCFB8',
              }}>
                ZoDeals
              </span>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #FF6B35, #e63946)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
            }}>
              V
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
