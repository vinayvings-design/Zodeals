import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Card,
  message,
  Input,
  DatePicker,
  Button,
  Select,
  Space,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { hosturl } from '../libs/Constant';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AgentList = () => {
  const [agents, setAgents] = useState([]);           // flattened main list
  const [loading, setLoading] = useState(false);

  const [allTransactions, setAllTransactions] = useState([]); // original transactions
  const [filterCodeOrName, setFilterCodeOrName] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedAgentCode, setSelectedAgentCode] = useState(null);

  const [displayed, setDisplayed] = useState([]);      // what is shown after filters or selection

  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch all transaction records and flatten agent info
  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${hosturl}/admin/agent/transaction`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const transactions = res.data.result || [];

      // flatten each tx to include agent data + transaction data
      const flat = transactions.map((tx) => ({
        transactionId: tx._id,
        createdAt: tx.createdAt,
        amount: tx.amount,                // transaction-level amount
        couponCount: tx.couponCount,
        vendorId: tx.vendorId,
        // agent info
        agentId: tx.agentId,
        name: tx.agentId?.name,
        phoneNumber: tx.agentId?.phoneNumber,
        code: tx.agentId?.code,
        marketingAmount: tx.agentId?.marketingAmount,
        vendorDetails: tx.agentId?.vendorDetails,
      }));

      setAllTransactions(flat);
      setAgents(flat);
      // Initially displayed = all
      setDisplayed(flat);

      // compute total
      const tot = flat.reduce((sum, item) => sum + (item.amount || 0), 0);
      setTotalAmount(tot);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch agents & transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Apply filters: code/name, date range, and/or selected agent
  const applyFilters = () => {
    let filtered = [...allTransactions];

    if (filterCodeOrName) {
      const term = filterCodeOrName.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          (item.code?.toLowerCase().includes(term)) ||
          (item.name?.toLowerCase().includes(term))
        );
      });
    }

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter((item) => {
        const c = moment(item.createdAt);
        return c.isBetween(start.startOf('day'), end.endOf('day'), null, '[]');
      });
    }

    if (selectedAgentCode) {
      filtered = filtered.filter((item) => item.code === selectedAgentCode);
    }

    setDisplayed(filtered);

    // recalc total amount for displayed
    const tot = filtered.reduce((sum, it) => sum + (it.amount || 0), 0);
    setTotalAmount(tot);
  };

  // Whenever filters or selectedAgentCode change, reapply
  useEffect(() => {
    applyFilters();
  }, [filterCodeOrName, dateRange, selectedAgentCode, allTransactions]);

  const columns = [
    {
      title: 'Agent Info',
      key: 'agentInfo',
      render: (record) => (
        <div>
          <div><strong>Phone:</strong> {record.phoneNumber}</div>
          <div><strong>Name:</strong> {record.name}</div>
        </div>
      ),
    },
    {
      title: 'Agent Code',
      dataIndex: 'code',
      key: 'code',
    },
        {
    title: 'Vendor Details',
    key: 'vendorDetails',
    render: (record) => (
      <div>
        <div><strong>Business:</strong> {record.vendorId?.businessName || '-'}</div>
        <div><strong>Name:</strong> {record.vendorId?.name || '-'}</div>
      </div>
    ),
  },
   {
      title: 'Coupon Count',
      dataIndex: 'couponCount',
      key: 'couponCount',
    },
    {
      title: 'Transaction Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => val != null ? `₹${val}` : '-',
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  // Build unique agent codes for dropdown
  const uniqueCodes = Array.from(
    new Set(allTransactions.map((it) => it.code).filter((c) => !!c))
  );

  return (
    <Card style={{ margin: 24 }}>
      <Title level={3}>Agent Transactions</Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by Code or Name"
          value={filterCodeOrName}
          onChange={(e) => setFilterCodeOrName(e.target.value)}
          style={{ width: 200 }}
        />

        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
        />

        <Select
          placeholder="Select Agent Code"
          style={{ width: 160 }}
          allowClear
          value={selectedAgentCode}
          onChange={(value) => setSelectedAgentCode(value)}
        >
          {uniqueCodes.map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={applyFilters}>
          Search
        </Button>

        <Button
          onClick={() => {
            setFilterCodeOrName('');
            setDateRange(null);
            setSelectedAgentCode(null);
          }}
        >
          Reset
        </Button>
      </Space>

      <Table
        dataSource={displayed}
        columns={columns}
        rowKey="transactionId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <div style={{ marginTop: 16, textAlign: 'right', fontWeight: 'bold' }}>
        Overall Total Amount: ₹{totalAmount}
      </div>
    </Card>
  );
};

export default AgentList;
