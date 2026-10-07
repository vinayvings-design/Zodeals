import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Spin, 
  Alert, 
  Divider,
  Avatar,
  Button,
  Row,
  Col
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant';
import styled from 'styled-components';

const { Title, Text, Link } = Typography;

const CenteredCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SocialIcon = styled.div`
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${hosturl}/contact-us`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Contact information not found.');
          }
          throw new Error('Failed to fetch contact details.');
        }
        const data = await response.json();
        setContactInfo(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" tip="Loading contact information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          closable
          style={{ borderRadius: 12 }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 20px' }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={14}>
          <CenteredCard 
            bordered={false} 
            style={{ 
              borderRadius: 16,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar 
                  size={80} 
                  icon={<MessageOutlined />} 
                  style={{ 
                    backgroundColor: '#1890ff',
                    marginBottom: 16
                  }} 
                />
                <Title level={3} style={{ margin: 0 }}>Contact Us</Title>
                <Text type="secondary">We'd love to hear from you</Text>
              </div>

              <Divider style={{ margin: 0 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar 
                  size={48} 
                  icon={<MailOutlined />} 
                  style={{ backgroundColor: '#f56a00' }} 
                />
                <div>
                  <Text strong style={{ display: 'block' }}>Email</Text>
                  <Link href={`mailto:${contactInfo.email}`}>{contactInfo.email}</Link>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar 
                  size={48} 
                  icon={<PhoneOutlined />} 
                  style={{ backgroundColor: '#52c41a' }} 
                />
                <div>
                  <Text strong style={{ display: 'block' }}>Primary Number</Text>
                  <Link href={`tel:${contactInfo.primaryNumber}`}>{contactInfo.primaryNumber}</Link>
                </div>
              </div>

              {contactInfo.secondaryNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Avatar 
                    size={48} 
                    icon={<PhoneOutlined />} 
                    style={{ backgroundColor: '#52c41a' }} 
                  />
                  <div>
                    <Text strong style={{ display: 'block' }}>Secondary Number</Text>
                    <Link href={`tel:${contactInfo.secondaryNumber}`}>{contactInfo.secondaryNumber}</Link>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar 
                  size={48} 
                  icon={<EnvironmentOutlined />} 
                  style={{ backgroundColor: '#722ed1' }} 
                />
                <div>
                  <Text strong style={{ display: 'block' }}>Location</Text>
                  <Text>{contactInfo.location}</Text>
                </div>
              </div>

              <Divider>Connect With Us</Divider>

              <Space size="middle" style={{ justifyContent: 'center', width: '100%' }}>
                {contactInfo.facebook && (
                  <SocialIcon>
                    <Link href={contactInfo.facebook} target="_blank">
                      <Avatar 
                        size={48} 
                        icon={<FacebookOutlined />} 
                        style={{ backgroundColor: '#3b5998' }} 
                      />
                    </Link>
                  </SocialIcon>
                )}
                {contactInfo.instagram && (
                  <SocialIcon>
                    <Link href={contactInfo.instagram} target="_blank">
                      <Avatar 
                        size={48} 
                        icon={<InstagramOutlined />} 
                        style={{ backgroundColor: '#C13584' }} 
                      />
                    </Link>
                  </SocialIcon>
                )}
                {contactInfo.twitter && (
                  <SocialIcon>
                    <Link href={contactInfo.twitter} target="_blank">
                      <Avatar 
                        size={48} 
                        icon={<TwitterOutlined />} 
                        style={{ backgroundColor: '#1DA1F2' }} 
                      />
                    </Link>
                  </SocialIcon>
                )}
                {contactInfo.linkedIn && (
                  <SocialIcon>
                    <Link href={contactInfo.linkedIn} target="_blank">
                      <Avatar 
                        size={48} 
                        icon={<LinkedinOutlined />} 
                        style={{ backgroundColor: '#0077b5' }} 
                      />
                    </Link>
                  </SocialIcon>
                )}
              </Space>
            </Space>
          </CenteredCard>
        </Col>
      </Row>
    </div>
  );
};

export default ContactUs;