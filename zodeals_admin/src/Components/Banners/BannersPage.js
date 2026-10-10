import React, { useEffect, useState } from 'react';
import {
  Card, Button, Row, Col, Modal, Form, Input, InputNumber, Select, Switch,
  Upload, message, Typography, Tag, Popconfirm, Empty, Spin, Space,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined,
} from '@ant-design/icons';
import { hosturl } from '../libs/Constant';

const { Title, Text } = Typography;
const { TextArea } = Input;

const THEMES = [
  { value: 'orange', label: 'Orange (default)', color: '#FF6B35' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6' },
  { value: 'blue',   label: 'Blue', color: '#0EA5E9' },
];

// Same rule as the server: an in-site path ("/alldeals") or a full http(s) URL.
const validateLink = (_, value) => {
  const link = (value || '').trim();
  if (!link) return Promise.resolve();
  if (link.startsWith('/') && !link.startsWith('//')) return Promise.resolve();
  try {
    const u = new URL(link);
    if (u.protocol === 'https:' || u.protocol === 'http:') return Promise.resolve();
  } catch (e) { /* fall through */ }
  return Promise.reject(new Error('Use a path like /alldeals or a full https:// link'));
};

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const readError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.displayMessage || data.message || data.error || fallback;
  } catch (e) {
    return fallback;
  }
};

const BannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form] = Form.useForm();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${hosturl}/admin/banners`, { headers: authHeaders() });
      if (!response.ok) throw new Error(await readError(response, 'Failed to load banners'));
      const data = await response.json();
      setBanners(Array.isArray(data.result) ? data.result : []);
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error loading banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const resetModal = () => {
    setOpen(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
    form.resetFields();
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ theme: 'orange', isActive: true });
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
    setOpen(true);
  };

  const handleEdit = (banner) => {
    form.setFieldsValue({
      headline: banner.headline,
      accentText: banner.accentText,
      badge: banner.badge,
      subtitle: banner.subtitle,
      primaryLabel: banner.primaryLabel,
      primaryLink: banner.primaryLink,
      secondaryLabel: banner.secondaryLabel,
      secondaryLink: banner.secondaryLink,
      theme: banner.theme,
      isActive: banner.isActive,
      order: banner.order,
    });
    setEditing(banner);
    setImageFile(null);
    setImagePreview(`${hosturl}${banner.image}`);
    setOpen(true);
  };

  const handleImageChange = (info) => {
    const file = info.file;
    if (!file.type || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      message.error('Please choose a JPG, PNG, WebP or GIF image');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error('Image must be smaller than 10 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!editing && !imageFile) {
        message.error('Please upload a banner image');
        return;
      }
      setSaving(true);
      const formData = new FormData();
      ['headline', 'accentText', 'badge', 'subtitle', 'primaryLabel', 'primaryLink',
        'secondaryLabel', 'secondaryLink', 'theme'].forEach((key) => {
        formData.append(key, (values[key] || '').toString().trim());
      });
      formData.append('isActive', values.isActive ? 'true' : 'false');
      if (values.order !== undefined && values.order !== null) formData.append('order', values.order);
      if (imageFile) formData.append('image', imageFile);

      const url = editing ? `${hosturl}/admin/banner/${editing._id}` : `${hosturl}/admin/banner`;
      const response = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: authHeaders(),
        body: formData,
      });
      if (!response.ok) throw new Error(await readError(response, 'Error saving banner'));

      message.success(editing ? 'Banner updated' : 'Banner added');
      resetModal();
      fetchBanners();
    } catch (error) {
      if (error && error.errorFields) return; // form validation, shown inline
      console.error(error);
      message.error(error.message || 'Error saving banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${hosturl}/admin/banner/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error(await readError(response, 'Delete failed'));
      message.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error deleting banner');
    }
  };

  const handleToggle = async (banner, isActive) => {
    try {
      const formData = new FormData();
      formData.append('isActive', isActive ? 'true' : 'false');
      const response = await fetch(`${hosturl}/admin/banner/${banner._id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: formData,
      });
      if (!response.ok) throw new Error(await readError(response, 'Update failed'));
      setBanners((prev) => prev.map((b) => (b._id === banner._id ? { ...b, isActive } : b)));
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error updating banner');
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 4, fontFamily: 'poppins', fontWeight: '500' }}>
        Hero Banners
      </Title>
      <Text type="secondary">
        These slides appear at the top of the home page, in the order shown. If no banner is active,
        the website shows its default slides.
      </Text>

      <div style={{ margin: '20px 0 24px' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Banner
          </Button>
          <Text type="secondary">{activeCount} of {banners.length} live</Text>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin /></div>
      ) : banners.length === 0 ? (
        <Empty description="No banners yet. The website is showing its default slides." />
      ) : (
        <Row gutter={[16, 16]}>
          {banners.map((banner) => (
            <Col xs={24} md={12} xl={8} key={banner._id}>
              <Card
                hoverable
                style={{ borderRadius: 12, overflow: 'hidden', opacity: banner.isActive ? 1 : 0.65 }}
                cover={
                  <img
                    crossOrigin="anonymous"
                    src={`${hosturl}${banner.image}`}
                    alt={banner.headline}
                    style={{ height: 180, width: '100%', objectFit: 'cover', borderBottom: '1px solid #f0f0f0' }}
                  />
                }
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEdit(banner)} />,
                  <Popconfirm
                    key="delete"
                    title="Delete this banner?"
                    description="It will be removed from the home page."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(banner._id)}
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{banner.headline}</div>
                    <Space size={4} wrap>
                      <Tag>Position {banner.order}</Tag>
                      <Tag color={THEMES.find((t) => t.value === banner.theme)?.color}>{banner.theme}</Tag>
                    </Space>
                  </div>
                  <Switch
                    checked={banner.isActive}
                    checkedChildren="Live"
                    unCheckedChildren="Hidden"
                    onChange={(checked) => handleToggle(banner, checked)}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editing ? 'Edit Banner' : 'Add Banner'}
        open={open}
        onOk={handleSave}
        onCancel={resetModal}
        okText="Save"
        confirmLoading={saving}
        width={640}
        destroyOnClose={false}
        maskClosable={false}
      >
        <Form layout="vertical" form={form} initialValues={{ theme: 'orange', isActive: true }}>
          <Form.Item label="Banner image" required extra="Wide photo works best, about 1160 × 720 px. JPG, PNG, WebP or GIF, up to 10 MB.">
            <Upload accept="image/png,image/jpeg,image/webp,image/gif" showUploadList={false} beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>{imagePreview ? 'Replace image' : 'Upload image'}</Button>
            </Upload>
            {imagePreview && (
              <img
                crossOrigin="anonymous"
                src={imagePreview}
                alt="Preview"
                style={{ marginTop: 12, width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
              />
            )}
          </Form.Item>

          <Form.Item name="headline" label="Headline" rules={[{ required: true, whitespace: true, message: 'Enter a headline' }, { max: 90 }]}>
            <Input placeholder="e.g. Your shortcut to better deals." showCount maxLength={90} />
          </Form.Item>

          <Form.Item
            name="accentText"
            label="Highlighted words (optional)"
            extra="Must match part of the headline exactly. These words are shown in the theme colour with an underline."
            dependencies={['headline']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const v = (value || '').trim();
                  const h = (getFieldValue('headline') || '').trim();
                  if (!v || h.includes(v)) return Promise.resolve();
                  return Promise.reject(new Error('These words are not in the headline'));
                },
              }),
            ]}
          >
            <Input placeholder="e.g. better deals." maxLength={90} />
          </Form.Item>

          <Form.Item name="badge" label="Small label above headline (optional)">
            <Input placeholder="e.g. Verified savings, every day" showCount maxLength={60} />
          </Form.Item>

          <Form.Item name="subtitle" label="Description (optional)">
            <TextArea rows={3} showCount maxLength={220} />
          </Form.Item>

          <Row gutter={12}>
            <Col xs={24} sm={10}>
              <Form.Item name="primaryLabel" label="Main button text" dependencies={['primaryLink']}>
                <Input placeholder="e.g. Explore deals" maxLength={30} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={14}>
              <Form.Item
                name="primaryLink"
                label="Main button link"
                dependencies={['primaryLabel']}
                rules={[
                  { validator: validateLink },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if ((getFieldValue('primaryLabel') || '').trim() && !(value || '').trim()) {
                        return Promise.reject(new Error('Add a link for this button'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="/alldeals or https://…" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} sm={10}>
              <Form.Item name="secondaryLabel" label="Second button text" dependencies={['secondaryLink']}>
                <Input placeholder="e.g. Browse stores" maxLength={30} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={14}>
              <Form.Item
                name="secondaryLink"
                label="Second button link"
                dependencies={['secondaryLabel']}
                rules={[
                  { validator: validateLink },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if ((getFieldValue('secondaryLabel') || '').trim() && !(value || '').trim()) {
                        return Promise.reject(new Error('Add a link for this button'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="/stores or https://…" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} sm={10}>
              <Form.Item name="theme" label="Colour theme">
                <Select
                  options={THEMES.map((t) => ({
                    value: t.value,
                    label: (
                      <span>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: t.color, marginRight: 8 }} />
                        {t.label}
                      </span>
                    ),
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={7}>
              <Form.Item
                name="order"
                label="Position"
                extra={editing ? undefined : 'Leave empty to add last'}
                rules={[{ type: 'number', min: 0, message: '0 or more' }]}
              >
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={7}>
              <Form.Item name="isActive" label="Show on website" valuePropName="checked">
                <Switch checkedChildren="Live" unCheckedChildren="Hidden" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default BannersPage;
