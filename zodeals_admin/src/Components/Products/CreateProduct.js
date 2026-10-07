import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Popconfirm,
  Image,
  Space,
  Divider,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Collapse
} from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import Colors from '../libs/Colors';
const { Title, Text } = Typography;
const { Panel } = Collapse;

const ProductManager = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${hosturl}/products`);
      if (res.data.statusCode === 200) {
        setProducts(res.data.result);
      } else {
        message.warning(res.data.displayMessage || 'Unexpected response');
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('link', values.link);
    formData.append('discountPercentage', values.discountPercentage);
    if (values.image?.file) {
      formData.append('image', values.image.file);
    }

    try {
      setLoading(true);
      if (editingProduct) {
        await axios.patch(`${hosturl}/admin/product/${editingProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Product updated successfully');
      } else {
        await axios.post(`${hosturl}/admin/product`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Product created successfully');
      }
      form.resetFields();
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${hosturl}/admin/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete product');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (src) => (
        <Image 
          width={80} 
          height={80}
          style={{ borderRadius: 8, objectFit: 'cover' }}
          crossOrigin='anonymous' 
          src={`${hosturl}${src}`} 
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price, record) => (
        <div>
          <Text  style={{color:'red'}} delete={record.discountPercentage > 0} strong>
            ₹{price}
          </Text>
          {record.discountPercentage > 0 && (
            <div>
              <Text strong style={{ color: "green" }}>
                ₹{Math.round(price * (1 - record.discountPercentage / 100))}
              </Text>
              <Tag  style={{ marginLeft: 8,color: Colors.secondary }}>
                {record.discountPercentage}% off
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Link',
      dataIndex: 'link',
      render: (link) => (
        <Button 
          type="link" 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ padding: 0 }}
        >
          View Product
        </Button>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
              setShowForm(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: 24 }}>
            Product Management
          </Title>
          
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowForm(!showForm);
              setEditingProduct(null);
              if (!showForm) form.resetFields();
            }}
            style={{ marginBottom: 16 }}
          >
            {showForm ? 'Hide Form' : 'Add New Product'}
          </Button>

          <Collapse activeKey={showForm ? ['1'] : []} bordered={false}>
            <Panel key="1" showArrow={false}>
              <Card 
                bordered={false} 
                style={{ 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                  borderRadius: 8,
                  marginBottom: 24
                }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={editingProduct || {}}
                >
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="price"
                        label="Price (₹)"
                        rules={[{ required: true, message: 'Please enter price' }]}
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          min={0} 
                          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="discountPercentage"
                        label="Discount (%)"
                        rules={[{ required: true, message: 'Please enter discount' }]}
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          min={0} 
                          max={100} 
                          formatter={value => `${value}%`}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="link"
                    label="Product URL"
                    rules={[
                      { required: true, message: 'Please enter link' },
                      { type: 'url', message: 'Please enter a valid URL' }
                    ]}
                  >
                    <Input placeholder="https://example.com/product" />
                  </Form.Item>

                  <Form.Item
                    name="image"
                    label="Product Image"
                    valuePropName="file"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList ? e : e)}
                    extra="Recommended size: 800x800px"
                  >
                    <Upload 
                      beforeUpload={() => false} 
                      maxCount={1}
                      listType="picture-card"
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        style={{ minWidth: 120 }}
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                      {editingProduct && (
                        <Button
                          onClick={() => {
                            setEditingProduct(null);
                            form.resetFields();
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Panel>
          </Collapse>

          <Card 
            bordered={false} 
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
              borderRadius: 8 
            }}
          >
            <Title level={4} style={{ marginBottom: 24 }}>
              Product Inventory
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              {products.length} products in your catalog
            </Text>
            
            <Table
              dataSource={products}
              columns={columns}
              rowKey="_id"
              loading={loading}
              bordered
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} products`,
                pageSizeOptions: ['5', '10', '20', '50']
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductManager;