const { Category, Todo, sequelize } = require('../../models');
const categoryController = require('../../src/controllers/categoryController');

jest.mock('../../models');

describe('Category Controller', () => {
    let req, res;
    let consoleErrorSpy;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('getAllCategories', () => {
        it('should return all categories', async () => {
            const mockCategories = [
                { id: 1, name: 'Work', color: '#3B82F6' },
                { id: 2, name: 'Personal', color: '#10B981' },
            ];

            Category.findAll = jest.fn().mockResolvedValue(mockCategories);

            await categoryController.getAllCategories(req, res);

            expect(Category.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockCategories);
        });

        it('should handle errors', async () => {
            Category.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

            await categoryController.getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Failed to fetch categories',
                })
            );
        });
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            req.body = {
                name: 'Work',
                color: '#3B82F6',
            };

            const mockCategory = { id: 1, ...req.body };
            Category.findOne = jest.fn().mockResolvedValue(null);
            Category.create = jest.fn().mockResolvedValue(mockCategory);

            await categoryController.createCategory(req, res);

            expect(Category.create).toHaveBeenCalledWith({
                name: 'Work',
                color: '#3B82F6',
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        it('should return 400 if name is empty', async () => {
            req.body = { name: '' };

            await categoryController.createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category name is required',
                })
            );
        });

        it('should return 400 if category name already exists', async () => {
            req.body = { name: 'Work' };

            Category.findOne = jest.fn().mockResolvedValue({ id: 1, name: 'Work' });

            await categoryController.createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category with this name already exists',
                })
            );
        });

        it('should handle errors', async () => {
            req.body = { name: 'Work' };

            Category.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

            await categoryController.createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateCategory', () => {
        it('should update a category', async () => {
            req.params.id = '1';
            req.body = { name: 'Work Updated', color: '#FF0000' };

            const mockCategory = {
                id: 1,
                name: 'Work',
                color: '#3B82F6',
                save: jest.fn(),
            };

            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);
            Category.findOne = jest.fn().mockResolvedValue(null);

            await categoryController.updateCategory(req, res);

            expect(mockCategory.name).toBe('Work Updated');
            expect(mockCategory.color).toBe('#FF0000');
            expect(mockCategory.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        it('should return 404 if category not found', async () => {
            req.params.id = '999';
            req.body = { name: 'Test' };

            Category.findByPk = jest.fn().mockResolvedValue(null);

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category not found',
                })
            );
        });

        it('should return 400 if name is empty', async () => {
            req.params.id = '1';
            req.body = { name: '' };

            const mockCategory = { id: 1, name: 'Work' };
            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category name cannot be empty',
                })
            );
        });

        it('should return 400 if duplicate name', async () => {
            req.params.id = '1';
            req.body = { name: 'Personal' };

            const mockCategory = { id: 1, name: 'Work' };
            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);
            Category.findOne = jest.fn().mockResolvedValue({ id: 2, name: 'Personal' });

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category with this name already exists',
                })
            );
        });

        it('should handle errors', async () => {
            req.params.id = '1';
            req.body = { name: 'Work' };

            Category.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteCategory', () => {
        it('should delete category if no todos exist', async () => {
            req.params.id = '1';

            const mockCategory = {
                id: 1,
                destroy: jest.fn(),
            };

            Category.findByPk = jest.fn().mockResolvedValue(mockCategory);
            Todo.count = jest.fn().mockResolvedValue(0);

            await categoryController.deleteCategory(req, res);

            expect(mockCategory.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Category deleted successfully',
                })
            );
        });

        it('should return 400 if category has todos', async () => {
            req.params.id = '1';

            Category.findByPk = jest.fn().mockResolvedValue({ id: 1 });
            Todo.count = jest.fn().mockResolvedValue(5);

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Cannot delete category with existing todos',
                    todo_count: 5,
                })
            );
        });

        it('should return 404 if category not found', async () => {
            req.params.id = '999';

            Category.findByPk = jest.fn().mockResolvedValue(null);

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category not found',
                })
            );
        });

        it('should handle errors', async () => {
            req.params.id = '1';

            Category.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});