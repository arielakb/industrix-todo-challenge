import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { Todo, TodoFormValues } from '../types';
import { useTodoContext } from '../context/TodoContext';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface TodoFormModalProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    todo?: Todo;
}

const TodoFormModal: React.FC<TodoFormModalProps> = ({ open, onClose, mode, todo }) => {
    const { categories, createTodo, updateTodo, loading } = useTodoContext();
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && mode === 'edit' && todo) {
            form.setFieldsValue({
                title: todo.title,
                description: todo.description,
                priority: todo.priority,
                category_id: todo.category_id,
                due_date: todo.due_date ? dayjs(todo.due_date) : null,
            });
        } else if (open && mode === 'create') {
            form.resetFields();
        }
    }, [open, mode, todo, form]);

    const handleSubmit = async (values: any) => {
        try {
            const formData: TodoFormValues = {
                title: values.title,
                description: values.description || undefined,
                priority: values.priority,
                category_id: values.category_id || undefined,
                due_date: values.due_date ? values.due_date.toISOString() : undefined,
            };

            if (mode === 'create') {
                await createTodo(formData);
            } else if (mode === 'edit' && todo) {
                await updateTodo(todo.id, formData);
            }

            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={mode === 'create' ? '✨ Create New Todo' : '✏️ Edit Todo'}
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    priority: 'medium',
                }}
            >
                {/* Title */}
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        { required: true, message: 'Please enter todo title' },
                        { max: 200, message: 'Title must be less than 200 characters' },
                    ]}
                >
                    <Input placeholder="Enter todo title" size="large" />
                </Form.Item>

                {/* Description */}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ max: 1000, message: 'Description must be less than 1000 characters' }]}
                >
                    <TextArea
                        placeholder="Enter todo description (optional)"
                        rows={4}
                        showCount
                        maxLength={1000}
                    />
                </Form.Item>

                {/* Priority & Category Row */}
                <Space style={{ width: '100%' }} size="large">
                    {/* Priority */}
                    <Form.Item
                        label="Priority"
                        name="priority"
                        rules={[{ required: true, message: 'Please select priority' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                    >
                        <Select placeholder="Select priority" size="large">
                            <Option value="low">🟢 Low</Option>
                            <Option value="medium">🟡 Medium</Option>
                            <Option value="high">🔴 High</Option>
                        </Select>
                    </Form.Item>

                    {/* Category */}
                    <Form.Item label="Category" name="category_id" style={{ flex: 1, marginBottom: 0 }}>
                        <Select placeholder="Select category" allowClear size="large">
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.id}>
                                    <Space>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                        {cat.name}
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Space>

                {/* Due Date */}
                <Form.Item label="Due Date" name="due_date" style={{ marginTop: 16 }}>
                    <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        placeholder="Select due date (optional)"
                        size="large"
                    />
                </Form.Item>

                {/* Form Actions */}
                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel} size="large">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} size="large">
                            {mode === 'create' ? 'Create Todo' : 'Update Todo'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TodoFormModal;