import axios from 'axios';
import { Todo, TodosResponse, Category, TodoFormValues, CategoryFormValues, TodoFilters } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== TODOS ====================

export const getTodos = async (filters?: TodoFilters): Promise<TodosResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.completed !== undefined) params.append('completed', filters.completed.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);

    const response = await api.get<TodosResponse>(`/todos?${params.toString()}`);
    return response.data;
};

export const getTodoById = async (id: number): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
};

export const createTodo = async (data: TodoFormValues): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
};

export const updateTodo = async (id: number, data: Partial<TodoFormValues>): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, data);
    return response.data;
};

export const toggleTodoComplete = async (id: number): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}/complete`);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
};

// ==================== CATEGORIES ====================

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const createCategory = async (data: CategoryFormValues): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: CategoryFormValues): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
};