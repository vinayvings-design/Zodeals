import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, Button, Select, Input, Typography, Alert, Popconfirm, Space, Tag, message } from 'antd';
import { hosturl } from '../libs/Constant';

const { Text } = Typography;
const NEW_STATE = '__new__';

let keySeed = 0;
const nextKey = () => `d${(keySeed += 1)}`;

const call = async (url, options) => {
  const res = await fetch(url, options);
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  return { ok: res.ok, status: res.status, data };
};

const parsePins = (text) => [...new Set(String(text || '').split(/[\s,;]+/).map((p) => p.trim()).filter(Boolean))];

const toDraft = (state) => ({
  originalName: state ? state.name : '',
  name: state ? state.name : '',
  districts: (state ? state.districts : [{ name: '', pinCodes: [] }]).map((d) => ({
    key: nextKey(),
    name: d.name,
    pinText: d.pinCodes.join(', '),
  })),
});

const LocationEditor = ({ onChanged }) => {
  const [msgApi, msgHolder] = message.useMessage();
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [needsBackend, setNeedsBackend] = useState(false);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const load = useCallback(async () => {
    setError('');
    try {
      const r = await call(`${hosturl}/admin/location-data`, { headers: authHeaders() });
      if (r.status === 404) {
        setNeedsBackend(true);
        return [];
      }
      if (!r.ok) throw new Error(r.data.displayMessage || 'Could not load locations');
      setNeedsBackend(false);
      const list = Array.isArray(r.data.result) ? r.data.result : [];
      setStates(list);
      return list;
    } catch (e) {
      setError(e.message || 'Cannot reach the server right now.');
      return [];
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const choose = (value) => {
    setSelected(value);
    setFilter('');
    if (value === NEW_STATE) setDraft(toDraft(null));
    else setDraft(toDraft(states.find((s) => s.name === value)));
  };

  const setDistrict = (key, patch) =>
    setDraft((d) => ({ ...d, districts: d.districts.map((x) => (x.key === key ? { ...x, ...patch } : x)) }));

  const addDistrict = () =>
    setDraft((d) => ({ ...d, districts: [{ key: nextKey(), name: '', pinText: '' }, ...d.districts] }));

  const removeDistrict = (key) =>
    setDraft((d) => ({ ...d, districts: d.districts.filter((x) => x.key !== key) }));

  const save = async () => {
    setError('');
    if (!draft.name.trim()) return setError('Enter the state name.');
    const body = {
      originalName: draft.originalName,
      name: draft.name.trim(),
      districts: draft.districts.map((d) => ({ name: d.name.trim(), pinCodes: parsePins(d.pinText) })),
    };
    setSaving(true);
    try {
      const r = await call(`${hosturl}/admin/location-data/state`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(r.data.displayMessage || 'Could not save');
      msgApi.success('Saved');
      const list = await load();
      const saved = list.find((s) => s.name === body.name);
      setSelected(body.name);
      setDraft(toDraft(saved));
      if (onChanged) onChanged();
    } catch (e) {
      setError(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setError('');
    setSaving(true);
    try {
      const r = await call(`${hosturl}/admin/location-data/state/${encodeURIComponent(draft.originalName)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!r.ok) throw new Error(r.data.displayMessage || 'Could not delete');
      msgApi.success('State deleted');
      setSelected(null);
      setDraft(null);
      await load();
      if (onChanged) onChanged();
    } catch (e) {
      setError(e.message || 'Could not delete');
    } finally {
      setSaving(false);
    }
  };

  const shown = useMemo(() => {
    if (!draft) return [];
    const q = filter.trim().toLowerCase();
    return q ? draft.districts.filter((d) => d.name.toLowerCase().includes(q) || d.pinText.includes(q)) : draft.districts;
  }, [draft, filter]);

  return (
    <Card title="Edit states, districts and pincodes" style={{ marginTop: 32 }}>
      {msgHolder}
      {needsBackend ? (
        <Alert
          type="warning"
          showIcon
          message="The backend needs to be redeployed before editing works."
          description="The new edit routes are in the code but the running backend does not have them yet."
        />
      ) : null}
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}

      {!needsBackend ? (
        <>
          <Select
            showSearch
            style={{ width: '100%', maxWidth: 420 }}
            placeholder="Choose a state to edit"
            value={selected}
            onChange={choose}
            optionFilterProp="label"
            options={[
              { value: NEW_STATE, label: '+ Add a new state' },
              ...states.map((s) => ({ value: s.name, label: s.name })),
            ]}
          />

          {draft ? (
            <div style={{ marginTop: 24 }}>
              <Text strong>State name</Text>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                style={{ maxWidth: 420, display: 'block', marginTop: 4, marginBottom: 20 }}
                placeholder="e.g. Karnataka"
              />

              <Space wrap style={{ marginBottom: 12 }}>
                <Button onClick={addDistrict}>+ Add district</Button>
                <Input
                  allowClear
                  placeholder="Search a district or pincode"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ width: 260 }}
                />
                <Tag color="blue">{draft.districts.length} districts</Tag>
                <Tag color="blue">
                  {new Set(draft.districts.flatMap((d) => parsePins(d.pinText))).size} pincodes
                </Tag>
              </Space>

              <div style={{ maxHeight: 520, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                {shown.map((d) => (
                  <div key={d.key} style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap' }}>
                    <div style={{ width: 240, maxWidth: '100%' }}>
                      <Input
                        value={d.name}
                        onChange={(e) => setDistrict(d.key, { name: e.target.value })}
                        placeholder="District name"
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {parsePins(d.pinText).length} pincodes
                      </Text>
                    </div>
                    <Input.TextArea
                      style={{ flex: 1, minWidth: 220 }}
                      autoSize={{ minRows: 2, maxRows: 5 }}
                      value={d.pinText}
                      onChange={(e) => setDistrict(d.key, { pinText: e.target.value })}
                      placeholder="Pincodes separated by commas, spaces or new lines"
                    />
                    <Popconfirm title={`Remove ${d.name || 'this district'}?`} okText="Remove" onConfirm={() => removeDistrict(d.key)}>
                      <Button danger>Remove</Button>
                    </Popconfirm>
                  </div>
                ))}
                {shown.length === 0 ? (
                  <div style={{ padding: 16 }}>
                    <Text type="secondary">No districts to show.</Text>
                  </div>
                ) : null}
              </div>

              <Space style={{ marginTop: 20 }}>
                <Button type="primary" onClick={save} loading={saving}>
                  Save state
                </Button>
                {draft.originalName ? (
                  <Popconfirm
                    title={`Delete ${draft.originalName} and all its pincodes?`}
                    description="Stores already using these pincodes keep their saved data."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={remove}
                  >
                    <Button danger loading={saving}>Delete state</Button>
                  </Popconfirm>
                ) : null}
              </Space>
            </div>
          ) : null}
        </>
      ) : null}
    </Card>
  );
};

export default LocationEditor;
