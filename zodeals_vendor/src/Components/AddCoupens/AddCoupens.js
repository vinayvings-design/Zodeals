// src/components/CouponDealForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Card,
  Typography,
  Divider,
  Alert, message, Modal
} from 'antd';
import {
  UploadOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import moment from 'moment';
import { hosturl } from '../libs/Constant';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;


const CouponDealForm = () => {
  const [form] = Form.useForm();
  const [selectedTextType, setSelectedTextType] = useState('Deal');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  const isStoreCreated = JSON.parse(
    localStorage.getItem("is_store_created") || "false"
  );

  useEffect(() => {
    fetch(`${hosturl}/category`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then((data) => {
        console.log('Fetched categories:', data); // Log here
        setCategories(data.result);
        console.log('Categories state updated:', categories); // Log here
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        message.error('Unable to load categories');
      });
  }, []);



  const onFinish = async (values) => {
    console.log('Submitted values:', values);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      if (!Array.isArray(values.validRange) || values.validRange.length !== 2) {
        console.error('Invalid or missing validRange:', values.validRange);
        message.error('Please select a valid date range.');
        return;
      }

      const [validFrom, validTill] = values.validRange;
      const validFromLocal = validFrom.format('YYYY-MM-DDTHH:mm:ss');
      const validTillLocal = validTill.format('YYYY-MM-DDTHH:mm:ss');
      formData.append('title', values.title);
      formData.append('type', values.textType);
      formData.append('code', values.textType === 'Coupon' ? values.code : '');
      formData.append('link', values.storeUrl);
      formData.append('description', values.description);
      formData.append('discountType', values.discountType);
      formData.append('discountValue', values.discountValue);
      formData.append('validFrom', validFromLocal);
      formData.append('validTill', validTillLocal);
      formData.append('category', values.category);
      formData.append('applicableProducts', values.applicableProducts);
      formData.append('termsAndConditions', values.terms);
      formData.append('storeUrl', values.storeUrl);

      if (values.logo?.[0]) {
        formData.append('logo', values.logo[0].originFileObj);
      }
      if (values.banner?.[0]) {
        formData.append('banner', values.banner[0].originFileObj);
      }

      const response = await axios.post(`${hosturl}/vendor/coupon`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Created successfully:', response.data);
      setIsSubmitted(true); // Add this
      message.success({
        content: 'Coupon/Deal created successfully!',
        duration: 3, // seconds
      });
      form.resetFields();
      setSelectedTextType('Deal');
      setSelectedCategory('');
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      // navigate('/get/all/vendor/coupens')
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.message || "Unknown error";
      console.error('Error submitting form:', error.response?.data || error.message);
      message.error(`Error: ${errorMessage}`);
    }
  };
  useEffect(() => {
    if (!isStoreCreated) {
      setIsModalOpen(true);
    }
  }, [isStoreCreated]);
  return (
    <div ref={containerRef} className="max-w-4xl mx-auto p-4">
      {isSubmitted && (
        <Alert
          message="Success"
          description="Your coupon/deal has been created successfully!"
          type="success"
          showIcon
          closable
          className="mb-4"
        />
      )}

      <Card
        title={
          <div>
            <Title level={3}>Create {selectedTextType}</Title>
            <Text type="secondary">
              Fill in the details to create a new {selectedTextType.toLowerCase()}
            </Text>
          </div>
        }
        className="shadow-xl"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
          initialValues={{
            textType: 'Deal',
            discountType: 'Flat',
          }}
        >
          <Divider orientation="left" style={{ marginTop: 0 }}>Basic Info</Divider>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g. Summer Sale" size="large" />
          </Form.Item>

          <Form.Item name="textType" label="Type" rules={[{ required: true }]}>
            <Select size="large" onChange={(val) => setSelectedTextType(val)}>
              <Option value="Coupon">Coupon</Option>
              <Option value="Deal">Deal</Option>
            </Select>
          </Form.Item>

          {selectedTextType === 'Coupon' && (
            <Form.Item
              name="code"
              label="Coupon Code"
              rules={[{ required: true, message: 'Enter coupon code' }]}
            >
              <Input size="large" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          )}

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Enter a description' }]}
          >
            <TextArea rows={4} showCount maxLength={200} />
          </Form.Item>

          <Divider orientation="left">Discount Details</Divider>

          <Form.Item label="Discount Type" name="discountType" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="Flat">Flat</Option>
              <Option value="Percentage">Percentage</Option>
              <Option value="BOGO">Buy One Get One</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Discount Value"
            name="discountValue"
            rules={[{ required: true, message: 'Enter discount value' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item
            label="Validity Period"
            name="validRange"
            rules={[{ required: true, message: 'Select validity' }]}
          >
            <RangePicker style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Divider orientation="left">Category & Products</Divider>

          <Form.Item
            label="Main Category"
            name="category"
            rules={[{ required: true, message: 'Select a category' }]}
          >
            <Select
              placeholder="Select category"
              size="large"
              onChange={(val) => setSelectedCategory(val)}
            >
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="applicableProducts" label="Applicable Products">
            <Select mode="tags" size="large" placeholder="Enter product names or IDs" />
          </Form.Item>

          <Divider orientation="left">Legal & Media</Divider>

          <Form.Item label="Terms & Conditions" name="terms">
            <TextArea rows={4} showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            label="Store URL"
            name="storeUrl"
            rules={[{ type: 'url', message: 'Enter valid URL' }]}
          >
            <Input size="large" />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" icon={<CheckCircleFilled />} size="large">
              Submit
            </Button>
          </div>
        </Form>
      </Card>
      <Modal
        open={isModalOpen}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Store Not Created</Title>
          <Text type="secondary">
            You must create your store before creating coupons or deals.
          </Text>

          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/storesettings')}
            >
              Create Store
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CouponDealForm;
