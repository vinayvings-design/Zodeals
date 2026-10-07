import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Input,
  Row,
  Col,
  message,
} from 'antd';
import {
  EditOutlined,
  FlagOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  GlobalOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant'; // Ensure hosturl is like 'http://localhost:5000' or your API base

const { Title } = Typography;

const UserTable = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const resData = await response.json();
        const formattedUsers = resData.result.map((user, index) => ({
          key: user._id || index,
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          mobile: user.mobile || 'N/A',
          country: user.country || 'N/A',
          state: user.state || 'N/A',
          verify: user.verify,
          profile: user.profile,
          createdAt: user.createdAt,
        }));

        setUsers(formattedUsers);
        setFilteredData(formattedUsers);
        message.success('User data loaded successfully');
      } else {
        message.error('Failed to fetch users.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Failed to load user data.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = users.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.mobile?.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    // {
    //   title: 'Profile',
    //   dataIndex: 'profile',
    //   key: 'profile',
    //   render: (url) =>
    //     url ? (
    //       <img
    //         src={`${hosturl}${url}`}
    //         alt="profile"
    //         style={{ width: 40, height: 40, borderRadius: '50%' }}
    //       />
    //     ) : (
    //       <Tag color="default">N/A</Tag>
    //     ),
    // },
    {
      title: (
        <span>
          <UserOutlined /> Name
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: (
        <span>
          <MailOutlined /> Email
        </span>
      ),
      dataIndex: 'email',
      key: 'email',
    },
    // {
    //   title: (
    //     <span>
    //       <PhoneOutlined /> Mobile
    //     </span>
    //   ),
    //   dataIndex: 'mobile',
    //   key: 'mobile',
    // },

    {
      title: 'Joined On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="primary" icon={<EditOutlined />} size="small">
            Edit
          </Button> */}
          <Button type="default" danger icon={<FlagOutlined />} size="small">
            Flag
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ fontFamily: 'Poppins' }}>
            User Management
          </Title>
        </Col>
        <Col>
          <Input
            placeholder="Search by name, email, or phone"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            size="middle"
            style={{ width: 300 }}
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        bordered
        className="shadow rounded-md mt-4"
      />
    </div>
  );
};

export default UserTable;
