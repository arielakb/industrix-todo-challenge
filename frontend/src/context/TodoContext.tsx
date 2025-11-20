import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Todo, Category, TodoFilters, TodoFormValues, CategoryFormValues } from '../types';
import * as api from '../services/api';
import { message } from 'antd';

interface TodoContextType {
    // State
    todos: Todo[];
    categories: Category[];
    loading: boolean;
    filters: TodoFilters;
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };

    // Todo actions
    fetchTodos: () => Promise<void>;
    createTodo: (data: TodoFormValues) => Promise<void>;
    updateTodo: (id: number, data: Partial<TodoFormValues>) => Promise<void>;
    toggleTodoComplete: (id: number) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;

    // Category actions
    fetchCategories: () => Promise<void>;
    createCategory: (data: CategoryFormValues) => Promise<void>;
    updateCategory: (id: number, data: CategoryFormValues) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;

    // Filter actions
    setFilters: (filters: TodoFilters) => void;
    resetFilters: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodoContext = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodoContext must be used within TodoProvider');
    }
    return context;
};

interface TodoProviderProps {
    children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFiltersState] = useState<TodoFilters>({
        page: 1,
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'DESC',
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0,
    });

    // ==================== TODO ACTIONS ====================

    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.getTodos(filters);
            setTodos(response.data);
            setPagination(response.pagination);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to fetch categories');
        }
    }, []);

    const createTodo = useCallback(async (data: TodoFormValues) => {
        try {
            setLoading(true);
            await api.createTodo(data);
            message.success('Todo created successfully');
            await fetchTodos();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to create todo');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchTodos]);

    const updateTodo = useCallback(async (id: number, data: Partial<TodoFormValues>) => {
        try {
            setLoading(true);
            await api.updateTodo(id, data);
            message.success('Todo updated successfully');
            await fetchTodos();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to update todo');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchTodos]);

    const toggleTodoComplete = useCallback(async (id: number) => {
        try {
            await api.toggleTodoComplete(id);
            await fetchTodos();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to toggle todo');
        }
    }, [fetchTodos]);

    const deleteTodo = useCallback(async (id: number) => {
        try {
            setLoading(true);
            await api.deleteTodo(id);
            message.success('Todo deleted successfully');
            await fetchTodos();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to delete todo');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchTodos]);

    // ==================== CATEGORY ACTIONS ====================

    const createCategory = useCallback(async (data: CategoryFormValues) => {
        try {
            await api.createCategory(data);
            message.success('Category created successfully');
            await fetchCategories();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to create category');
            throw error;
        }
    }, [fetchCategories]);

    const updateCategory = useCallback(async (id: number, data: CategoryFormValues) => {
        try {
            await api.updateCategory(id, data);
            message.success('Category updated successfully');
            await fetchCategories();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to update category');
            throw error;
        }
    }, [fetchCategories]);

    const deleteCategory = useCallback(async (id: number) => {
        try {
            await api.deleteCategory(id);
            message.success('Category deleted successfully');
            await fetchCategories();
            await fetchTodos(); // Refresh todos after category deletion
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to delete category');
            throw error;
        }
    }, [fetchCategories, fetchTodos]);

    // ==================== FILTER ACTIONS ====================

    const setFilters = useCallback((newFilters: TodoFilters) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState({
            page: 1,
            limit: 10,
            sort_by: 'created_at',
            sort_order: 'DESC',
        });
    }, []);

    // ==================== EFFECTS ====================

    // Fetch todos when filters change
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const value: TodoContextType = {
        todos,
        categories,
        loading,
        filters,
        pagination,
        fetchTodos,
        createTodo,
        updateTodo,
        toggleTodoComplete,
        deleteTodo,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        setFilters,
        resetFilters,
    };

    return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};