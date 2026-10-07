import React, { useEffect, useState } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  message,
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant'; // Make sure hosturl is defined correctly

export default function VendorCounts() {
  const [stats, setStats] = useState({
    totalVendor: 0,
    newRegistration: 0,
    activeCoupon: 0,
    expiredCoupon: 0,
  });

  const fetchVendorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/admin/vendor/chart`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.result);
      } else if (response.status === 401) {
        message.error('Unauthorized. Please log in again.');
      } else {
        message.error('Failed to fetch vendor statistics.');
      }
    } catch (error) {
      console.error('Error fetching vendor chart:', error);
      message.error('Server error while loading statistics.');
    }
  };

  useEffect(() => {
    fetchVendorStats();
  }, []);

  return (
    <Card 
      title="Vendor Overview" 
      style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#f0f5ff', borderRadius: 8 }}>
            <Statistic 
              title="Total Vendors" 
              value={stats.totalVendor} 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#f6ffed', borderRadius: 8 }}>
            <Statistic 
              title="New Registrations" 
              value={stats.newRegistration} 
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#fffbe6', borderRadius: 8 }}>
            <Statistic 
              title="Expired Coupons" 
              value={stats.expiredCoupon} 
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#e6fffb', borderRadius: 8 }}>
            <Statistic 
              title="Active Coupons" 
              value={stats.activeCoupon} 
              prefix={<CheckCircleOutlined style={{ color: '#13c2c2' }} />}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
