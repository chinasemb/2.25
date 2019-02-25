"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_controllers_1 = require("koa-controllers");
const category_1 = require("../../models/category");
const Tree_1 = require("../../libs/Tree");
const Sequelize = require("sequelize");
/*
    把一个普通的类,装饰成控制器类

*/
let AdminCateGoryIndexController = class AdminCateGoryIndexController {
    async index(ctx) {
        // console.log("首页")
        // ctx.body = '首页'
        let categories = await category_1.default.findAll();
        // console.log(categories);
        let data = categories.map(category => {
            // category.get('')
            return {
                id: category.get('id'),
                name: category.get('name'),
                pid: category.get('pid')
            };
        });
        data = (new Tree_1.default(data)).getTree(0);
        // console.log(data);
        ctx.body = {
            code: 0,
            data
        };
    }
    // @Get('/user')
    // public async user(){
    //   console.log("用户")
    // }
    async add(ctx) {
        /* 接收 name 和 pid
          增加一个中间件  bodyparser
          通过 ctx.request.body
          如果没传,可以给一个'',0.
        */
        let body = ctx.request.body;
        let name = body.name || '';
        let pid = 0;
        if (!isNaN(Number(body.pid))) {
            pid = Number(body.pid);
        }
        ;
        //验证 
        // name 不能为空,
        if (name == '') {
            return ctx.body = {
                code: 1,
                message: '分类名称不能为空'
            };
        }
        ;
        let data = category_1.default.build({
            name, pid
        });
        await data.save();
        ctx.body = {
            code: 0,
            data: data
        };
    }
    //删除分类
    async remove(ctx) {
        /* 接收  id
          增加一个中间件  bodyparser
          通过 ctx.request.body
        */
        let body = ctx.request.body;
        let id = 0;
        if (!isNaN(Number(body.id))) {
            id = Number(body.id);
        }
        ;
        //根据你传过来的id 查找对应的记录
        let data = await category_1.default.findById(id);
        //删除单条数据
        // if (!data) {
        //   return ctx.body = {
        //     code: 2,
        //     message: '不存在该分类~~'
        //   }
        // }
        // //如果存在,删除
        // await data.destroy();
        //删除多条数据 : 那么是根据某个表操作,这个时候就要调用模型类下静态方法去完成.
        await category_1.default.destroy({
            where: {
                [Sequelize.Op.or]: [
                    { id: id },
                    { pid: id }
                ]
            }
        });
        ctx.body = {
            code: 0
        };
    }
    //修改分类
    async edit(ctx) {
        /* 接收 name 和 id
          增加一个中间件  bodyparser
          通过 ctx.request.body
          如果没传,可以给一个'',0.
        */
        let body = ctx.request.body;
        let name = body.name || '';
        let id = 0;
        if (!isNaN(Number(body.id))) {
            id = Number(body.id);
        }
        ;
        //验证 
        // name 不能为空,
        if (name == '') {
            return ctx.body = {
                code: 1,
                message: '分类名称不能为空'
            };
        }
        ;
        //根据你传过来的id 查找对应的记录
        let data = await category_1.default.findById(id);
        if (!data) {
            return ctx.body = {
                code: 2,
                message: '不存在该分类~~'
            };
        }
        //如果存在,修改并存储
        data.set('name', name);
        await data.save();
        ctx.body = {
            code: 0,
            data: data
        };
    }
};
__decorate([
    koa_controllers_1.Get('/api/admin/category'),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCateGoryIndexController.prototype, "index", null);
__decorate([
    koa_controllers_1.Post('/api/admin/category/add'),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCateGoryIndexController.prototype, "add", null);
__decorate([
    koa_controllers_1.Post('/api/admin/category/remove'),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCateGoryIndexController.prototype, "remove", null);
__decorate([
    koa_controllers_1.Post('/api/admin/category/edit'),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCateGoryIndexController.prototype, "edit", null);
AdminCateGoryIndexController = __decorate([
    koa_controllers_1.Controller
], AdminCateGoryIndexController);
exports.AdminCateGoryIndexController = AdminCateGoryIndexController;
