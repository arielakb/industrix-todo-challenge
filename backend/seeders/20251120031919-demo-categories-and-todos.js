'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert categories
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Work',
        color: '#3B82F6',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Personal',
        color: '#10B981',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Shopping',
        color: '#F59E0B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Health',
        color: '#EF4444',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Insert todos
    await queryInterface.bulkInsert('todos', [
      {
        title: 'Complete coding challenge',
        description: 'Build a full-stack todo application for Industrix',
        completed: false,
        priority: 'high',
        category_id: 1,
        due_date: new Date('2024-12-31'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Review React documentation',
        description: 'Go through React 18 new features and hooks',
        completed: false,
        priority: 'medium',
        category_id: 1,
        due_date: new Date('2024-12-25'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, vegetables',
        completed: false,
        priority: 'low',
        category_id: 3,
        due_date: new Date('2024-12-20'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Gym workout',
        description: 'Chest and triceps day',
        completed: true,
        priority: 'medium',
        category_id: 4,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Call dentist',
        description: 'Schedule annual checkup',
        completed: false,
        priority: 'high',
        category_id: 4,
        due_date: new Date('2024-12-22'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Read book chapter',
        description: 'Finish chapter 5 of Clean Code',
        completed: true,
        priority: 'low',
        category_id: 2,
        due_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Prepare presentation',
        description: 'Q4 project review slides',
        completed: false,
        priority: 'high',
        category_id: 1,
        due_date: new Date('2024-12-28'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Update portfolio website',
        description: 'Add new projects and skills',
        completed: false,
        priority: 'medium',
        category_id: 2,
        due_date: new Date('2024-12-30'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('todos', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};