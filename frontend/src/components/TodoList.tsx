import React from 'react';
import { List, Pagination, Empty, Spin, Space, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTodoContext } from '../context/TodoContext';
import TodoCard from './TodoCard';

const { Title, Text } = Typography;

const TodoList: React.FC = () => {
    const { todos, loading, pagination, filters, setFilters } = useTodoContext();

    const handlePageChange = (page: number, pageSize: number) => {
        setFilters({ page, limit: pageSize });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && todos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" tip="Loading todos..." />
            </div>
        );
    }

    if (!loading && todos.length === 0) {
        return (
            <Empty
                image={<InboxOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                description={
                    <Space direction="vertical">
                        <Text strong style={{ fontSize: 16 }}>
                            No todos found
                        </Text>
                        <Text type="secondary">
                            {filters.search || filters.category_id || filters.priority || filters.completed !== undefined
                                ? 'Try adjusting your filters or create a new todo'
                                : 'Create your first todo to get started'}
                        </Text>
                    </Space>
                }
                style={{
                    padding: '60px 20px',
                    background: '#fff',
                    borderRadius: 8,
                }}
            />
        );
    }

    return (
        <div>
            {/* Stats */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                    Todos ({pagination.total})
                </Title>
                <Text type="secondary">
                    Page {pagination.current_page} of {pagination.total_pages}
                </Text>
            </div>

            {/* Todo Cards */}
            <Spin spinning={loading}>
                <List
                    dataSource={todos}
                    renderItem={(todo) => (
                        <List.Item key={todo.id} style={{ padding: 0, border: 'none' }}>
                            <TodoCard todo={todo} />
                        </List.Item>
                    )}
                />
            </Spin>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                        current={pagination.current_page}
                        total={pagination.total}
                        pageSize={pagination.per_page}
                        onChange={handlePageChange}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} todos`}
                        pageSizeOptions={['5', '10', '20', '50']}
                    />
                </div>
            )}
        </div>
    );
};

export default TodoList;