import React, { useState, useEffect } from 'react';
import {
  Card, Button, Form, Input, Modal, message,
  Typography, Statistic, Space, Divider
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { hosturl } from '../libs/Constant';

const { Title } = Typography;

const CouponPriceManagement = () => {
  const [form] = Form.useForm();
  const [currentPrices, setCurrentPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${hosturl}/coupon/price`);
      if (!response.ok) throw new Error('Failed to fetch prices');
      const data = await response.json();
      setCurrentPrices(data.result);
    } catch (error) {
      console.error(error);
      message.error('Error fetching coupon prices');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrices = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      setLoading(true);

      const response = await fetch(`${hosturl}/admin/coupon/price`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oneCouponPrice: Number(values.oneCouponPrice),
          tenCouponPrice: Number(values.tenCouponPrice),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update prices');
      }

      message.success('✅ Coupon prices updated successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchCurrentPrices();
    } catch (error) {
      message.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 24, color: '#1890ff' }}>
        Coupon Price Management
      </Title>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginBottom: 24,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Statistic
                title="Price for 1 Coupon"
                value={currentPrices?.oneCouponPrice || 'Not set'}
                prefix="₹"
                valueStyle={{ color: currentPrices ? '#3f8600' : '#cf1322' }}
                loading={loading}
              />
              <Statistic
                title="Price for 10 Coupons"
                value={currentPrices?.tenCouponPrice || 'Not set'}
                prefix="₹"
                valueStyle={{ color: currentPrices ? '#3f8600' : '#cf1322' }}
                loading={loading}
              />
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsModalVisible(true)}
              shape="round"
            >
              Update Prices
            </Button>
          </div>
          <Divider />
          <div style={{ color: '#666', fontSize: 14 }}>
            {currentPrices
              ? `Current pricing: ₹${currentPrices.oneCouponPrice} for 1 coupon, ₹${currentPrices.tenCouponPrice} for 10 coupons.`
              : 'No coupon prices have been set yet.'}
          </div>
        </Space>
      </Card>

      <Modal
        title="Update Coupon Prices"
        open={isModalVisible}
        onOk={handleUpdatePrices}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        okText="Update Prices"
        cancelText="Cancel"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="oneCouponPrice"
            label="Price for 1 Coupon"
            rules={[
              { required: true, message: 'Please enter the price for 1 coupon' },
              { pattern: /^\d+$/, message: 'Enter a valid number' },
            ]}
          >
            <Input prefix="₹" type="number" placeholder="Enter amount in rupees" />
          </Form.Item>
          <Form.Item
            name="tenCouponPrice"
            label="Price for 10 Coupons"
            rules={[
              { required: true, message: 'Please enter the price for 10 coupons' },
              { pattern: /^\d+$/, message: 'Enter a valid number' },
            ]}
          >
            <Input prefix="₹" type="number" placeholder="Enter amount in rupees" />
          </Form.Item>
          <div style={{ color: '#666', fontSize: 14 }}>
            This will set the global price for individual and bulk coupon purchases.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponPriceManagement;
