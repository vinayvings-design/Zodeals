import React, { useEffect, useState } from 'react';
import { Card, Switch, Typography, Modal, Spin, Tag, message } from 'antd';
import { hosturl } from '../libs/Constant';

const { Title, Text, Paragraph } = Typography;

const PlanModePage = () => {
  const [msgApi, msgHolder] = message.useMessage();
  const [planMode, setPlanMode] = useState(null); // 'free' | 'paid' | null while loading
  const [pending, setPending] = useState(null); // mode waiting for confirmation
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem('token');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${hosturl}/admin/plan-mode`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const data = await res.json();
        if (data?.result?.planMode) setPlanMode(data.result.planMode);
        else throw new Error('No plan mode in response');
      } catch (e) {
        msgApi.error('Could not load the current plan mode');
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmChange = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${hosturl}/admin/plan-mode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ planMode: pending }),
      });
      const data = await res.json();
      if (!res.ok || !data?.result?.planMode) throw new Error(data?.displayMessage || 'Failed');
      setPlanMode(data.result.planMode);
      msgApi.success(`Platform is now ${data.result.planMode === 'free' ? 'Free' : 'Paid'}`);
      setPending(null);
    } catch (e) {
      msgApi.error('Could not update the plan mode');
    } finally {
      setSaving(false);
    }
  };

  const isFree = planMode === 'free';

  return (
    <div style={{ padding: 24, maxWidth: 760 }}>
      {msgHolder}
      <Title level={3} style={{ marginBottom: 4 }}>Plan Mode</Title>
      <Paragraph type="secondary">
        Choose whether vendors pay to publish coupons and deals. This applies to every vendor.
      </Paragraph>

      <Card>
        {planMode === null ? (
          <Spin />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Switch
                checked={isFree}
                checkedChildren="Free"
                unCheckedChildren="Paid"
                onChange={(checked) => setPending(checked ? 'free' : 'paid')}
                style={{ transform: 'scale(1.3)', marginLeft: 6 }}
              />
              <Text strong style={{ fontSize: 16 }}>
                Currently: <Tag color={isFree ? 'green' : 'blue'}>{isFree ? 'Free' : 'Paid'}</Tag>
              </Text>
            </div>

            <div style={{ marginTop: 20 }}>
              <Text strong>Free</Text>
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                Vendors publish coupons and deals with a "Publish" button. No payment is shown and there is no
                limit on how many they can publish. They still choose the area (pincode, city, state or all India).
              </Paragraph>
              <Text strong>Paid</Text>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                How it works today: vendors need at least 2 coupons to continue to checkout, and more than 2 are
                charged at the listed prices.
              </Paragraph>
            </div>
          </>
        )}
      </Card>

      <Modal
        open={pending !== null}
        title={pending === 'free' ? 'Switch to Free?' : 'Switch to Paid?'}
        okText={pending === 'free' ? 'Switch to Free' : 'Switch to Paid'}
        confirmLoading={saving}
        onOk={confirmChange}
        onCancel={() => setPending(null)}
      >
        {pending === 'free' ? (
          <p>Vendors will be able to publish without paying and without a limit. Anything already published stays live.</p>
        ) : (
          <p>Vendors will have to pay again when publishing more than 2. Anything already published stays live.</p>
        )}
      </Modal>
    </div>
  );
};

export default PlanModePage;
