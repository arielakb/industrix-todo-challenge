import React, { useState } from 'react';
import { Card, Input, Select, Button, Space, Tag, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, PlusOutlined } from '@ant-design/icons';
import { useTodoContext } from '../context/TodoContext';
import TodoFormModal from './TodoFormModal';

const { Option } = Select;

const FilterBar: React.FC = () => {
    const { categories, filters, setFilters, resetFilters } = useTodoContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ search: e.target.value, page: 1 });
    };

    const handleCategoryChange = (value: number | undefined) => {
        setFilters({ category_id: value, page: 1 });
    };

    const handlePriorityChange = (value: 'low' | 'medium' | 'high' | undefined) => {
        setFilters({ priority: value, page: 1 });
    };

    const handleStatusChange = (value: boolean | undefined) => {
        setFilters({ completed: value, page: 1 });
    };

    const handleReset = () => {
        resetFilters();
    };

    const activeFiltersCount = [
        filters.search,
        filters.category_id,
        filters.priority,
        filters.completed !== undefined,
    ].filter(Boolean).length;

    return (
        <>
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    {/* Search Input */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Input
                            placeholder="Search todos by title..."
                            prefix={<SearchOutlined />}
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            allowClear
                            size="large"
                        />
                    </Col>

                    {/* Category Filter */}
                    <Col xs={12} sm={8} md={5} lg={4}>
                        <Select
                            placeholder="Category"
                            value={filters.category_id}
                            onChange={handleCategoryChange}
                            allowClear
                            style={{ width: '100%' }}
                            size="large"
                        >
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
                    </Col>

                    {/* Priority Filter */}
                    <Col xs={12} sm={8} md={5} lg={4}>
                        <Select
                            placeholder="Priority"
                            value={filters.priority}
                            onChange={handlePriorityChange}
                            allowClear
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Option value="high">
                                <Tag color="red">High</Tag>
                            </Option>
                            <Option value="medium">
                                <Tag color="orange">Medium</Tag>
                            </Option>
                            <Option value="low">
                                <Tag color="green">Low</Tag>
                            </Option>
                        </Select>
                    </Col>

                    {/* Status Filter */}
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Select
                            placeholder="Status"
                            value={filters.completed}
                            onChange={handleStatusChange}
                            allowClear
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Option value={false}>Active</Option>
                            <Option value={true}>Completed</Option>
                        </Select>
                    </Col>

                    {/* Action Buttons */}
                    <Col xs={12} sm={24} md={24} lg={4} style={{ textAlign: 'right' }}>
                        <Space>
                            {activeFiltersCount > 0 && (
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={handleReset}
                                    size="large"
                                >
                                    Reset {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                                </Button>
                            )}
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalOpen(true)}
                                size="large"
                            >
                                New Todo
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <Row style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <Space wrap>
                                <FilterOutlined /> Active Filters:
                                {filters.search && (
                                    <Tag closable onClose={() => setFilters({ search: undefined })}>
                                        Search: "{filters.search}"
                                    </Tag>
                                )}
                                {filters.category_id && (
                                    <Tag
                                        closable
                                        onClose={() => setFilters({ category_id: undefined })}
                                        color={categories.find((c) => c.id === filters.category_id)?.color}
                                    >
                                        {categories.find((c) => c.id === filters.category_id)?.name}
                                    </Tag>
                                )}
                                {filters.priority && (
                                    <Tag
                                        closable
                                        onClose={() => setFilters({ priority: undefined })}
                                        color={
                                            filters.priority === 'high'
                                                ? 'red'
                                                : filters.priority === 'medium'
                                                    ? 'orange'
                                                    : 'green'
                                        }
                                    >
                                        {filters.priority.toUpperCase()}
                                    </Tag>
                                )}
                                {filters.completed !== undefined && (
                                    <Tag closable onClose={() => setFilters({ completed: undefined })}>
                                        {filters.completed ? 'Completed' : 'Active'}
                                    </Tag>
                                )}
                            </Space>
                        </Col>
                    </Row>
                )}
            </Card>

            <TodoFormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="create"
            />
        </>
    );
};

export default FilterBar;