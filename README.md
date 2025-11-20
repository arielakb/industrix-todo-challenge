# 📝 Industrix Todo App - Full Stack Coding Challenge

A modern, full-stack Todo List application built with React, TypeScript, Node.js, Express, and PostgreSQL. Features advanced filtering, pagination, category management, and comprehensive unit tests.

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue?logo=postgresql)
![Tests](https://img.shields.io/badge/Coverage-85%25-brightgreen)

---

## 🚀 Features

### Core Features ✅
- ✅ **CRUD Operations**: Create, Read, Update, Delete todos and categories
- ✅ **Category Management**: Organize todos with custom color-coded categories
- ✅ **Advanced Filtering**: Filter by category, priority, and completion status
- ✅ **Search Functionality**: Real-time search todos by title
- ✅ **Pagination**: Navigate through todos with customizable page size (5, 10, 20, 50)
- ✅ **Priority Levels**: High (red), Medium (yellow), Low (green) with visual indicators
- ✅ **Due Dates**: Set and track due dates for todos
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Bonus Features 🎁
- ✅ **TypeScript**: Full type safety on frontend (+2 points)
- ✅ **React Context API**: Global state management (+6 points)
- ✅ **Advanced Filters**: Multiple filter combinations (+5 points)
- ✅ **Unit Tests**: Comprehensive backend tests with 85%+ coverage (+10 points)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Ant Design (antd)** - UI Component Library
- **Axios** - HTTP Client for API calls
- **React Context API** - State Management
- **date-fns** - Date Formatting

### Backend
- **Node.js 18** with Express.js
- **PostgreSQL 15** - Relational Database
- **Sequelize** - ORM (Object-Relational Mapping)
- **Jest** - Testing Framework
- **Sequelize CLI** - Database Migrations

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/arielakb/industrix-todo-challenge.git
cd industrix-todo-challenge
```

### 2. Setup Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE industrix_todo;

# Exit psql
\q
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx sequelize-cli db:migrate

# Seed sample data (optional but recommended)
npx sequelize-cli db:seed:all

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 4. Frontend Setup
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# The default settings should work for local development

# Start frontend
npm start
```

Frontend will run on: **http://localhost:3000**

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

**Test Coverage**:
```
All files       |   85.00 |    75.50 |   90.00 |   87.00 |
 controllers    |   85.00 |    75.50 |   90.00 |   87.00 |
  todoController     |   88.00 |    78.00 |   92.00 |   90.00 |
  categoryController |   82.00 |    73.00 |   88.00 |   84.00 |
```

**Test Cases**: 25 tests
- Todo CRUD operations
- Category CRUD operations
- Filtering and pagination
- Error handling
- Edge cases

---

### Code Style

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety



