import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Row, Col, Card, Button, Divider, Typography, Space, message } from 'antd';
import {
  MailOutlined, PhoneOutlined, EnvironmentOutlined,
  InstagramOutlined, FacebookOutlined, TwitterOutlined, LinkedinOutlined
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant';

const { Title, Text } = Typography;

const ContactDetailsForm = () => {
  const [form] = Form.useForm();
  const [contactId, setContactId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const token = localStorage.getItem('token');

  const fetchContactDetails = async () => {
    try {
      const res = await axios.get(`${hosturl}/contact-us`);
      if (res.status === 200 && res.data?.result) {
        const data = res.data.result;
        setContactId(data._id);
        form.setFieldsValue({
          email: data.email,
          phone: data.primaryNumber,
          secondaryPhone: data.secondaryNumber,
          address: data.location,
          instagram: data.instagram,
          facebook: data.facebook,
          twitter: data.twitter,
          linkedin: data.linkedIn,
        });
      }
    } catch (error) {
      message.error('❌ Failed to fetch contact details');
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const handleEditToggle = () => {
    setIsEditable(true);
  };

  const handleSubmit = async (values) => {
    if (!contactId) {
      message.error("Contact ID not found.");
      return;
    }

    const payload = {
      email: values.email,
      primaryNumber: values.phone,
      secondaryNumber: values.secondaryPhone,
      location: values.address,
      instagram: values.instagram,
      facebook: values.facebook,
      twitter: values.twitter,
      linkedIn: values.linkedin,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      await axios.patch(`${hosturl}/admin/contact-us/${contactId}`, payload, config);
      message.success('✅ Contact details updated successfully');
      setIsEditable(false);
    } catch (error) {
      message.error('❌ Failed to update contact details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 32, paddingBottom: 50 }}>
      <Col xs={24} md={20} lg={16}>
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 0 }}>
                Help & Support
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                View and update your contact details here.
              </Text>
            </Col>
            <Col>
              {!isEditable && (
                <Button type="default" onClick={handleEditToggle}>
                  Edit
                </Button>
              )}
            </Col>
          </Row>
          <Divider />
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email' }]}>
                  <Input size="large" prefix={<MailOutlined />} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="phone" label="Primary Phone Number" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                  <Input size="large" prefix={<PhoneOutlined />} maxLength={10} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="secondaryPhone" label="Secondary Phone Number">
                  <Input size="large" prefix={<PhoneOutlined />} maxLength={10} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter your address' }]}>
                  <Input size="large" prefix={<EnvironmentOutlined />} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="instagram" label="Instagram">
                  <Input size="large" prefix={<InstagramOutlined style={{ color: '#E1306C' }} />} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="facebook" label="Facebook">
                  <Input size="large" prefix={<FacebookOutlined style={{ color: '#1877F3' }} />} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="twitter" label="Twitter">
                  <Input size="large" prefix={<TwitterOutlined style={{ color: '#1DA1F2' }} />} disabled={!isEditable} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="linkedin" label="LinkedIn">
                  <Input size="large" prefix={<LinkedinOutlined style={{ color: '#0A66C2' }} />} disabled={!isEditable} />
                </Form.Item>
              </Col>
            </Row>

            {isEditable && (
              <Row justify="center" style={{ marginTop: 24 }}>
                <Button type="primary" size="large" shape="round" htmlType="submit" loading={loading}>
                  Save Changes
                </Button>
              </Row>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ContactDetailsForm;
