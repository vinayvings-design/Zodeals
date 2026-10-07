import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, message } from 'antd';
import {
  GiftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant';
const { Title } = Typography;

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalPosts: 0,
    subscribedVendors: 0, // Assuming you want to track this separately
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/vendor/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        let data = await response.json();
        data= data.result;
        setStats({
          totalCouponsAdded: data.totalCouponsAdded || 0,
          expiredCoupons: data.expiredCoupons || 0,
          activeCoupons: data.activeCoupons || 0,
          totalClicks: data.totalClicks || 0, 
          totalViews: data.totalViews || 0,

        });
      } else if (response.status === 401) {
        message.error('Unauthorized: Please login again.');
      } else {
        message.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      message.error('Something went wrong while fetching dashboard data.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

const statItems = [
  {
    title: 'Total Coupons',
    value: stats.totalCouponsAdded,
    icon: <GiftOutlined style={{ color: '#52c41a' }} />,
    color: '#f6ffed',
  },
  {
    title: 'Active Coupons',
    value: stats.activeCoupons,
    icon: <CheckCircleOutlined style={{ color: '#fa8c16' }} />,
    color: '#fff7e6',
  },
  {
    title: 'Expired Coupons',
    value: stats.expiredCoupons,
    icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
    color: '#e6f7ff',
  },
  {
    title: 'Total Views',
    value: stats.totalViews,
    icon: <EyeOutlined style={{ color: '#722ed1' }} />,
    color: '#f9f0ff',
  },
  {
    title: 'Total Clicks',
    value: stats.totalClicks,
    icon: <SelectOutlined style={{ color: '#722ed1' }} />,
    color: '#f9f0ff',
  },
];

  return (
    <div className="p-4">
      <Title level={4} style={{ marginBottom: 20, fontFamily: 'Poppins' }}>
        Dashboard Overview
      </Title>
      <Row gutter={[24, 24]}>
        {statItems.map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card
              bordered={false}
              style={{ backgroundColor: item.color }}
              className="shadow-sm rounded-lg"
            >
              <Statistic
                title={
                  <span style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                    {item.title}
                  </span>
                }
                value={item.value}
                prefix={item.icon}
                valueStyle={{
                  fontSize: 28,
                  fontWeight: 600,
                  fontFamily: 'Poppins',
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardStats;
