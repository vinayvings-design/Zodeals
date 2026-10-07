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
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { hosturl } from '../libs/Constant';

const { Title } = Typography;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
    setEditingCategory(null);
    showModal();
  };

  const handleEdit = (category) => {
    form.setFieldsValue({ title: category.title });
    setImagePreview(category.imageUrl);
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

  const handleImageChange = async (info) => {
    const file = info.file;
    const isImage = file.type && file.type.startsWith('image/');
    if (!isImage) return message.error('Only image files are allowed!');
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  
  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24, fontFamily: 'poppins', fontWeight: '500' }}>
        Category Management
      </Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 24 }}
      >
        Add Category
      </Button>

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

          <Form.Item label="Category Image">
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
