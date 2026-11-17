import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Progress, Typography, Row, Col, Statistic, Alert, message } from 'antd';
import { hosturl } from '../libs/Constant';
import LocationEditor from './LocationEditor';

const { Title, Text } = Typography;

// Reads a JSON response safely. Returns { ok, data }.
const call = async (url, options) => {
  const res = await fetch(url, options);
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  return { ok: res.ok, data };
};

const LocationsPage = () => {
  const [msgApi, msgHolder] = message.useMessage();
  const [file, setFile] = useState(null);
  const [dbStates, setDbStates] = useState(0);
  const [dbPins, setDbPins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const st = await call(`${hosturl}/location/states`);
      setDbStates(st.ok && Array.isArray(st.data.result) ? st.data.result.length : 0);
      const pin = await call(`${hosturl}/pincode`);
      setDbPins(pin.ok && Array.isArray(pin.data.result) ? pin.data.result.length : 0);
    } catch (e) {
      setError('Cannot reach the server right now.');
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${process.env.PUBLIC_URL || ''}/india-locations.json`);
        setFile(await r.json());
      } catch (e) {
        setError('Could not load the locations file.');
      }
    })();
    refresh();
  }, [refresh]);

  const fileDistricts = file ? file.states.reduce((n, s) => n + s.d.length, 0) : 0;
  const filePins = file
    ? new Set(file.states.flatMap((s) => s.d.flatMap((d) => d.p))).size
    : 0;

  const runImport = async () => {
    if (!file) return;
    setError('');
    setLoading(true);
    setPercent(0);
    const token = localStorage.getItem('token');
    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      // 1) State and district names (stored once as a single record)
      setStatus('Saving states and districts...');
      const existing = await call(`${hosturl}/location/states`);
      const hasStates = existing.ok && Array.isArray(existing.data.result) && existing.data.result.length > 0;
      if (!hasStates) {
        const body = {
          states: file.states.map((s) => ({
            name: s.n,
            districts: s.d.map((d) => ({ name: d.n, pinCodes: [] })),
          })),
        };
        const r = await call(`${hosturl}/location`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(body),
        });
        if (!r.ok) throw new Error(r.data.displayMessage || 'Could not save states and districts');
      }

      // 2) Pincodes, one state at a time (skips states that already have them)
      let done = 0;
      let skipped = 0;
      for (const s of file.states) {
        setStatus(`Saving pincodes: ${s.n} (${done + 1} of ${file.states.length})`);
        const have = await call(`${hosturl}/state/cities/${encodeURIComponent(s.n)}`);
        if (have.ok && Array.isArray(have.data.result) && have.data.result.length > 0) {
          skipped += 1;
        } else {
          const r = await call(`${hosturl}/admin/pincode`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
              state: s.n,
              cities: s.d.map((d) => ({ name: d.n, pinCode: d.p })),
            }),
          });
          if (!r.ok) throw new Error(`${s.n}: ${r.data.displayMessage || 'could not save pincodes'}`);
        }
        done += 1;
        setPercent(Math.round((done / file.states.length) * 100));
      }
      setStatus('');
      msgApi.success(skipped ? `Done. ${skipped} states were already loaded and were skipped.` : 'All locations loaded.');
    } catch (e) {
      setError(e.message || 'Something went wrong. You can safely click the button again; it skips what is already saved.');
    } finally {
      setLoading(false);
      refresh();
    }
  };

  const complete = file && dbStates >= file.states.length && dbPins >= filePins;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      {msgHolder}
      <Title level={3} style={{ marginBottom: 8, fontFamily: 'poppins', fontWeight: '500' }}>
        Locations &amp; Pincodes
      </Title>
      <Text type="secondary">
        Vendors pick their state, district and pincodes from this list, and customers are matched to deals by pincode.
      </Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="In the database now">
            <Row gutter={16}>
              <Col span={12}><Statistic title="States" value={dbStates} /></Col>
              <Col span={12}><Statistic title="Pincodes" value={dbPins} /></Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Ready to load (India list)">
            <Row gutter={16}>
              <Col span={8}><Statistic title="States" value={file ? file.states.length : 0} /></Col>
              <Col span={8}><Statistic title="Districts" value={fileDistricts} /></Col>
              <Col span={8}><Statistic title="Pincodes" value={filePins} /></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {complete ? (
        <Alert style={{ marginTop: 24 }} type="success" showIcon message="All states and pincodes are loaded. Nothing more to do here." />
      ) : null}
      {error ? <Alert style={{ marginTop: 24 }} type="error" showIcon message={error} /> : null}

      <div style={{ marginTop: 24 }}>
        <Button type="primary" size="large" onClick={runImport} loading={loading} disabled={!file || complete}>
          Load locations &amp; pincodes
        </Button>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">
            Safe to click again: anything already saved is skipped. It takes about a minute.
          </Text>
        </div>
      </div>

      {loading || percent > 0 ? (
        <div style={{ marginTop: 24 }}>
          <Progress percent={percent} status={loading ? 'active' : 'normal'} />
          <Text type="secondary">{status}</Text>
        </div>
      ) : null}

      <LocationEditor onChanged={refresh} />
    </div>
  );
};

export default LocationsPage;
