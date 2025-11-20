const { Category, Todo, sequelize } = require('../../models');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']],
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM todos WHERE todos.category_id = "Category".id)'),
                        'todo_count'
                    ]
                ]
            }
        });

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            error: 'Failed to fetch categories',
            message: error.message
        });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;

        // Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Category name is required' });
        }

        // Check for duplicate
        const existing = await Category.findOne({ where: { name: name.trim() } });
        if (existing) {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }

        const category = await Category.create({
            name: name.trim(),
            color: color || '#3B82F6'
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            error: 'Failed to create category',
            message: error.message
        });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Validation
        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ error: 'Category name cannot be empty' });
        }

        // Check for duplicate name
        if (name && name !== category.name) {
            const existing = await Category.findOne({ where: { name: name.trim() } });
            if (existing) {
                return res.status(400).json({ error: 'Category with this name already exists' });
            }
        }

        if (name !== undefined) category.name = name.trim();
        if (color !== undefined) category.color = color;

        await category.save();

        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            error: 'Failed to update category',
            message: error.message
        });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if category has todos
        const todoCount = await Todo.count({ where: { category_id: id } });
        if (todoCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete category with existing todos',
                todo_count: todoCount
            });
        }

        await category.destroy();

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            error: 'Failed to delete category',
            message: error.message
        });
    }
};