"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const index_1 = require("./index");
exports.default = index_1.default.define("user", {
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
    //默认表的名称会是对应模型名称的复数形式  根据实际情况,当前应用表的名称和模型名称是一致的,所以这里可以单独的设置表名
    tableName: 'user'
});
