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
const user_1 = require("../../models/user");
const profile_1 = require("../../models/profile");
const user_auth_1 = require("../../middlewares/user_auth");
/*
    把一个普通的类,装饰成控制器类

*/
let AdminUserIndexController = class AdminUserIndexController {
    async index(ctx) {
        // console.log("首页")
        // ctx.body = '首页'
        //页码从1开始计算
        let page = Number(ctx.query.page) || 1;
        //每页显示的记录条数 offset 永远是 limit的倍数   [1,2,3,4,5,6,7,8,9,10,11,12,13]  
        //  第一页: 1,2 --->  偏移量: (1-1)* 2  --->  0   ---> 第0页
        //  第二页: 3,4 --->  偏移量: (2-1)* 2  --->  2   ---> 第1页
        //  第三页: 5,6 --->  偏移量: (3-1)* 2  --->  4   ---> 第2页
        let limit = 2;
        let offset = (page - 1) * limit;
        //设置2个表之间的关联关系
        user_1.default.hasOne(profile_1.default);
        let users = await user_1.default.findAndCountAll({
            // attributes: ['id','username',]
            attributes: {
                exclude: ['password']
            },
            //每次返回2条数据
            limit,
            //数据的偏移值,默认为0,偏移值为几,就从实际个数减去几个个数,开始算起.
            offset,
            //
            include: [profile_1.default]
        });
        // console.log(categories);
        // let data = categories.map(category => {
        //   // category.get('')
        //   return {
        //     id: category.get('id'),
        //     name: category.get('name'),
        //     pid: category.get('pid')
        //   }
        // })
        // data = (new Tree(data)).getTree(0)
        // // console.log(data);
        users.rows = users.rows.map((user) => {
            return Object.assign(user, { avatar: user.avatar === '' ? 'mt.jpg' : user.avatar });
        });
        ctx.body = {
            code: 0,
            users,
            limit,
            page
        };
    }
    // @Get('/user')
    // public async user(){
    //   console.log("用户")
    // }
    async status(ctx) {
        /* 接收 name 和 pid
          增加一个中间件  bodyparser
          通过 ctx.request.body
          如果没传,可以给一个'',0.
        */
        let body = ctx.request.body;
        let id = Number(body.id);
        //先根据id 获取当前数据库中对应的用户
        let user = await user_1.default.findById(id);
        //如果没有该用户
        if (!user) {
            return ctx.body = {
                code: 1,
                message: "不存在该用户~~"
            };
        }
        user.set("disabled", !user.get('disabled'));
        await user.save();
        ctx.body = {
            code: 0,
            data: {
                id: user.get('id'),
                disabled: user.get('disabled')
            }
        };
    }
    /*
    用户个人中心基本资料  页面 */
    async profilea(ctx) {
        let profile = await profile_1.default.findOne({
            where: {
                userId: ctx.session.id
            }
        });
        // console.log(profile.toJSON());
        ctx.body = ctx.template.render('user/user_profile.html', {
            active: 'profile',
            user: ctx.state.user,
            profile: profile.toJSON()
        });
    }
    /*
      用户个人中心基本资料的修改
        //postProfile 接口 更新个人资料
      //它的逻辑过程和用户修改的逻辑很相似
    */
    async profile(ctx) {
        let body = ctx.request.body;
        let id = body.id;
        let mobile = body.mobile;
        let email = body.email;
        let realname = body.realname;
        let gender = body.gender;
        let year = body.year;
        let month = body.month;
        let date = body.date;
        let nickname = body.nickname;
        let birthday = body.birthday;
        // console.log(birthday);
        /*
          获取到当前用户的基本信息
        */
        /*
          要修改的用户不是当前登陆的用户的 个人信息
          是任意用户的个人信息,所以userId 不能是ctx.session.id了
          做法 : 前端 detail数据中加入要修改的用户的id : user.id 发送过来
          这时候后端的数据信息虽然变化了,但是前端没有更新个人信息
          把返回的修改 之后的数据 更新到 this.detail 里
        */
        let userProfile = await profile_1.default.findOne({
            where: {
                // userId: ctx.session.id
                userId: id
            }
        });
        /*
          如果用户传递过来了 mobile ,则修改
        */
        mobile && userProfile.set('mobile', mobile);
        email && userProfile.set('email', email);
        realname && userProfile.set('realname', realname);
        gender && userProfile.set('gender', gender);
        nickname && userProfile.set('nickname', nickname);
        birthday && userProfile.set('birthday', birthday);
        /*
          注意: 请求发送过来的是字符串信息,数据库中存储的是日期格式,所以我们需要把用户传递过来的日期字符串变成日期对象的形式
        */
        let d = new Date(userProfile.get('birthday'));
        year && d.setFullYear(year);
        month && d.setMonth(month - 1);
        date && d.setDate(date);
        userProfile.set('birthday', d.toString());
        await userProfile.save();
        ctx.body = {
            code: 0,
            data: userProfile
        };
    }
};
__decorate([
    koa_controllers_1.Get('/api/admin/user'),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserIndexController.prototype, "index", null);
__decorate([
    koa_controllers_1.Post('/api/admin/user/status'),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserIndexController.prototype, "status", null);
__decorate([
    koa_controllers_1.Get('/user/profile'),
    koa_controllers_1.Before(user_auth_1.default),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserIndexController.prototype, "profilea", null);
__decorate([
    koa_controllers_1.Post('/api/admin/user/profile'),
    koa_controllers_1.Before(user_auth_1.default),
    __param(0, koa_controllers_1.Ctx),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserIndexController.prototype, "profile", null);
AdminUserIndexController = __decorate([
    koa_controllers_1.Controller
], AdminUserIndexController);
exports.AdminUserIndexController = AdminUserIndexController;
