'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Todo, {
                foreignKey: 'category_id',
                as: 'todos'
            });
        }
    }

    Category.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '#3B82F6',
            validate: {
                is: /^#[0-9A-F]{6}$/i
            }
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        underscored: true,
        timestamps: true
    });

    return Category;
};