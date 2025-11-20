import React from 'react';
import { ConfigProvider } from 'antd';
import { TodoProvider } from './context/TodoContext';
import TodoApp from './components/TodoApp';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3B82F6',
          borderRadius: 6,
        },
      }}
    >
      <TodoProvider>
        <TodoApp />
      </TodoProvider>
    </ConfigProvider>
  );
};

export default App;