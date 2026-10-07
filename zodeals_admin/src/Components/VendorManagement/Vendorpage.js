import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Input,
  Tag,
  Row,
  Col,
  Select,
  Card,
  Badge,
  Avatar,
  message,
} from 'antd';
import {
  FlagOutlined,
  MailOutlined,
  ShopOutlined,
  PhoneOutlined,
  UserOutlined,
  FilterOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import VendorCounts from './VendorCounts';
import { hosturl } from '../libs/Constant';

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const VendorTable = () => {
  const [vendorData, setVendorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    storeName: '',
    email: '',
    mobile: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/admin/vendors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        message.error(`Error: ${response.status}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data.result)) {
        message.error('Invalid data format from server');
        setLoading(false);
        return;
      }

      const today = new Date().toDateString();

      const formattedData = data.result.map((vendor, index) => {
        const createdDate = new Date(vendor.createdAt).toDateString();

        return {
          key: vendor._id,
          vendorName: vendor.name,
          email: vendor.email,
          mobile: vendor.phoneNumber || 'N/A',
          storeName: vendor.businessName || 'N/A',
          registrationDate: new Date(vendor.createdAt).toLocaleDateString(),
          avatarColor: ['#7265e6', '#ffbf00', '#00a2ae'][index % 3],
        };
      });

      setVendorData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      message.error('Failed to load vendor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(filters, value);
  };

  const handleFilterChange = (value, key) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters(updated, searchText);
  };

 const applyFilters = (filters, searchValue) => {
  const result = vendorData.filter((item) => {
    const matchesSearch = searchValue
      ? Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchValue.toLowerCase())
        )
      : true;

    return (
      matchesSearch &&
      item.storeName.toLowerCase().includes(filters.storeName.toLowerCase()) &&
      item.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      item.mobile.toLowerCase().includes(filters.mobile.toLowerCase())
    );
  });

  setFilteredData(result);
};


  const statusTag = (status) => {
    switch (status) {
      case 'active':
        return <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag>;
      case 'expiring':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Expiring</Tag>;
      default:
        return <Tag icon={<CloseCircleOutlined />} color="error">Inactive</Tag>;
    }
  };

  const columns = [
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            style={{ backgroundColor: record.avatarColor, marginRight: 8 }}
            icon={<UserOutlined />}
          />
          <div>
            <div>
              {text} {record.isNew && <Tag color="green" style={{ marginLeft: 8 }}>New</Tag>}
            </div>
            <Text type="secondary">{record.storeName}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div><MailOutlined /> {record.email}</div>
          <div><PhoneOutlined /> {record.mobile}</div>
        </div>
      ),
    },
    {
      title: 'Registered',
      key: 'registrationDate',
      dataIndex: 'registrationDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<FlagOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <VendorCounts />
      <Card
        title="Vendor Search"
        extra={
          <Search
            placeholder="Search vendors..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="Store Name"
              prefix={<ShopOutlined />}
              value={filters.storeName}
              onChange={(e) => handleFilterChange(e.target.value, 'storeName')}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Email"
              prefix={<MailOutlined />}
              value={filters.email}
              onChange={(e) => handleFilterChange(e.target.value, 'email')}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Mobile"
              prefix={<PhoneOutlined />}
              value={filters.mobile}
              onChange={(e) => handleFilterChange(e.target.value, 'mobile')}
              allowClear
            />
          </Col>

        </Row>
      </Card>

      <Card>
        <Table
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={{ pageSize: 5, showSizeChanger: true }}
          loading={loading}
          rowClassName={(record) => record.isNew ? 'highlight-row' : ''}
        />
      </Card>

      <style jsx global>{`
        .highlight-row {
          background-color: #e6f7ff;
        }
        .ant-table-thead > tr > th {
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
};

export default VendorTable;
