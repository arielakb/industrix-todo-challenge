import React from 'react';
import { Layout, Typography } from 'antd';
import TodoList from './TodoList';
import FilterBar from './FilterBar';
import CategoryManager from './CategoryManager';

const { Header, Content } = Layout;
const { Title } = Typography;

const TodoApp: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Title level={3} style={{ margin: 0, color: '#3B82F6' }}>
                    📝 Industrix Todo App
                </Title>
                <CategoryManager />
            </Header>

            <Content style={{ padding: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <FilterBar />
                <TodoList />
            </Content>
        </Layout>
    );
};

export default TodoApp;