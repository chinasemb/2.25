"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserAuth {
    async middleware(ctx, next) {
        //判断当前用户是否登录
        if (ctx.session.id) {
            await next();
        }
        else {
            //因为有的请求可以通过浏览器发送,有的通过Ajax调用
            //如果是页面请求,那么就跳转到登录页
            //如果是Ajax请求,返回一个Json格式的数据,告诉他你是没有权限访问的
            if (ctx.headers['x-requested-with'] === 'XMLHttpRequest') {
                ctx.body = {
                    code: 1,
                    message: '你还没有登录'
                };
            }
            else {
                ctx.redirect('/user/login');
            }
        }
    }
}
exports.default = UserAuth;
