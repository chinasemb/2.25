import * as Koa from 'koa';
import * as Nunjucks from 'nunjucks';
import * as KoaStaticCache from 'koa-static-cache';
// import './models';
import * as KoaBodyParser from 'koa-bodyparser'; 
import * as KoaSession from 'koa-session';
import { useControllers} from 'koa-controllers';
import UserModel from './models/user';
import * as KoaMulter from 'koa-multer';
import * as Mime from 'mime';
import * as url from 'url';
import * as querystring from 'querystring';



const app = new Koa() ;
//访问的 url 中以 /public 开始的,那么都代理(映射)到 static 目录中


//接收2个参数: 第一个可以不填  ,配置:包括HttpOnly,maxAge   .    第二个参数: app
app.keys = ['skt']
app.use( KoaSession({},app) )

//设置上传文件的存储引擎
//- diskStorage : 设置硬盘式存储引擎,不是数据库啊内存啊这种(memoryStorage)
const storage = KoaMulter.diskStorage({
    //destination: 设置存储目录
    // destination: process.cwd() + '/static/uploads/avatar',
    destination(req, file, cb) {
        /* 
            前端上传的同时通过querystring 传递过来一个type值,type值表示上传文件的类型,默认是avatar ,也可以是 和目录相关的cookbooks
            注意:  当前的req , 是原生的(node request)
        */
        
        let query:any = {}
        let type = 'avatar'
        let queryString = url.parse(req.url).query
        if (queryString) {
            query = querystring.parse(queryString)
        }
        switch (query.type) {
            case 'cookbooks':
                type = 'cookbooks'
                break;
        }
        console.log(type);
        
        cb(null, process.cwd() + '/static/uploads/' + type)
    },
    filename(req,file,cb) {
        //file: 存储的是上传以前的文件信息
        //通过调用cb 来手动设置当前文件的名称,
        //当有错误的时候,第一个参数是错误信息,自动捕获
        //第二个参数,就是存储的文件名称
        // console.log(file);
        // console.log(Mime.getExtension(file.mimetype));
        //通过 Mime.getExtension 方法获取到上传文件的类型,然后进行存储
        let filename = Date.now() + '_' + (Math.random() + '').substring(2)
        cb(null, filename + '.' + Mime.getExtension(file.mimetype));
    }
});

app.use(KoaStaticCache('./static',{
    gzip: true,
    prefix: '/public',
    //设置静态文件访问每次都从文件(硬盘) 中读取,有利于开发调试,不过在代码上线以后,可以设置成非动态读取,那么程序运行的时候就会主动的把静态文件内容预加载进内存,访问的时候,就直接从内存中读取,提高性能.
    dynamic:true
}))

//处理bodyParser : 
app.use( KoaBodyParser() )
app.use(KoaBodyParser({
    formLimit: "13mb",
    jsonLimit: "3mb",
    textLimit: "3mb",
    enableTypes: ['json', 'form', 'text']
}));

app.use( async (ctx,next)=>{

    //根据当前的cookie来获取用户的详细信息
    ctx.state.user = {};
    if (ctx.session.id) {
        //当前访问的用户是登录的,则获取当前用户的详细信息.
        ctx.state.user = await UserModel.findById(ctx.session.id);

        if (!ctx.state.user.avatar) {
            ctx.state.user.avatar = 'mt.jpg';
        }

    }


    //在 ctx 对象下挂载一个template属性,用于存放模版引擎

    //创建模版引擎实例对象
    ctx.template = new Nunjucks.Environment(

        //__dirname : 当前这个文件所在的绝对路径,
        //process.cwd() :  当前运行该文件的命令(node ,supervisor  ) 所在的目录


        new Nunjucks.FileSystemLoader( process.cwd() + '/views/' )
    )
    
    await next()
} )

useControllers(app, __dirname + '/controllers/**/*.js', {
    // loa-controllers 框架内置了 koa-multer
    multipart: {
        //设置上传的目录
        dest: process.cwd() + '/static/uploads/avatar',
        //设置功能更加强大的存储配置
        storage
    }
});


app.listen(7777);