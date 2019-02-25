'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cookbook', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      covers: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '成品图片'
      },
      description: {
        type: Sequelize.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comments: '介绍'
      },
      craft: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '工艺'
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '难度'
      },
      taste: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '口味'
      },
      needTime: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '耗时'
      },
      cookers: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '厨具'
      },
      ingredients: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '原料'
      },
      steps: {
        type: Sequelize.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comments: '步骤'
      },
      tips: {
        type: Sequelize.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comments: '小窍门'
      },
      favoriteCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comments: '收藏数量'
      },
      commentCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comments: '评论数量'
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: 0
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }, {
      tableName: 'cookbook',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cookbook');
  }
};