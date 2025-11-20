const { Todo, Category } = require('../../models');
const todoController = require('../../src/controllers/todoController');

// Mock the models
jest.mock('../../models');

describe('Todo Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {},
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('getAllTodos', () => {
        it('should return todos with pagination', async () => {
            const mockTodos = [
                {
                    id: 1,
                    title: 'Test Todo',
                    completed: false,
                    category: { id: 1, name: 'Work' },
                },
            ];

            Todo.findAndCountAll = jest.fn().mockResolvedValue({
                count: 1,
                rows: mockTodos,
            });

            await todoController.getAllTodos(req, res);

            expect(Todo.findAndCountAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                data: mockTodos,
                pagination: {
                    current_page: 1,
                    per_page: 10,
                    total: 1,
                    total_pages: 1,
                },
            });
        });

        it('should handle search filter', async () => {
            req.query.search = 'test';

            Todo.findAndCountAll = jest.fn().mockResolvedValue({
                count: 0,
                rows: [],
            });

            await todoController.getAllTodos(req, res);

            expect(Todo.findAndCountAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        title: expect.any(Object),
                    }),
                })
            );
        });

        it('should handle errors', async () => {
            Todo.findAndCountAll = jest.fn().mockRejectedValue(new Error('Database error'));

            await todoController.getAllTodos(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Failed to fetch todos',
                })
            );
        });
    });

    describe('createTodo', () => {
        it('should create a new todo', async () => {
            req.body = {
                title: 'New Todo',
                description: 'Test description',
                priority: 'high',
                category_id: 1,
            };

            const mockTodo = { id: 1, ...req.body };
            Category.findByPk = jest.fn().mockResolvedValue({ id: 1, name: 'Work' });
            Todo.create = jest.fn().mockResolvedValue(mockTodo);
            Todo.findByPk = jest.fn().mockResolvedValue(mockTodo);

            await todoController.createTodo(req, res);

            expect(Todo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'New Todo',
                    priority: 'high',
                })
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockTodo);
        });

        it('should return 400 if title is empty', async () => {
            req.body = { title: '' };

            await todoController.createTodo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Title is required',
                })
            );
        });

        it('should return 400 if category does not exist', async () => {
            req.body = {
                title: 'Test',
                category_id: 999,
            };

            Category.findByPk = jest.fn().mockResolvedValue(null);

            await todoController.createTodo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Category not found',
                })
            );
        });
    });

    describe('updateTodo', () => {
        it('should update an existing todo', async () => {
            req.params.id = '1';
            req.body = { title: 'Updated Title' };

            const mockTodo = {
                id: 1,
                title: 'Old Title',
                save: jest.fn(),
            };

            Todo.findByPk = jest.fn().mockResolvedValue(mockTodo);

            await todoController.updateTodo(req, res);

            expect(mockTodo.title).toBe('Updated Title');
            expect(mockTodo.save).toHaveBeenCalled();
        });

        it('should return 404 if todo not found', async () => {
            req.params.id = '999';
            req.body = { title: 'Test' };

            Todo.findByPk = jest.fn().mockResolvedValue(null);

            await todoController.updateTodo(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Todo not found',
                })
            );
        });
    });

    describe('deleteTodo', () => {
        it('should delete a todo', async () => {
            req.params.id = '1';

            const mockTodo = {
                id: 1,
                destroy: jest.fn(),
            };

            Todo.findByPk = jest.fn().mockResolvedValue(mockTodo);

            await todoController.deleteTodo(req, res);

            expect(mockTodo.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Todo deleted successfully',
                })
            );
        });
    });

    describe('toggleComplete', () => {
        it('should toggle todo completion status', async () => {
            req.params.id = '1';

            const mockTodo = {
                id: 1,
                completed: false,
                save: jest.fn(),
            };

            Todo.findByPk = jest.fn().mockResolvedValue(mockTodo);

            await todoController.toggleComplete(req, res);

            expect(mockTodo.completed).toBe(true);
            expect(mockTodo.save).toHaveBeenCalled();
        });
    });
});