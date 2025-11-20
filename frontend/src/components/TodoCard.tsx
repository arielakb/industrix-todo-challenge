import React, { useState } from 'react';
import { Card, Checkbox, Tag, Space, Button, Popconfirm, Tooltip, Typography } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import { Todo } from '../types';
import { useTodoContext } from '../context/TodoContext';
import { formatDate, getPriorityTagColor } from '../utils/helpers';
import TodoFormModal from './TodoFormModal';

const { Text, Paragraph } = Typography;

interface TodoCardProps {
    todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
    const { toggleTodoComplete, deleteTodo } = useTodoContext();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleToggleComplete = () => {
        toggleTodoComplete(todo.id);
    };

    const handleDelete = async () => {
        try {
            await deleteTodo(todo.id);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    return (
        <>
            <Card
                hoverable
                className={todo.completed ? 'todo-completed' : ''}
                style={{
                    marginBottom: 16,
                    borderLeft: `4px solid ${todo.category?.color || '#ccc'}`,
                }}
                bodyStyle={{ padding: 16 }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Space align="start">
                            <Checkbox checked={todo.completed} onChange={handleToggleComplete} />
                            <div>
                                <Text
                                    strong
                                    className={todo.completed ? 'todo-title' : ''}
                                    style={{ fontSize: 16 }}
                                >
                                    {todo.title}
                                </Text>
                            </div>
                        </Space>

                        <Space>
                            <Tooltip title="Edit">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => setIsEditModalOpen(true)}
                                    size="small"
                                />
                            </Tooltip>
                            <Popconfirm
                                title="Delete todo"
                                description="Are you sure you want to delete this todo?"
                                onConfirm={handleDelete}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title="Delete">
                                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                                </Tooltip>
                            </Popconfirm>
                        </Space>
                    </div>

                    {/* Description */}
                    {todo.description && (
                        <Paragraph
                            style={{
                                marginLeft: 28,
                                marginBottom: 8,
                                color: todo.completed ? '#9ca3af' : '#6b7280',
                            }}
                            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                        >
                            {todo.description}
                        </Paragraph>
                    )}

                    {/* Metadata */}
                    <div style={{ marginLeft: 28 }}>
                        <Space wrap>
                            {/* Priority Tag */}
                            <Tag color={getPriorityTagColor(todo.priority)}>
                                {todo.priority.toUpperCase()}
                            </Tag>

                            {/* Category */}
                            {todo.category && (
                                <Tag
                                    icon={<FolderOutlined />}
                                    color={todo.category.color}
                                    style={{ borderRadius: 4 }}
                                >
                                    {todo.category.name}
                                </Tag>
                            )}

                            {/* Due Date */}
                            {todo.due_date && (
                                <Tag icon={<CalendarOutlined />} color={todo.completed ? 'default' : 'blue'}>
                                    {formatDate(todo.due_date)}
                                </Tag>
                            )}
                        </Space>
                    </div>
                </Space>
            </Card>

            <TodoFormModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                todo={todo}
            />
        </>
    );
};

export default TodoCard;