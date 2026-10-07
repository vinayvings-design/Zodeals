import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, message } from 'antd';
import {
  MailOutlined,
  UserOutlined,
  ShopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { hosturl, localhosturl } from '../libs/Constant';
const { Title } = Typography;

const DashboardStats = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    vendorCount: 0,
    totalPosts: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/admin/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        let data = await response.json();
        data = data.result;
        setStats({
          userCount: data.userCount || 0,
          vendorCount: data.vendorCount || 0,
          postCount: data.postCount || 0,
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
      title: 'Users Count',
      value: stats.userCount,
      icon: <UserOutlined style={{ color: '#52c41a' }} />,
      color: '#f6ffed',
    },
    {
      title: 'Vendor Count',
      value: stats.vendorCount,
      icon: <ShopOutlined style={{ color: '#fa8c16' }} />,
      color: '#fff7e6',
    },
    {
      title: 'Posts Count',
      value: stats.postCount,
      icon: <MailOutlined style={{ color: '#1890ff' }} />,
      color: '#e6f7ff',
    },
   
  ];
 console.log("stats",stats);
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
