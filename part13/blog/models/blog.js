const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: { model: 'users', key: 'id' },
    // }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

module.exports = Blog