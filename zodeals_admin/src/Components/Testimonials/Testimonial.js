import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  message,
  Modal,
  Card,
  Typography,
  Divider,
  Tabs,
  Avatar,
  Popconfirm,
  Badge
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { hosturl } from '../libs/Constant';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TestimonialTable = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('request');

  useEffect(() => {
    fetchTestimonials(activeTab);
  }, [activeTab]);

  const fetchTestimonials = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(`${hosturl}/testimonials/${status}`);
      setTestimonials(response.data.result);
    } catch (error) {
      message.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${hosturl}/admin/testimonial/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Testimonial ${status}`);
      fetchTestimonials(activeTab);
    } catch (error) {
      message.error('Failed to update testimonial status');
      console.error(error);
    }
  };

  const showPreview = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Author',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }} size="large">
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
      render: (text) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 300 }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={
            status === 'approved'
              ? 'success'
              : status === 'rejected'
              ? 'error'
              : 'processing'
          }
          text={
            <Tag
              color={
                status === 'approved'
                  ? 'green'
                  : status === 'rejected'
                  ? 'red'
                  : 'orange'
              }
              icon={
                status === 'approved' ? (
                  <CheckOutlined />
                ) : status === 'rejected' ? (
                  <CloseOutlined />
                ) : (
                  <ClockCircleOutlined />
                )
              }
            >
              {status.toUpperCase()}
            </Tag>
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showPreview(record)}
          >
            View
          </Button>
          {record.status === 'request' && (
            <>
              <Popconfirm
                title="Approve this testimonial?"
                onConfirm={() => handleStatusChange(record._id, 'approved')}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                >
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reject this testimonial?"
                onConfirm={() => handleStatusChange(record._id, 'rejected')}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                >
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Title level={4} style={{ marginBottom: 24 }}>
          <Space>
            <FilterOutlined />
            Testimonial Management
          </Space>
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Text type="secondary" style={{ marginRight: 8 }}>
              Total: {testimonials.length}
            </Text>
          }
        >
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                Pending
              </span>
            }
            key="request"
          />
          <TabPane
            tab={
              <span>
                <CheckCircleOutlined />
                Approved
              </span>
            }
            key="approved"
          />
          <TabPane
            tab={
              <span>
                <CloseCircleOutlined />
                Rejected
              </span>
            }
            key="rejected"
          />
        </Tabs>

        <Divider style={{ margin: '16px 0' }} />

        <Table
          columns={columns}
          dataSource={testimonials}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title="Testimonial Details"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
      >
        {selectedTestimonial && (
          <Card bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space size="large" align="start">
                <Avatar size={64} style={{ backgroundColor: '#1890ff' }}>
                  {selectedTestimonial.name.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Title level={5} style={{ marginBottom: 0 }}>
                    {selectedTestimonial.name}
                  </Title>
                  <Text type="secondary">
                    {new Date(selectedTestimonial.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </Space>

              <Divider style={{ margin: '16px 0' }} />

              <Text style={{ fontSize: 16 }}>
                {selectedTestimonial.review}
              </Text>

              <Divider style={{ margin: '16px 0' }} />

              <Space>
                <Tag
                  color={
                    selectedTestimonial.status === 'approved'
                      ? 'green'
                      : selectedTestimonial.status === 'rejected'
                      ? 'red'
                      : 'orange'
                  }
                  icon={
                    selectedTestimonial.status === 'approved' ? (
                      <CheckOutlined />
                    ) : selectedTestimonial.status === 'rejected' ? (
                      <CloseOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }
                >
                  {selectedTestimonial.status.toUpperCase()}
                </Tag>
              </Space>
            </Space>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default TestimonialTable;
