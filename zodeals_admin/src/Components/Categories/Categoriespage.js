import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Typography,
} from 'antd';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import { v4 as uuidv4 } from 'uuid';
import { hosturl } from '../libs/Constant';
import { DEFAULT_CATEGORIES, ICON_LIBRARY, iconUrl, iconToFile } from './categoryIcons';

const { Title } = Typography;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
    setCategories(data.result);
    } catch (error) {
      console.error(error);
      message.error('Error loading categories');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    form.resetFields();
    setImagePreview(null);
    setImageFile(null);
    setSelectedIcon(null);
    setEditingCategory(null);
    showModal();
  };

  const handleEdit = (category) => {
    form.setFieldsValue({ title: category.title });
    setImagePreview(category.image ? `${hosturl}${category.image}` : null);
    setSelectedIcon(null);
    setEditingCategory(category);
    showModal();
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${hosturl}/admin/category/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Error deleting category');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('title', values.title);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = editingCategory
        ? `${hosturl}/admin/category/${editingCategory._id}`
        : `${hosturl}/admin/category`;

      const method = editingCategory ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving category');
      }
      fetchCategories();

      message.success(editingCategory ? 'Category updated' : 'Category added');
      setIsModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setImageFile(null);
      
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handlePickIcon = async (key, label) => {
    try {
      const file = await iconToFile(key, label);
      setImageFile(file);
      setSelectedIcon(key);
      setImagePreview(iconUrl(key));
      if (!form.getFieldValue('title')) form.setFieldsValue({ title: label });
    } catch (e) {
      message.error('Could not load that icon');
    }
  };

  // Adds every default category that does not exist yet, each with its icon.
  const handleAddDefaults = () => {
    const existing = new Set(categories.map((c) => (c.title || '').trim().toLowerCase()));
    const todo = DEFAULT_CATEGORIES.filter((d) => !existing.has(d.title.toLowerCase()));
    if (todo.length === 0) return message.info('All default categories already exist.');
    Modal.confirm({
      title: `Add ${todo.length} default categories?`,
      content: 'Each one is created with a matching icon. Categories you already have are skipped, and you can edit or delete any of them later.',
      okText: 'Add them',
      onOk: async () => {
        setSeeding(true);
        const token = localStorage.getItem('token');
        let added = 0;
        const failed = [];
        for (const d of todo) {
          try {
            const fd = new FormData();
            fd.append('title', d.title);
            fd.append('image', await iconToFile(d.icon, d.icon));
            const r = await fetch(`${hosturl}/admin/category`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: fd,
            });
            if (r.ok) added += 1;
            else failed.push(d.title);
          } catch (e) {
            failed.push(d.title);
          }
        }
        setSeeding(false);
        await fetchCategories();
        if (failed.length) message.warning(`Added ${added}. Failed: ${failed.join(', ')}`);
        else message.success(`Added ${added} categories`);
      },
    });
  };

  const handleImageChange = async (info) => {
    const file = info.file;
    const isImage = file.type && file.type.startsWith('image/');
    if (!isImage) return message.error('Only image files are allowed!');
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
    setSelectedIcon(null);
  };

  
  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24, fontFamily: 'poppins', fontWeight: '500' }}>
        Category Management
      </Title>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Category
        </Button>
        <Button onClick={handleAddDefaults} loading={seeding}>
          Add default categories
        </Button>
      </div>

  <Row gutter={[16, 16]}>
  {categories.map((category) => (
    <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
      <Card
        hoverable
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
        cover={
          <img
            crossOrigin="anonymous"
            src={`${hosturl}${category.image}`}
            alt={category.title}
            style={{
              height: 200,
              width: '100%',
              objectFit:"contain",
              borderBottom: '1px solid #f0f0f0',
            }}
            onError={(e) => {
              console.error('Image load failed:', e.target.src);
              e.target.src = 'https://via.placeholder.com/200?text=No+Image';
            }}
          />


        }
        actions={[
          <EditOutlined key="edit" onClick={() => handleEdit(category)} />,
          <DeleteOutlined key="delete" onClick={() => handleDelete(category._id)} />,
        ]}
      >
        <Card.Meta
          title={
            <div style={{ textAlign: 'center', fontWeight: 500 }}>
              {category.title}
            </div>
          }
        />
      </Card>
    </Col>
  ))}
</Row>


      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          setImagePreview(null);
          setImageFile(null);
          setSelectedIcon(null);
        }}
        okText="Save"
        cancelText="Cancel"
        width={500}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label="Category Title"
            rules={[{ required: true, message: 'Please enter the category title' }]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item label="Choose an icon">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto', padding: 4, border: '1px solid #f0f0f0', borderRadius: 8 }}>
              {ICON_LIBRARY.map((ic) => (
                <button
                  type="button"
                  key={ic.key}
                  title={ic.label}
                  onClick={() => handlePickIcon(ic.key, ic.label)}
                  style={{
                    cursor: 'pointer',
                    background: selectedIcon === ic.key ? '#EAF2FE' : '#fff',
                    border: selectedIcon === ic.key ? '2px solid #3B84ED' : '1px solid #eee',
                    borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}
                >
                  <img src={iconUrl(ic.key)} alt={ic.label} style={{ width: 36, height: 36 }} />
                  <span style={{ fontSize: 9, color: '#667', lineHeight: 1.1, textAlign: 'center' }}>{ic.label}</span>
                </button>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="Or upload your own image">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {imagePreview && (
              <div
                style={{
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                    padding: 4,
                  }}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
