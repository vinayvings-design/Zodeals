// src/components/CouponDealForm.jsx
import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Card,
  Divider,
  Typography,
  Steps,
  Space,
  Alert
} from 'antd';
import { UploadOutlined, InfoCircleOutlined ,LeftOutlined, RightOutlined, CheckCircleFilled} from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Step } = Steps;

const categories = {
  Electronics: ['Phones', 'Laptops', 'Accessories'],
  Fashion: ['Men', 'Women', 'Kids'],
  Grocery: ['Fruits', 'Vegetables', 'Snacks'],
};

const CouponDealForm = () => {
  const [form] = Form.useForm();
  const [selectedTextType, setSelectedTextType] = useState('Deal');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  const steps = [
    'Basic Info',
    'Discount Details',
    'Category & Products',
    'Legal & Media'
  ];

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card 
        title={
          <div className="flex flex-col" >
            <Title level={3} style={{ margin: 0, fontFamily: 'Poppins', color: '#2c3e50', marginTop:10 }}>
              Create {selectedTextType}
            </Title>
            <Text type="secondary" style={{ fontFamily: 'Poppins', marginBottom:10 }}>
              Fill in the details to create a new {selectedTextType.toLowerCase()}
            </Text>
          </div>
        }
        className="shadow-xl rounded-xl border-0"
        headStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <Steps current={currentStep} responsive className="mb-8">
          {steps.map((item) => (
            <Step key={item} title={item} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            textType: 'Deal',
            discountType: 'Flat',
            validRange: [moment(), moment().add(7, 'days')],
          }}
        >
          {currentStep === 0 && (
            <div className="step-content" style={{ marginTop: 15, marginBottom:15}}>
              <Alert
                message="Basic Information"
                description="Provide the basic details about your coupon or deal."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                className="mb-7"
              />

              <Form.Item  style={{marginTop:20}}
                label={<span className="font-medium">Title</span>} 
                name="title" 
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input placeholder="e.g. Summer Sale, Black Friday Special" size="large" />
              </Form.Item>

              <Form.Item 
                label={<span className="font-medium">Type</span>} 
                name="textType" 
                rules={[{ required: true }]}
              >
                <Select 
                  onChange={val => setSelectedTextType(val)} 
                  size="large"
                >
                  <Option value="Coupon">Coupon</Option>
                  <Option value="Deal">Deal</Option>
                </Select>
              </Form.Item>

              {selectedTextType === 'Coupon' && (
                <Form.Item 
                  label={<span className="font-medium">Coupon Code</span>} 
                  name="code" 
                  rules={[{ required: true, message: 'Please enter a coupon code' }]}
                >
                  <Input 
                    placeholder="e.g. SUMMER20, SAVE50" 
                    size="large" 
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>
              )}

              <Form.Item 
                label={<span className="font-medium">Description</span>} 
                name="description" 
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Briefly describe the offer (e.g. Get 20% off on all electronics this summer)" 
                  showCount 
                  maxLength={200}
                />
              </Form.Item>

              <div className="flex justify-end mt-6">
                <Button type="primary" onClick={nextStep} size="large">
                  Next <RightOutlined />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-content" style={{marginTop:20}}>
              <Alert
                message="Discount Information"
                description="Set up the discount details for your offer."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                className="mb-6"
              />

              <Form.Item  style={{marginTop:20}}
                label={<span className="font-medium">Discount Type</span>} 
                name="discountType" 
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Option value="Flat">Flat Amount (e.g. $10 off)</Option>
                  <Option value="Percentage">Percentage (e.g. 20% off)</Option>
                  <Option value="BOGO">Buy One Get One (BOGO)</Option>
                </Select>
              </Form.Item>

              <Form.Item 
                label={<span className="font-medium">Discount Value</span>} 
                name="discountValue" 
                rules={[{ required: true, message: 'Please enter discount value' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder={form.getFieldValue('discountType') === 'Percentage' ? 'e.g. 20 for 20%' : 'e.g. 10 for $10'} 
                  size="large"
                  addonAfter={form.getFieldValue('discountType') === 'Percentage' ? '%' : '$'}
                />
              </Form.Item>

              <Form.Item 
                label={<span className="font-medium">Validity Period</span>} 
                name="validRange" 
                rules={[{ required: true, message: 'Please select validity period' }]}
              >
                <RangePicker 
                  style={{ width: '100%' }} 
                  size="large"
                  ranges={{
                    '1 Week': [moment(), moment().add(7, 'days')],
                    '2 Weeks': [moment(), moment().add(14, 'days')],
                    '1 Month': [moment(), moment().add(1, 'month')],
                  }}
                />
              </Form.Item>

          <div className="flex justify-start mt-6 gap-4">
          <Button 
            onClick={prevStep} 
            style={{marginRight:10}}
            size="large"
            icon={<LeftOutlined />}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors "
          >
            Previous
          </Button>
          <Button 
            type="primary" 
            onClick={nextStep} 
            size="large"
            className="flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            Next <RightOutlined />
          </Button>
        </div>

            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content" style={{marginTop:20}}>
              <Alert
                message="Category & Products"
                description="Select the categories and products this offer applies to."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                className="mb-6"
              />

              <Form.Item  style={{marginTop:20}}
                label={<span className="font-medium">Main Category</span>} 
                name="category" 
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select 
                  onChange={val => setSelectedCategory(val)} 
                  placeholder="Select category"
                  size="large"
                >
                  {Object.keys(categories).map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>

              {selectedCategory && categories[selectedCategory] && (
                <Form.Item 
                  label={<span className="font-medium">Subcategory</span>} 
                  name="subcategory"
                >
                  <Select 
                    allowClear 
                    placeholder="Select subcategory"
                    size="large"
                  >
                    {categories[selectedCategory].map((sub) => (
                      <Option key={sub} value={sub}>{sub}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item 
                label={<span className="font-medium">Applicable Products</span>} 
                name="applicableProducts"
                tooltip="Add specific products this offer applies to (optional)"
              >
                <Select 
                  mode="tags" 
                  style={{ width: '100%' }} 
                  placeholder="Enter product names or IDs"
                  size="large"
                />
              </Form.Item>

              <div className="flex justify-start mt-6 gap-4">
          <Button 
            onClick={prevStep} 
            style={{marginRight:10}}
            size="large"
            icon={<LeftOutlined />}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors "
          >
            Previous
          </Button>
          <Button 
            type="primary" 
            onClick={nextStep} 
            size="large"
            className="flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            Next <RightOutlined />
          </Button>
        </div>  
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content" style={{marginTop:20}}>
              <Alert
                message="Legal & Media"
                description="Add terms & conditions and upload media files."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                className="mb-6"
              />

              <Form.Item style={{marginTop:20}}
                label={<span className="font-medium">Terms & Conditions</span>} 
                name="terms" 
                rules={[{ required: true, message: 'Please enter terms & conditions' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Detailed terms and conditions for this offer..."
                  showCount 
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item 
                label={<span className="font-medium">Store URL</span>} 
                name="storeUrl" 
                rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input 
                  placeholder="https://yourstore.com/offer-page" 
                  size="large"
                  addonBefore="https://"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Form.Item 
              label={<span className="font-medium">Upload Logo</span>} 
              name="logo" 
              valuePropName="fileList" 
              getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList} 
              rules={[{ required: true, message: 'Please upload a logo' }]}
            >
              <Upload 
                listType="picture-card" 
                beforeUpload={() => false} 
                maxCount={1}
                accept="image/*"
              >
                <div className="text-center">
                  <UploadOutlined />
                  <div className="mt-1 text-xs text-gray-400">Click to upload</div>
                  <div style={{fontSize:'10px'}}>(PNG, JPG, max 2MB)</div>
                </div>
              </Upload>
            </Form.Item>


                <Form.Item 
                  label={<span className="font-medium">Upload Banner (optional)</span>} 
                  name="banner" 
                  valuePropName="fileList" 
                  getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                >
                  <Upload 
                    listType="picture-card" 
                    beforeUpload={() => false} 
                    maxCount={1}
                    accept="image/*"
                  >
                    <div>
                      <UploadOutlined />
                      <div className="mt-2">Click to upload</div>
                      <div style={{fontSize:'10px'}}>(PNG, JPG, max 5MB)</div>
                    </div>
                  </Upload>
                </Form.Item>
              </div>

              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} size="large" style={{marginRight:10}}>
                  Previous
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  Submit <CheckCircleFilled/>
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default CouponDealForm;