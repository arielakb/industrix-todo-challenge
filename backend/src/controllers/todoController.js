const { Todo, Category } = require('../../models');
const { Op } = require('sequelize');

// Get all todos with pagination, search, and filters
exports.getAllTodos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            sort_by = 'created_at',
            sort_order = 'DESC',
            completed,
            category_id,
            priority
        } = req.query;

        const offset = (page - 1) * limit;

        // Build where clause
        const where = {};

        // Search by title
        if (search) {
            where.title = {
                [Op.iLike]: `%${search}%`
            };
        }

        // Filter by completed status
        if (completed !== undefined) {
            where.completed = completed === 'true';
        }

        // Filter by category
        if (category_id) {
            where.category_id = category_id;
        }

        // Filter by priority
        if (priority) {
            where.priority = priority;
        }

        // Query with pagination
        const { count, rows } = await Todo.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sort_by, sort_order.toUpperCase()]],
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'color']
            }]
        });

        const total_pages = Math.ceil(count / limit);

        res.json({
            data: rows,
            pagination: {
                current_page: parseInt(page),
                per_page: parseInt(limit),
                total: count,
                total_pages
            }
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({
            error: 'Failed to fetch todos',
            message: error.message
        });
    }
};

// Get single todo
exports.getTodoById = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'color']
            }]
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({
            error: 'Failed to fetch todo',
            message: error.message
        });
    }
};

// Create new todo
exports.createTodo = async (req, res) => {
    try {
        const { title, description, priority, due_date, category_id } = req.body;

        // Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Check if category exists (if provided)
        if (category_id) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(400).json({ error: 'Category not found' });
            }
        }

        const todo = await Todo.create({
            title: title.trim(),
            description: description?.trim() || null,
            priority: priority || 'medium',
            due_date: due_date || null,
            category_id: category_id || null,
            completed: false
        });

        // Fetch with category
        const createdTodo = await Todo.findByPk(todo.id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'color']
            }]
        });

        res.status(201).json(createdTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({
            error: 'Failed to create todo',
            message: error.message
        });
    }
};

// Update todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, due_date, category_id, completed } = req.body;

        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Validation
        if (title !== undefined && title.trim() === '') {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }

        // Check if category exists (if provided)
        if (category_id) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(400).json({ error: 'Category not found' });
            }
        }

        // Update fields
        if (title !== undefined) todo.title = title.trim();
        if (description !== undefined) todo.description = description?.trim() || null;
        if (priority !== undefined) todo.priority = priority;
        if (due_date !== undefined) todo.due_date = due_date;
        if (category_id !== undefined) todo.category_id = category_id;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();

        // Fetch updated todo with category
        const updatedTodo = await Todo.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'color']
            }]
        });

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({
            error: 'Failed to update todo',
            message: error.message
        });
    }
};

// Toggle completion status
exports.toggleComplete = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.completed = !todo.completed;
        await todo.save();

        // Fetch updated todo with category
        const updatedTodo = await Todo.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'color']
            }]
        });

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error toggling todo:', error);
        res.status(500).json({
            error: 'Failed to toggle todo',
            message: error.message
        });
    }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await todo.destroy();

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({
            error: 'Failed to delete todo',
            message: error.message
        });
    }
};