'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('user', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          type: Sequelize.STRING(50),
          unique: true,
          allowNull: false,
          defaultValue: ''
        },
        password: {
          type: Sequelize.CHAR(32),
          allowNull: false,
          defaultValue: ''
        },
        disabled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdIpAt: {
          type: Sequelize.CHAR(15),
          allowNull: false,
          defaultValue: ''
        },
        updatedIpAt: {
          type: Sequelize.CHAR(15),
          allowNull: false,
          defaultValue: ''
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
    }, {
      tableName: 'user',
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        indexes: [{

        }]
    });
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.dropTable('user');
  }
};
