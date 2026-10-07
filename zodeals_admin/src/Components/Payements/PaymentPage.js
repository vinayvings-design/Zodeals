import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Statistic,
  Select,
  message,
} from 'antd';
import moment from 'moment';
import axios from 'axios';
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  IdcardOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const PaymentHistory = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    paymentId: '',
    dateRange: [],
    status: null,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${hosturl}/payment-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { history, dashboard } = res.data.result;

      const formattedHistory = history
        .map((item) => ({
          paymentId: item.paymentId,
          vendorName: item.vendor || 'N/A',
          amount: item.amount,
          date: item.date,
          // Convert backend status to UI-friendly status
          status:
            item.status === 'captured'
              ? 'Completed'
              : item.status === 'pending'
                ? 'Pending'
                : item.status === 'complimentary'
                  ? 'Complimentary'
                  : 'Failed'
        }))
        // ✅ Sort by date descending (newest first)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setAllPayments(formattedHistory);
      setFilteredData(formattedHistory);
      setDashboard(dashboard);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let result = allPayments;

    if (filters.paymentId) {
      result = result.filter((item) =>
        item.paymentId.toLowerCase().includes(filters.paymentId.toLowerCase())
      );
    }

    if (filters.dateRange?.length === 2) {
      const [start, end] = filters.dateRange;
      result = result.filter((item) => {
        const txnDate = moment(item.date);
        return txnDate.isBetween(start, end, 'day', '[]');
      });
    }

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setFilters({
      paymentId: '',
      dateRange: [],
      status: null,
    });
    setFilteredData(allPayments);
  };

  const getStatusTag = (status) => {
    const colorMap = {
      Completed: 'green',
      Pending: 'orange',
      Failed: 'red',
    };

    const iconMap = {
      Completed: <CheckCircleOutlined />,
      Pending: <SyncOutlined spin />,
      Failed: <CloseCircleOutlined />,
    };

    return (
      <Tag icon={iconMap[status]} color={colorMap[status]}>
        {status}
      </Tag>
    );
  };

  const columns = [
    {
      title: (
        <Text strong>
          <IdcardOutlined /> Payment ID
        </Text>
      ),
      dataIndex: 'paymentId',
      key: 'paymentId',
    },
    {
      title: (
        <Text strong>
          <ShopOutlined /> Vendor
        </Text>
      ),
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: (
        <Text strong>
          <DollarOutlined /> Amount
        </Text>
      ),
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => (
        <Text strong style={{ color: '#1890ff' }}>
          ₹{val.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: (
        <Text strong>
          <CalendarOutlined /> Date
        </Text>
      ),
      dataIndex: 'date',
      key: 'date',
      render: (val) => moment(val).format('MMM D, YYYY'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: <Text strong>Status</Text>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Failed', value: 'Failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Payment History
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Payment Amount"
              value={dashboard.totalPayment || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Completed"
              value={dashboard.completed || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Pending"
              value={dashboard.pending || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Failed"
              value={dashboard.failed || 0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Search Payment ID"
              prefix={<SearchOutlined />}
              value={filters.paymentId}
              onChange={(e) => setFilters({ ...filters, paymentId: e.target.value })}
              allowClear
              onPressEnter={handleFilter}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={10} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              size="large"
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              ranges={{
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [
                  moment().subtract(1, 'month').startOf('month'),
                  moment().subtract(1, 'month').endOf('month'),
                ],
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              size="large"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
              options={[
                { value: 'Completed', label: 'Completed' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Failed', label: 'Failed' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                size="large"
                style={{ width: '100%' }}
                onClick={handleFilter}
              >
                Apply Filters
              </Button>
              <Button size="large" style={{ width: '100%' }} onClick={resetFilters}>
                Reset
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="paymentId"
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} payments`,
          }}
          bordered
        />
      </Card>
    </div>
  );
};

export default PaymentHistory;
