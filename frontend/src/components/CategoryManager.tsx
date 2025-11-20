import React, { useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    List,
    Space,
    Popconfirm,
    Typography,
    Card,
    message,
} from 'antd';
import {
    FolderOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useTodoContext } from '../context/TodoContext';
import { CategoryFormValues } from '../types';

const { Title, Text } = Typography;

const CategoryManager: React.FC = () => {
    const { categories, createCategory, updateCategory, deleteCategory } = useTodoContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [form] = Form.useForm();

    const defaultColors = [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Orange
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#F97316', // Orange-2
    ];

    const handleOpenModal = (categoryId?: number) => {
        if (categoryId) {
            const category = categories.find((c) => c.id === categoryId);
            if (category) {
                setEditingCategory(categoryId);
                form.setFieldsValue({
                    name: category.name,
                    color: category.color,
                });
            }
        } else {
            setEditingCategory(null);
            form.resetFields();
            form.setFieldsValue({ color: defaultColors[0] });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
    };

    const handleSubmit = async (values: CategoryFormValues) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory, values);
            } else {
                await createCategory(values);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Category form error:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id);
        } catch (error: any) {
            if (error.response?.data?.error?.includes('existing todos')) {
                message.error('Cannot delete category with existing todos. Please reassign or delete todos first.');
            }
        }
    };

    return (
        <>
            <Button
                type="default"
                icon={<FolderOutlined />}
                onClick={() => handleOpenModal()}
                size="large"
            >
                Manage Categories
            </Button>

            <Modal
                title="📁 Manage Categories"
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
            >
                {/* Create/Edit Form */}
                <Card style={{ marginBottom: 16 }}>
                    <Title level={5}>
                        {editingCategory ? 'Edit Category' : 'Create New Category'}
                    </Title>
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Category Name"
                            name="name"
                            rules={[
                                { required: true, message: 'Please enter category name' },
                                { max: 50, message: 'Name must be less than 50 characters' },
                            ]}
                        >
                            <Input placeholder="e.g., Work, Personal, Shopping" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Color"
                            name="color"
                            rules={[
                                { required: true, message: 'Please select a color' },
                                {
                                    pattern: /^#[0-9A-F]{6}$/i,
                                    message: 'Invalid color format',
                                },
                            ]}
                        >
                            <div>
                                <Space wrap style={{ marginBottom: 8 }}>
                                    {defaultColors.map((color) => (
                                        <div
                                            key={color}
                                            onClick={() => form.setFieldsValue({ color })}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: color,
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                border:
                                                    form.getFieldValue('color') === color
                                                        ? '3px solid #000'
                                                        : '2px solid #e5e7eb',
                                                transition: 'all 0.2s',
                                            }}
                                        />
                                    ))}
                                </Space>
                                <Input
                                    placeholder="#3B82F6"
                                    size="large"
                                    prefix={
                                        <div
                                            style={{
                                                width: 20,
                                                height: 20,
                                                backgroundColor: form.getFieldValue('color') || '#ccc',
                                                borderRadius: 4,
                                            }}
                                        />
                                    }
                                />
                            </div>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Space>
                                <Button type="primary" htmlType="submit" size="large">
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </Button>
                                {editingCategory && (
                                    <Button onClick={handleCloseModal} size="large">
                                        Cancel
                                    </Button>
                                )}
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Categories List */}
                <div>
                    <Title level={5}>Existing Categories ({categories.length})</Title>
                    {categories.length === 0 ? (
                        <Text type="secondary">No categories yet. Create your first one above!</Text>
                    ) : (
                        <List
                            dataSource={categories}
                            renderItem={(category) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={() => handleOpenModal(category.id)}
                                        />,
                                        <Popconfirm
                                            title="Delete category"
                                            description="This will unassign all todos from this category. Continue?"
                                            onConfirm={() => handleDelete(category.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <Space>
                                        <div
                                            style={{
                                                width: 24,
                                                height: 24,
                                                backgroundColor: category.color,
                                                borderRadius: 6,
                                            }}
                                        />
                                        <Text strong>{category.name}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default CategoryManager;