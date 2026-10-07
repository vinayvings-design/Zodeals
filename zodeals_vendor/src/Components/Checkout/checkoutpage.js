import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';
import {
  Button,
  Divider,
  Typography,
  Spin,
  Card,
  Row,
  Col,
  Image,
  Steps,
  Tag,
  Alert, Form, TextArea,
  Select,
  InputNumber,
  Input,
  Tooltip,
  Checkbox
} from 'antd';
import { message } from 'antd';

import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { couponData = [], isPaid = false } = location.state || {};
  console.log(couponData, isPaid)
  const [couponList, setCouponList] = useState(couponData || []);
  // Dummy prices; replace with real ones
  const [prices] = useState({
    oneCouponPrice: 100,
    tenCouponPrice: 900,
  });

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');

  // Merchant source states
  const [merchantSourceType, setMerchantSourceType] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);  // alias for districts (city-level)
  const [availablePincodes, setAvailablePincodes] = useState([]);
  const [pincodeError, setPincodeError] = useState('');
  const [agentCode, setagentCode] = useState(''); // for single select states
  const [selectedStates, setSelectedStates] = useState([]); // for multiple select states
  const [selectedCities, setSelectedCities] = useState([]);   // for “Full City” mode
  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [agreed, setAgreed] = useState(false)
  // Fetch states & pincodes on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(`${hosturl}/location/states`);
        setAvailableStates(res.data.result || []);
      } catch (err) {
        console.error('Error fetching states', err);
      }
    };
    const fetchPincodes = async () => {
      try {
        const res = await axios.get(`${hosturl}/pincode`);
        setAvailablePincodes(res.data.result || []);
      } catch (err) {
        console.error('Error fetching pincodes', err);
      }
    };
    fetchStates();
    fetchPincodes();
  }, []);

  // When one state is selected, fetch its cities/districts
  useEffect(() => {
    if (selectedStates.length === 1) {
      const st = selectedStates[0];
      const fetchCities = async () => {
        try {
          const res = await axios.get(`https://api.zodeals.in/location/districts/${st}`);
          setAvailableCities(res.data.result || []);
        } catch (err) {
          console.error('Error fetching cities for state', st, err);
        }
      };
      fetchCities();
    } else {
      setAvailableCities([]);
    }
  }, [selectedStates]);

  // ========== Coupon pricing logic (as before) ==========
  const totalCoupons = couponList.reduce((sum, c) => sum + (c.quantity || 1), 0);

  let subtotal = 0,
    discount = 0,
    couponTotalPrice = 0;
  let pricingDescription = '';

  if (prices.oneCouponPrice != null && prices.tenCouponPrice != null) {
    if (totalCoupons < 10) {
      subtotal = totalCoupons * prices.oneCouponPrice;
      couponTotalPrice = subtotal;
      pricingDescription = `${totalCoupons} × ₹${prices.oneCouponPrice} each`;
    } else {
      const bulkPackages = Math.floor(totalCoupons / 10);
      const extraCoupons = totalCoupons % 10;
      subtotal = totalCoupons * prices.oneCouponPrice;
      couponTotalPrice =
        bulkPackages * prices.tenCouponPrice +
        extraCoupons * prices.oneCouponPrice;
      discount = subtotal - couponTotalPrice;
      pricingDescription = `${bulkPackages} × 10‑coupon package(s) at ₹${prices.tenCouponPrice}`;
      if (extraCoupons > 0) {
        pricingDescription += ` + ${extraCoupons} × ₹${prices.oneCouponPrice} each`;
      }
    }
  }

  // ========== Merchant + GST logic ==========

  const merchantPricing = {
    'Single Pincode': 500,
    '2 Pincodes': 1000,
    '3 to 4 Pincode': 2000,
    '5 to 10 Pincode': 4000,
    'Full city': 10000,
    'Full state': 25000,
    'Two States': 40000,
    'PAN India': 100000,
  };

  const baseMerchantPrice = merchantSourceType
    ? merchantPricing[merchantSourceType] || 0
    : 0;
  const isFirstTimeUser = JSON.parse(localStorage.getItem("is_first_time_user"));
  // Apply free logic
  let chargeableCoupons = totalCoupons;
  if (
    isFirstTimeUser &&
    merchantSourceType &&
    ['Single Pincode', '2 Pincodes', '3 to 4 Pincode', '5 to 10 Pincode'].includes(merchantSourceType)
  ) {
    const freeCoupons = 2;
    chargeableCoupons = Math.max(totalCoupons - freeCoupons, 0);
  }
  let merchantPrice = baseMerchantPrice * chargeableCoupons;
  const gst = Math.round(merchantPrice * 0.18);
  const merchantTotal = merchantPrice + gst;


  // ========== Validation Logic ==========

  const validateMerchantSelection = () => {
    if (!merchantSourceType) return false;

    switch (merchantSourceType) {
      case 'Single Pincode':
        return selectedPincodes.length === 1;

      case '2 Pincodes':
        return selectedPincodes.length === 2;

      case '3 to 4 Pincode':
        return (
          selectedPincodes.length >= 3 && selectedPincodes.length <= 4
        );

      case '5 to 10 Pincode':
        return (
          selectedPincodes.length >= 5 && selectedPincodes.length <= 10
        );

      case 'Full city':
        // must select exactly one state, and at least one city
        return (
          selectedStates.length === 1 &&
          selectedCities.length >= 1
        );

      case 'Full state':
        // exactly one state
        return selectedStates.length === 1;

      case 'Two States':
        // exactly two states
        return selectedStates.length === 2;

      case 'PAN India':
        // no further selection needed
        return true;

      default:
        return false;
    }
  };

  const getMerchantTag = (merchantSourceType) => {
    switch (merchantSourceType) {
      case 'Single Pincode':
        return 'single';
      case '2 Pincodes':
        return 'double';
      case '3 to 4 Pincode':
        return 'threeToFour';
      case '5 to 10 Pincode':
        return 'fiveToTen';
      case 'Full city':
        return 'fullCity';
      case 'Full state':
        return 'fullState';
      case 'Two States':
        return 'twoState';
      case 'PAN India':
        return 'panIndia';
      default:
        return 'single'; // fallback if somehow undefined
    }
  };


  // ========== Razorpay logic ==========

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };
  const handleRemoveCoupon = (index) => {
    if (couponList.length <= 2) {
      message.warning('You must select at least 2 coupons.');
      return;
    }
    const updatedList = [...couponList];
    updatedList.splice(index, 1);
    setCouponList(updatedList);
  };

  const handleCompletePayment = async () => {
    if (!validateMerchantSelection()) {
      message.error('Please complete the merchant selection correctly.');
      return;
    }
    setPaymentProcessing(true);
    if (merchantTotal === 0) {
      try {
        const couponId = couponList.map((c) => c.id);
        const tag = getMerchantTag(merchantSourceType);
        const resp = await fetch(`${hosturl}/verify-payment-coupon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            razorpay_order_id: null,
            razorpay_payment_id: null,
            razorpay_signature: null,
            couponId,
            tag,
            agentCode,
            state: selectedStates,
            city: selectedCities,
            pinCode: selectedPincodes,
          }),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(errText);
        }

        setPaymentSuccess(true);
        localStorage.setItem("is_first_time_user", JSON.stringify(false));
        setTimeout(() => {
          navigate('/get/all/vendor/coupens', {
            state: { couponData: couponList, merchantTotal },
          });
        }, 2000);
      } catch (err) {
        console.error(err);
        alert('Failed to process free coupons: ' + err.message);
      }

      setPaymentProcessing(false);
      return;
    }
    try {
      const createOrderResp = await fetch(`${hosturl}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount: merchantTotal }),
      });

      if (!createOrderResp.ok) {
        const errText = await createOrderResp.text();
        throw new Error('Failed to create order: ' + errText);
      }

      const { data } = await createOrderResp.json();
      const { id: orderId, amount } = data;
      await loadRazorpayScript();
      const options = {
        key: 'rzp_live_RZcxb3S8KlGi4t',
        amount,
        currency: 'INR',
        order_id: orderId,
        name: 'ZO Deals',
        description: 'Purchase Coupons + Reach',
        handler: async (response) => {
          const couponId = couponList.map((c) => c.id);
          const tag =getMerchantTag(merchantSourceType);
          try {
            const verifyResp = await fetch(`${hosturl}/verify-payment-coupon`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                couponId,
                tag,
                agentCode,
                state: selectedStates,
                city: selectedCities,
                pinCode: selectedPincodes,
              }),
            });

            if (!verifyResp.ok) {
              const errorMsg = await verifyResp.text();
              throw new Error(`Verification failed: ${errorMsg}`);
            }

            setPaymentSuccess(true);
            localStorage.setItem("is_first_time_user", JSON.stringify(false));
            setTimeout(() => {
              navigate('/get/all/vendor/coupens', {
                state: { couponData: couponList, merchantTotal },
              });
            }, 2000);
          } catch (err) {
            console.error(err);
            alert('Payment verification failed: ' + err.message);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            alert('Payment popup closed by user');
          },
        },
        theme: { color: '#52c41a' },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert('Payment initiation failed: ' + err.message);
      setPaymentProcessing(false);
    }
  };


  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircleOutlined
            style={{
              fontSize: '72px',
              color: '#52c41a',
              marginBottom: '24px',
              background: 'white',
              borderRadius: '50%',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
            }}
          />
        </motion.div>
        <Title level={2} style={{ marginBottom: '16px', color: '#2d3436' }}>
          Payment Successful!
        </Title>
        <Text type="secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
          Your payment of <Text strong>₹{merchantTotal}</Text> has been processed successfully.
        </Text>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Spin size="large" />
        </motion.div>
        <div style={{ marginTop: '24px', color: '#636e72' }}>
          <Text>Redirecting to your coupons…</Text>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', background: '#f8f9fa' }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        Back to cart
      </Button>

      <Steps current={1} style={{ marginBottom: '40px' }}>
        <Step title="Cart" icon={<ShoppingCartOutlined />} />
        <Step title="Payment" icon={<CreditCardOutlined />} />
        <Step title="Complete" icon={<CheckCircleOutlined />} />
      </Steps>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Order Summary" bordered={false}>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {couponList.map((coupon, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: idx < couponList.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>

                    {coupon.logo ? (
                      <Image
                        crossOrigin="anonymous"
                        src={`${hosturl}${coupon.logo}`}
                        alt={coupon.title}
                        width={80}
                        height={80}
                        style={{ borderRadius: '8px', marginRight: '16px' }}
                        preview={false}
                      />
                    ) : (
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '8px',
                          marginRight: '16px',
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TagOutlined style={{ fontSize: '24px', color: '#999' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <Text strong>{coupon.title}</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Tag color="green">{coupon.type}</Tag>
                      </div>
                      <Text type="secondary">Qty: {coupon.quantity || 1}</Text>
                      <br />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Tooltip title={couponList.length <= 2 ? 'At least 2 coupons required' : 'Remove this coupon'}>
                    <Button
                      danger
                      type="text"
                      onClick={() => handleRemoveCoupon(idx)}
                      disabled={couponList.length <= 2}
                      style={{ marginLeft: 12 }}
                    >
                      Remove
                    </Button>
                  </Tooltip>

                </div>
              ))}

            </div>
            <Divider />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Merchant Source Selection" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <Text strong>Select Merchant Source</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Choose source"
                onChange={(val) => {
                  setMerchantSourceType(val);
                  setSelectedStates([]);
                  setSelectedCities([]);
                  setSelectedPincodes([]);
                }}
                value={merchantSourceType}
              >
                {Object.keys(merchantPricing).map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </div>
            {/* State selection when needed */}
            {(merchantSourceType === 'Full state' ||
              merchantSourceType === 'Two States' ||
              merchantSourceType === 'Full city') && (
                <div style={{ marginTop: 16 }}>
                  <Text>
                    Select State{merchantSourceType === 'Two States' ? 's' : ''}
                  </Text>
                  <Select
                    mode={merchantSourceType === 'Two States' ? 'multiple' : undefined}
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Select state(s)"
                    value={
                      merchantSourceType === 'Two States'
                        ? selectedStates
                        : selectedStates[0] || undefined
                    }
                    onChange={(vals) => {
                      let maxAllowed = Infinity;
                      if (
                        merchantSourceType === 'Full state' ||
                        merchantSourceType === 'Full city'
                      ) {
                        maxAllowed = 1;
                      } else if (merchantSourceType === 'Two States') {
                        maxAllowed = 2;
                      }

                      const selectedCount = Array.isArray(vals) ? vals.length : vals ? 1 : 0;

                      if (selectedCount > maxAllowed) {
                        setStateError(
                          `You can select up to ${maxAllowed} state(s) for ${merchantSourceType}`
                        );
                        return;
                      }

                      setStateError('');

                      if (
                        merchantSourceType === 'Full state' ||
                        merchantSourceType === 'Full city'
                      ) {
                        setSelectedStates(vals ? [vals] : []);
                      } else {
                        setSelectedStates(vals);
                      }

                      if (merchantSourceType === 'Full city') {
                        setSelectedCities([]);
                      }
                    }}
                    maxTagCount={merchantSourceType === 'Two States' ? 2 : 1}
                    allowClear
                  >
                    {availableStates.map((st) => (
                      <Option key={st} value={st}>
                        {st}
                      </Option>
                    ))}
                  </Select>

                  {stateError && (
                    <div style={{ color: 'red', marginTop: 4, fontSize: 12 }}>
                      {stateError}
                    </div>
                  )}
                </div>
              )}

            {/* City (district) selection, only when Full city is selected and exactly one state selected */}
            {merchantSourceType === 'Full city' && selectedStates.length === 1 && (
              <div style={{ marginTop: 16 }}>
                <Text>Select City / District(s)</Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Select city/district(s)"
                  value={selectedCities}
                  onChange={(vals) => {
                    if (selectedStates.length !== 1) {
                      setCityError('Please select exactly one state before selecting cities.');
                      return;
                    }
                    setCityError('');
                    setSelectedCities(vals);
                  }}
                  allowClear
                >
                  {availableCities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>

                {cityError && (
                  <div style={{ color: 'red', marginTop: 4, fontSize: 12 }}>
                    {cityError}
                  </div>
                )}
              </div>
            )}


            {/* Pincode selection when merchantSourceType includes 'Pincode' */}
            {merchantSourceType && merchantSourceType.includes('Pincode') && (
              <div style={{ marginTop: 16 }}>
                <Text>Select Pincode(s)</Text>
                <Select
                  mode="multiple"
                  showSearch
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Select pincodes"
                  value={selectedPincodes}
                  onChange={(vals) => {
                    let allowedMax = Infinity;

                    if (merchantSourceType === 'Single Pincode') allowedMax = 1;
                    else if (merchantSourceType === '2 Pincodes') allowedMax = 2;
                    else if (merchantSourceType === '3 to 4 Pincode') allowedMax = 4;
                    else if (merchantSourceType === '5 to 10 Pincode') allowedMax = 10;

                    if (vals.length > allowedMax) {
                      setPincodeError(`You can select up to ${allowedMax} pincodes for ${merchantSourceType}`);
                      return;
                    }

                    setPincodeError('');
                    setSelectedPincodes(vals);
                  }}
                  optionFilterProp="children"
                  maxTagCount={5}
                  allowClear
                >
                  {availablePincodes.map((pc) => (
                    <Option key={pc} value={pc}>
                      {pc}
                    </Option>
                  ))}
                </Select>

                {pincodeError && (
                  <div style={{ color: 'red', marginTop: 4, fontSize: 12 }}>
                    {pincodeError}
                  </div>
                )}
              </div>
            )}

            <Form.Item label="Agent Code" style={{ marginTop: '20px' }}>
              <Input
                size="medium" value={agentCode} onChange={(e) => setagentCode(e.target.value)}
              />
            </Form.Item>


            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Merchant Cost:</Text>
              <Text>₹{merchantPrice}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>GST (18%):</Text>
              <Text>₹{gst}</Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              <Text>Total Merchant Price:</Text>
              <Text strong style={{ color: !isPaid && merchantPrice === 0 ? '#52c41a' : '#000' }}>
                ₹{merchantPrice}
              </Text>

            </div>
          </Card>
          <Card title="Order Total" bordered={false} style={{ marginTop: 10 }}>
            <div style={{ padding: '1px 0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                  padding: '1px 0',
                }}
              >
                <Text strong style={{ fontSize: '16px' }}>
                  Total (Coupons + Reach):
                </Text>
                <Text strong style={{ fontSize: '20px' }}>₹{merchantTotal}</Text>
              </div>
            </div>
            <Checkbox onChange={(e) => setAgreed(e.target.checked)}>
              I agree to the{" "}
              <a
                href="/SLA_Agreement_with_Merchant_Partners.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>
            </Checkbox>
            {!agreed && (
              <Text type="danger" style={{ display: "block", marginTop: 4 }}>
                You must agree to the Terms and Conditions
              </Text>
            )}
            <Button
              type="primary"
              size="large"
              block
              onClick={handleCompletePayment}
              disabled={
                !agreed ||
                couponList.length === 0 ||
                paymentProcessing ||
                !validateMerchantSelection()
              }
              loading={paymentProcessing}
              style={{ marginTop: 5 }}
            >
              {merchantPrice === 0
                ? "Get Complimentary"
                : paymentProcessing
                  ? "Processing..."
                  : "Complete Payment"}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
