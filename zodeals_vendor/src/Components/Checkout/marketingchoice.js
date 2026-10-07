import React, { useState } from 'react';
import { Card, Typography, Button, Row, Col, Space } from 'antd';
import {
  GlobalOutlined,
  ShopOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';

const { Title, Text } = Typography;

const MarketingChoicePage = () => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (type) => {
    setSelected(type);
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Title level={4}>Do you want marketing?</Title>
      <Text type="secondary">Choose your preferred marketing method</Text>

      <Row gutter={16} style={{ marginTop: 30 }} justify="center">
        <Col span={10}>
          <Card
            hoverable
            onClick={() => handleSelect('online')}
            style={{
              padding: '12px',
              borderColor: selected === 'online' ? '#52c41a' : '#f0f0f0',
              textAlign: 'center',
              borderRadius: '10px',
              minHeight: '120px'
            }}
          >
            <Space direction="vertical" size={6}>
              <GlobalOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Text style={{ fontSize: 14 }} strong>Online</Text>
              {selected === 'online' && <CheckCircleTwoTone twoToneColor="#52c41a" />}
            </Space>
          </Card>
        </Col>
        <Col span={10}>
          <Card
            hoverable
            onClick={() => handleSelect('offline')}
            style={{
              padding: '12px',
              borderColor: selected === 'offline' ? '#52c41a' : '#f0f0f0',
              textAlign: 'center',
              borderRadius: '10px',
              minHeight: '120px'
            }}
          >
            <Space direction="vertical" size={6}>
              <ShopOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <Text style={{ fontSize: 14 }} strong>Offline</Text>
              {selected === 'offline' && <CheckCircleTwoTone twoToneColor="#52c41a" />}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* {selected && (
        <div style={{ marginTop: 30 }}>
          <Text>You selected: </Text>
          <Text strong>{selected === 'online' ? 'Online Marketing' : 'Offline Marketing'}</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" size="small" onClick={() => alert(`Proceeding with ${selected} marketing`)}>
              Continue
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MarketingChoicePage;
