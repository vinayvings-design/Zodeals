import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Tag, Image, Button, Popconfirm, message, Modal, Form, Tooltip, Input, Select, DatePicker, Upload, Row, Col, Divider, Typography, Space, Badge, Tabs, } from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, ClockCircleOutlined, FireOutlined,
  TagOutlined, LinkOutlined, PercentageOutlined, CalendarOutlined, ShoppingOutlined,
  FileTextOutlined, EyeOutlined, SearchOutlined, FilterOutlined, DollarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import noCoupenslogo from '../../assets/images/nocoupenslogo.png';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const VendorCouponsAndDeals = () => {
  const [coupons, setCoupons] = useState([]);
  const [paidCoupons, setPaidCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('unpaid');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetchCoupons();
    fetchPaidCoupons();
  }, [token]);
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${hosturl}/vendor/coupon?paid=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { result, statusCode } = response.data;

      if (statusCode === 404 || !result || result.length === 0) {
        setCoupons([]);
        setError(null);
      } else {
        const sortedCoupons = result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCoupons(sortedCoupons);
        setError(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setCoupons([]);
        setError(null);
      } else {
        setError(
          err.response?.data?.displayMessage ||
          err.response?.data?.error ||
          'Failed to fetch coupons'
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchPaidCoupons = async () => {
    try {
      const response = await axios.get(`${hosturl}/vendor/coupon?paid=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { result, statusCode } = response.data;

      if (statusCode === 404 || !result || result.length === 0) {
        setPaidCoupons([]);
      } else {
        const sortedCoupons = result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPaidCoupons(sortedCoupons);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch paid coupons:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${hosturl}/vendor/coupon/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Coupon deleted successfully');
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
      setPaidCoupons(paidCoupons.filter((coupon) => coupon._id !== id));
    } catch (err) {
      message.error(err.response?.data?.error || 'Failed to delete coupon');
    } finally {
      setDeletingId(null);
    }
  };

  const showEditModal = (coupon) => {
    setEditingId(coupon._id);
    form.setFieldsValue({
      ...coupon,
      validFrom: coupon.validFrom ? moment(coupon.validFrom) : null,
      validTill: coupon.validTill ? moment(coupon.validTill) : null,
    });

    if (coupon.logo) {
      setFileList([
        {
          uid: '-1',
          name: 'logo.png',
          status: 'done',
          url: `${coupon.logo}`,
        },
      ]);
    } else {
      setFileList([]);
    }

    setIsModalVisible(true);
  };

  const handleEdit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "validFrom" || key === "validTill") {
          if (values[key]) {
            formData.append(
              key,
              values[key].format("YYYY-MM-DDTHH:mm:ss")
            );
          }
        } else if (key !== "logo" && values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("logo", fileList[0].originFileObj);
      }
      await axios.patch(`${hosturl}/vendor/coupon/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Coupon updated successfully");
      setIsModalVisible(false);
      fetchCoupons();
      fetchPaidCoupons();
      setFileList([]);
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to update coupon");
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleProceedToPay = () => {
    if (coupons.length < 2) {
      message.warning('You need at least 2 coupons to proceed to payment.');
      return;
    }

    const couponData = coupons.map(coupon => ({
      id: coupon._id,
      title: coupon.title,
      logo: coupon.logo,
      type: coupon.type,
    }));
    const hasMinimumUnpaidCoupons = coupons.length > 2;
    const hasAlreadyPaid = paidCoupons.length > 0;
    const isPaid = hasMinimumUnpaidCoupons || hasAlreadyPaid;
    console.log(coupons.length, paidCoupons.length, isPaid)
    navigate('/checkout', {
      state: {
        couponData,
        isPaid,
      },
    });
  };



  const filterCoupons = (couponList) => {
    return couponList.filter(coupon => {
      // Search filter
      const matchesSearch = searchText === '' ||
        coupon.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (coupon.code && coupon.code.toLowerCase().includes(searchText.toLowerCase())) ||
        coupon.description.toLowerCase().includes(searchText.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || coupon.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const renderCouponCard = (item) => (
    <Col xs={24} sm={12} lg={8} xl={8} key={item._id}>
      <Badge.Ribbon
        text={item.type}
        color={item.type === 'Coupon' ? '#1890ff' : '#52c41a'}
        placement="start"
      >
        <Card
          hoverable
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          cover={
            <div
              style={{
                height: '180px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5'
              }}
            >
              {item.logo ? (
                <Image
                  crossOrigin="anonymous"
                  alt="Coupon Logo"
                  width={150}
                  src={`${hosturl}${item.logo}`}
                  style={{
                    objectFit: 'contain',
                    maxHeight: '100%',
                    padding: '16px'
                  }}
                  preview={false}
                />
              ) : (
                <div style={{
                  color: '#999',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <TagOutlined style={{ fontSize: '48px', marginBottom: '8px' }} />
                  <Text type="secondary">No Image</Text>
                </div>
              )}
            </div>
          }
          actions={[
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(item)}
              style={{ color: '#1890ff' }}
            >Edit</Button>,
            <Popconfirm
              title="Are you sure to delete this coupon?"
              onConfirm={() => handleDelete(item._id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                loading={deletingId === item._id}
                style={{ color: '#ff4d4f' }}
              >Delete</Button>
            </Popconfirm>,
          ]}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <Title level={5} style={{ margin: 0 }}>{item.title}</Title>
              <Tag
                color={
                  item.status === 'Active' ? 'green' :
                    item.status === 'Expired' ? 'red' : 'orange'
                }
                icon={
                  item.status === 'Active' ? <FireOutlined /> :
                    item.status === 'Expired' ? <ClockCircleOutlined /> : null
                }
              >
                {item.status}
              </Tag>
            </div>

            <Paragraph
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              style={{ color: '#666', marginBottom: '16px' }}
            >
              {item.description}
            </Paragraph>

            <Divider style={{ margin: '12px 0' }} />

            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {item.type === 'Coupon' && (
                <Row align="middle" gutter={8}>
                  <Col><TagOutlined style={{ color: '#1890ff' }} /></Col>
                  <Col>
                    <Text strong>Code: </Text>
                    <Text copyable>{item.code || '—'}</Text>
                  </Col>
                </Row>
              )}
              {item.type === 'Deal' && (
                <Row align="middle" gutter={8}>
                  <Col><LinkOutlined style={{ color: '#52c41a' }} /></Col>
                  <Col>
                    <Text strong>Link: </Text>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      View Deal
                    </a>
                  </Col>
                </Row>
              )}

              <Row align="middle" gutter={8}>
                <Col><PercentageOutlined style={{ color: '#faad14' }} /></Col>
                <Col>
                  <Text strong>Discount: </Text>
                  <Text>{item.discountValue} {item.discountType}</Text>
                </Col>
              </Row>

              <Row align="middle" gutter={8}>
                <Col><CalendarOutlined style={{ color: '#722ed1' }} /></Col>
                <Col>
                  <Text strong>Valid: </Text>
                  <Text>
                    {moment(item.validFrom).format('MMM D, YYYY')} - {moment(item.validTill).format('MMM D, YYYY')}
                  </Text>
                </Col>
              </Row>

              {item.applicableProducts?.length > 0 && (
                <Row align="middle" gutter={8}>
                  <Col><ShoppingOutlined style={{ color: '#13c2c2' }} /></Col>
                  <Col>
                    <Text strong>Applicable Products: </Text>
                    <Text>{item.applicableProducts.join(', ')}</Text>
                  </Col>
                </Row>
              )}

              <Row align="top" wrap>
                <Col flex="auto">
                  <Text>
                    <FileTextOutlined style={{ color: '#f5222d', marginRight: 6 }} />
                    <Text strong>Terms: </Text>
                    {item.termsAndConditions || '—'}
                  </Text>
                </Col>
              </Row>
              <Row align="middle" gutter={8}>
                <Col><EyeOutlined style={{ color: '#eb2f96' }} /></Col>
                <Col>
                  <Text strong>Views: </Text>
                  <Text>{item.viewCount}</Text>
                </Col>
              </Row>
              {item.pinCode?.length > 0 && (
                <Row align="top" gutter={8}>
                  <Col>
                    <Text strong>Serviceable Pincodes: </Text>
                    <Text>
                      {item.pinCode.slice(0, 10).join(', ')}
                      {item.pinCode.length > 10 && (
                        <Text type="secondary">
                          {' '}+{item.pinCode.length - 10} more
                        </Text>
                      )}
                    </Text>
                  </Col>
                </Row>
              )}
              {item.isPanIndia && (
                <Row align="middle" gutter={8}>
                  <Col>
                    <Text strong style={{ color: 'green' }}>
                      ✅ Pan India Available
                    </Text>
                  </Col>
                </Row>
              )}

            </Space>
          </div>
        </Card>
      </Badge.Ribbon>
    </Col>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Loading your coupons..." />
      </div>
    );
  }

  const allCouponsEmpty = coupons.length === 0 && paidCoupons.length === 0;

  if (!loading && allCouponsEmpty) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        textAlign: 'center',
        padding: '40px',
        background: '#f8f9fa',
        borderRadius: '12px',
        margin: '20px'
      }}>
        <Image
          src={noCoupenslogo}
          alt="No Coupons"
          width={250}
          preview={false}
          style={{ marginBottom: 24 }}
        />
        <Title level={3} style={{ marginBottom: 8 }}>No Coupons Found</Title>
        <Text type="secondary" style={{ marginBottom: 24 }}>
          You haven't created any coupons or deals yet. Start by adding your first offer!
        </Text>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/addcoupens')}
          style={{ borderRadius: '8px', padding: '0 24px', height: '40px' }}
        >
          Add New Coupon
        </Button>
      </div>
    );
  }

  const filteredUnpaidCoupons = filterCoupons(coupons);
  const filteredPaidCoupons = filterCoupons(paidCoupons);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px 24px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)'
      }}>
        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
          My Coupons & Deals ({coupons.length + paidCoupons.length})
        </Title>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/addcoupens')}
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px',
              fontWeight: 500
            }}
          >
            Add New Coupon
          </Button>
          {coupons.length > 0 && (
            <Tooltip title="At least 2 coupons are required to proceed">
              <Button
                type="default"
                onClick={handleProceedToPay}
                icon={<DollarOutlined />}
                disabled={coupons.length < 2}
                style={{
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px',
                  fontWeight: 500
                }}
              >
                Proceed to Pay
              </Button>
            </Tooltip>

          )}

        </div>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Filter Section */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search coupons..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={5}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Status"
            >
              <Option value="all">All Statuses</Option>
              <Option value="Active">Active</Option>
              <Option value="Expired">Expired</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Col>
          <Col xs={12} sm={5}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              placeholder="Type"
            >
              <Option value="all">All Types</Option>
              <Option value="Coupon">Coupon</Option>
              <Option value="Deal">Deal</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              style={{ width: '100%' }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
      >
        <TabPane
          tab={
            <span>
              Unpaid Coupons
              {coupons.length > 0 && <Badge count={coupons.length} style={{ marginLeft: 8 }} />}
            </span>
          }
          key="unpaid"
        >
          {filteredUnpaidCoupons.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <Title level={4}>No unpaid coupons found</Title>
              <Text type="secondary">
                {coupons.length === 0
                  ? "You don't have any unpaid coupons yet."
                  : "No coupons match your current filters."}
              </Text>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredUnpaidCoupons.map(renderCouponCard)}
            </Row>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              Paid Coupons
              {paidCoupons.length > 0 && <Badge count={paidCoupons.length} style={{ marginLeft: 8 }} />}
            </span>
          }
          key="paid"
        >
          {filteredPaidCoupons.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <Title level={4}>No paid coupons found</Title>
              <Text type="secondary">
                {paidCoupons.length === 0
                  ? "You don't have any paid coupons yet."
                  : "No coupons match your current filters."}
              </Text>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredPaidCoupons.map(renderCouponCard)}
            </Row>
          )}
        </TabPane>
      </Tabs>

      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: 500 }}>Edit Coupon</span>}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
        }}
        onOk={() => form.submit()}
        width={800}
        okText="Save Changes"
        cancelText="Cancel"
        bodyStyle={{ padding: '24px' }}
      >
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="Enter coupon title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Option value="Coupon">Coupon</Option>
                  <Option value="Deal">Deal</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.type !== curr.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === 'Coupon' ? (
                <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
                  <Input placeholder="Enter coupon code" />
                </Form.Item>
              ) : (
                <Form.Item name="link" label="Deal Link" rules={[{ required: true }]}>
                  <Input placeholder="Enter deal URL" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description (optional)" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountType" label="Discount Type" rules={[{ required: true }]}>
                <Select placeholder="Select discount type">
                  <Option value="Flat">Flat</Option>
                  <Option value="Percentage">Percentage</Option>
                  <Option value="BOGO">BOGO</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountValue" label="Discount Value" rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter discount value" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="validFrom" label="Valid From" rules={[{ required: true }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select start date"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="validTill" label="Valid Till" rules={[{ required: true }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select end date"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item name="logo" label="Coupon Logo">
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              fileList={fileList}
              listType="picture-card"
              maxCount={1}
              accept="image/*"
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default VendorCouponsAndDeals;