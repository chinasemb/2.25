"use strict";
// 1连接数据库  - 通过Sequelize 类对象来完成对数据库的连接
// 2因为sequelize 是js的,同时也没有提供d.ts 的类型声明文件,所以需要单独配置 `npm i -D @types/sequelize`
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize"); //导出来的是可以用的具体的类
const configs = require("../../config/config.json");
// console.log(configs);
// 根据当前环境变量来动态加载对应的config
// nodejs: process.env  :  获取环境变量的值,NODE_ENV 这个名字的环境变量 'NODE_ENV'并不是固定的,只是习惯用它来表示环境变量的名称,用来当前所在的模式
const env = process.env.NODE_ENV || 'development';
const config = configs[env];
// console.log(config);
//连接数据库
exports.default = new Sequelize(config.database, config.password, config.username, config);
/* 创建模型对象
      define 方法需要传入两个泛型
          第一个参数  Instance<{}> : 决定了通过CategoryModel 操作的数据是一个Model 的Instance 对象,这样的话,才能调用类似 get ,set等方法,Instance<{}> 中的{}决定了get和set能传入的字段名称
          第二个参数   第二个泛型决定了define 可以定义的名称和字段
*/
