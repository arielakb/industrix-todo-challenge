import { format } from 'date-fns';

// Format date
export const formatDate = (date: string | null): string => {
    if (!date) return 'No due date';
    return format(new Date(date), 'MMM dd, yyyy');
};

// Get priority color
export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
        case 'high':
            return '#EF4444'; // Red
        case 'medium':
            return '#F59E0B'; // Yellow
        case 'low':
            return '#10B981'; // Green
        default:
            return '#6B7280'; // Gray
    }
};

// Get priority tag color for Ant Design
export const getPriorityTagColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
        case 'high':
            return 'red';
        case 'medium':
            return 'orange';
        case 'low':
            return 'green';
        default:
            return 'default';
    }
};

// Capitalize first letter
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};