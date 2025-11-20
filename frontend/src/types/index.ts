// Category type
export interface Category {
    id: number;
    name: string;
    color: string;
    created_at: string;
    updated_at: string;
}

// Todo type
export interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    category_id: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
}

// Pagination type
export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

// API Response type
export interface TodosResponse {
    data: Todo[];
    pagination: Pagination;
}

// Todo filters
export interface TodoFilters {
    search?: string;
    category_id?: number;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}

// Form values
export interface TodoFormValues {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    category_id?: number;
    due_date?: string;
}

export interface CategoryFormValues {
    name: string;
    color: string;
}