import React, { useState } from 'react';
import {
  Card,
  Select,
  Upload,
  Input,
  Button,
  Typography,
  Form,
  message,
  Row,
  Col,
} from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { hosturl } from '../libs/Constant';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const NotificationsMessage = () => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);

 const [imageFile, setImageFile] = useState(null);

const handleImageChange = async (info) => {
  const file = info.file;
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    return message.error('Only image files are allowed!');
  }
  const preview = await getBase64(file);
  setImagePreview(preview);
  setImageFile(file);
};


 const handleSend = async () => {
  try {
    const values = await form.validateFields();

    const formData = new FormData();
    formData.append('title', values.subject);
    formData.append('content', values.message);
    formData.append('targetAudience', values.target);

    if (values.image && values.image.file) {
      formData.append('image', values.image.file);
    }

    const response = await fetch(`${hosturl}/admin/notification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual token logic
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      message.success('Notification sent successfully!');
      form.resetFields();
      setImagePreview(null);
    } else {
      message.error(result.displayMessage || 'Failed to send notification');
    }
  } catch (err) {
    console.error('Notification error:', err);
    message.error('Something went wrong');
  }
};


  return (
    <Card
      style={{
        maxWidth: 600,
        margin: 'auto',
        marginTop: 50,
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
        Send Notification
      </Title>

      <Form layout="vertical" form={form}>
        <Form.Item
          label="Send To"
          name="target"
          rules={[{ required: true, message: 'Please select a recipient group' }]}
        >
          <Select placeholder="Select recipient group">
            <Option value="users"> Users</Option>
            <Option value="vendors"> Vendors</Option>
            <Option value="both"> Both</Option>

          </Select>
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: 'Please enter a subject' }]}
        >
          <Input placeholder="Enter message subject" />
        </Form.Item>

        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: 'Please enter your message' }]}
        >
          <TextArea rows={4} placeholder="Type your message..." />
        </Form.Item>

        <Form.Item label="Attach Image (optional)">
         <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleImageChange}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>

          {imagePreview && (
            <div
              style={{
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  padding: 4,
                }}
              />
            </div>
          )}
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              size="large"
            >
              Send
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default NotificationsMessage;
