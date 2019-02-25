"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const index_1 = require("./index");
exports.default = index_1.default.define("category", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
    },
    pid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    }
}, {
    //默认表的名称会是对应模型名称的复数形式  根据实际情况,当前应用表的名称和模型名称是一致的,所以这里可以单独的设置表名
    tableName: 'category'
});
