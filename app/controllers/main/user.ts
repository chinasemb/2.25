import { Get, Post, Ctx, Controller, Before, RequestParam, MultipartFile } from 'koa-controllers';
import { Context, } from 'koa';
import Usermodel from '../../models/user';
import ProfileModel from '../../models/profile';
import CookbookModel from '../../models/cookbook';
import CategoryModel from '../../models/category';
import * as md5 from 'md5';
import UserAuth from '../../middlewares/user_auth';
import Tree from '../../libs/Tree';


@Controller
export class MainUserController {

  //渲染一个注册页面给用户
  @Get('/user/register')
  public register(@Ctx ctx: Context) {

    ctx.body = ctx.template.render('user/register.html')

  }

  ////向客户端发送一个cookie请求,把用户登录状态的cookie 设置为Null
  @Get('/user/logout')
  public logout(@Ctx ctx: Context) {
    ctx.session = null;
    //退出成功以后,重定向到另外一个地址
    //我们希望,从哪个页面退出的,退出后返回到来源页面
    //http-header: referer,来源页面url
    if (ctx.req.headers.referer) {
      ctx.redirect(ctx.req.headers.referer);
    } else {
      ctx.redirect('/');
    }
  }

  //用户个人中心首页
  @Get('/user')
  @Before(UserAuth)
  /**
   * index
  @Ctx ctx: Context    */
  public index(@Ctx ctx: Context) {
    ctx.body = ctx.template.render('user/user_index.html', {
      active: 'index',
      user: ctx.state.user
    })
  }





  @Post('/user/register')
  public async postRegister(@Ctx ctx: Context) {
    let body: any = ctx.request.body;
    let username = body.username || '';
    let password = body.password || '';
    let repassword = body.repassword || '';

    // console.log(username, password, repassword);

    if (username.trim() === '' || password.trim() === '') {
      return ctx.body = {
        code: 1,
        message: '用户名或密码不能为空'
      }
    }

    if (password !== repassword) {
      return ctx.body = {
        code: 1,
        message: '两次输入的密码不一致'
      }
    }

    //验证用户名是否被注册了,这个时候需要查询数据库,查看数据库中是否有username相同的数据存在,

    let user = await Usermodel.findOne({
      where: {
        username
      }
    })

    if (user) {
      return ctx.body = {
        code: 3,
        message: '用户名已注册'
      }
    }

    user = Usermodel.build({
      username,
      password: md5(password),
      //这个ip 一旦被注册永远就不会再改变了
      createdIpAt: ctx.ip,
      //每次登陆 都会更新的ip
      updatedIpAt: ctx.ip
    })

    // console.log(user);


    //通过以上所有的验证信息,就可以把用户注册信息保存到数据库了
    await user.save();


    ctx.body = {
      code: 0,
      message: '注册成功~~~~~~~~~~~~~~~~~~'
    }
  };


  //渲染一个登录的页面给用户
  @Get('/user/login')
  public login(@Ctx ctx: Context) {
    ctx.body = ctx.template.render('user/login.html');
  }


  //验证用户登录信息
  @Post('/user/login')
  public async postLogin(@Ctx ctx: Context) {

    //接收传递过来的username ,password 
    let body: any = ctx.request.body;
    let username = body.username || '';
    let password = body.password || '';
    let rememberPass = body.rememberPass;

    if (username.trim() === '' || password.trim() === '') {
      return ctx.body = {
        code: 1,
        message: '用户名或者密码不能为空'
      }
    }

    //验证数据库中是否存在该用户,并且密码是正确的.
    let user = await Usermodel.findOne({
      where: { username }
    })

    //登录时候发送的密码是明文的,但是数据库中的密码是 加密过的,我们需要把登录传过来的密码进行加密,和数据库中的加密密码比较,
    if (!user || md5(password) !== user.get('password')) {
      return ctx.body = {
        code: 2,
        message: '用户不存在或密码错误~~'
      }
    }

    //当前用户是否是禁用的状态
    if (user.get('disabled')) {
      return ctx.body = {
        code: 3,
        message: '该用户已经被禁用了~~'
      }
    }


    //当用户成功登录以后,把能够标识用户身份信息的值通过cookie/session发送给用户(浏览器)
    //默认情况下,cookie 是会话结束(浏览器关闭)自动销毁,如果我们想保持cookie长期存在,则需要设置cookie 的mgAge,毫秒为单位
    if (rememberPass) {
      ctx.session.maxAge = 1000 * 60 * 60 * 24 * 10;
    }
    ctx.session.id = user.get('id');

    return ctx.body = {
      code: 0,
      message: '登录成功了~~'
    }
  }

  //上传头像
  @Post('/user/avatar')
  @Before(UserAuth)
  /**
   * postAvatar
   * RequestParam:  自动帮助我们取得当前提交过来的数据的  叫avatar key值 
   *                解析请求中的 提交数据,把参数中的key ,提取出来赋值给后面的变量
   *                file: true 表示提取的数据是一个文件,(二进制)
   */
  public async postAvatar(@RequestParam('avatar', { file: true }) avatar: MultipartFile, @Ctx ctx: Context) {

    //avatar 存储的是上传成功以后的文件信息
    // console.log(avatar);
    let user = await Usermodel.findById(ctx.session.id);

    user.set('avatar', avatar.filename);
    await user.save();

    ctx.body = {
      code: 0,
      data: {
        url: avatar.filename
      }
    }
  }



  /* 
  个人中心基本资料修改 */
  @Post('/user/profile')
  @Before(UserAuth)
  public async profilePost(@Ctx ctx: Context) {
    let body: any = ctx.request.body
    /* 
      因为只有用户传递过来数据我们才会去修改它,空值不修改,去掉 `|| ''`
    */
    let nickname = body.nickname 
    let email = body.email 
    let realname = body.realname 
    let mobile = body.mobile 
    let gender = body.gender
    let year = body.year
    let month = body.month
    let date = body.date

    /* 
      获取到当前用户的基本信息对象

    */

    let userProfile = await ProfileModel.findOne({
      where: {
        userId: ctx.session.id
      }
    })

    /* 
      如果当前用户有传  mobile 就调用userProfile 下的 set 方法

    */

    mobile && userProfile.set('mobile', mobile)
    nickname && userProfile.set('nickname', nickname)
    email && userProfile.set('email', email)
    realname && userProfile.set('realname', realname)
    gender && userProfile.set('gender', gender)
    /* 
      请求发送过来的 年月日是字符串信息,数据库中存储的是日期格式的,所以我们需要
      把用户传递过来的日期字符串修改成日期对象
    */
    
    let d  = new Date( userProfile.get('birthday') )
    year && d.setFullYear(year);
    month && d.setMonth(month -1);
    date && d.setDate(date);
    userProfile.set('birthday', d.toJSON())

    await userProfile.save()

    console.log(1);
    
   /*  ctx.body = {
      code: 0,
      data: userProfile
    } */

    ctx.body = ctx.template.render('user/user_profile.html', {
      code: 0,
      profile: userProfile,
      
    })


  }


  //用户个人中心页面展示
  @Get('/user/profile')
  @Before(UserAuth)
  public async profile(@Ctx ctx: Context) {


    let userProfile = await ProfileModel.findOne({
      where: {
        userId: ctx.session.id
      }
    })

    ctx.body = ctx.template.render('user/user_profile.html', {
      user: ctx.state.user,
      profile: userProfile.toJSON(),
      active: 'profile'
    })







  }


  //我的菜谱页面

  /* 
    排序   :   多种组合式排序,  根据时间,根据日期,根据^^
              根据添加的时间进行排序
  */
  @Get('/user/cookbook')
  @Before(UserAuth)
  public async cookbook(@Ctx ctx: Context) {
    
    let rs = await CookbookModel.findAndCountAll({
      where: {
        userId: ctx.session.id
      },
      order: [['createdAt','DESC']]
    })

    // console.log(rs.count);
    // console.log(rs.rows);
    
    

    ctx.body = ctx.template.render('user/user_cookbook.html', {
      user: ctx.state.user,
      active: 'cookbook',
      rs
    })

  }


  /* 
    发布新菜谱页面

  */

  @Get('/user/publish')
  @Before(UserAuth)
  public async publish(@Ctx ctx: Context){

    /* 
      获取到所有的分类
    */
    let categories = await CategoryModel.findAll();
    // console.log(categories);

    let data = categories.map(category => {
      // category.get('')
      return {
        id: category.get('id'),
        name: category.get('name'),
        pid: category.get('pid')
      }
    })

    categories = (new Tree(data)).getTree(0) 

    ctx.body = ctx.template.render('user/user_publish.html',{
      user: ctx.state.user,
      active: 'cookbook',
      categories
    })
  }

  /* 
    发布新菜谱接口
  */  

  @Post('/user/publish')
  @Before(UserAuth)
  public async postPublish(@Ctx ctx: Context){
    let body: any = ctx.request.body

    console.log(body);
    
    let name = body.name || ''
    let categoryId = body.categoryId || 0
    let covers = body.covers || []
    let description = body.description || ''
    let craft = body.craft || ''
    let level = body.level || ''
    let needTime = body.needTime || ''
    let cookers = body.cookers || []
    let ingredients = body.ingredients || {m:{}, s: {}}
    let steps = body.steps || []
    let tips = body.tips || ''

    if (!name) {
      return ctx.body = {
        code: 1,
        message: '菜谱名称不能为空'
      }
    }

    let cookbook = CookbookModel.build({
      name,
      userId: ctx.session.id,
      categoryId,
      covers: JSON.stringify(covers),
      description,
      craft,
      level,
      needTime,
      ingredients: JSON.stringify(ingredients),
      cookers: JSON.stringify(cookers),
      steps: JSON.stringify(steps),
      tips
    })


    await cookbook.save()

    ctx.body = {
      code: 0,
      data: cookbook
    }


  }

  /* 
    上传成品图
  
  */
  @Post('/user/publish/cover')
  @Before(UserAuth)
  /**
   * postAvatar
   * RequestParam:  自动帮助我们取得当前提交过来的数据的  叫avatar key值 
   *                解析请求中的 提交数据,把参数中的key ,提取出来赋值给后面的变量
   *                file: true 表示提取的数据是一个文件,(二进制)
   */
  public async postPublishCover(@RequestParam('cover', { file: true }) cover: MultipartFile, @Ctx ctx: Context) {

    //avatar 存储的是上传成功以后的文件信息
    // console.log(cover);
    /* let user = await Usermodel.findById(ctx.session.id);

    user.set('avatar', avatar.filename);
    await user.save(); */

    ctx.body = {
      code: 0,
      data: {
        url: cover.filename
      }
    }
  }



  /* 
  
    删除指定菜谱
  */

  @Get('/user/cookbook/remove/:id(\\d+)')
  @Before(UserAuth)
  public async cookbookRemove(@Ctx ctx: Context){
    let id = ctx.params.id || 0
    // console.log(id);

    let cookbook = await CookbookModel.findById(id)
    await cookbook.destroy()
    /* 
      以为这里不是ajax 请求,所以返回一个页面给用户
      或者重定向到列表页面即可
    */
    ctx.redirect('/user/cookbook')
  }


  /* 
  
    编辑指定菜谱
  */
  @Get('/user/cookbook/edit/:id(\\d+)')
  @Before(UserAuth)
  public async cookbookEdit (@Ctx ctx: Context){
    let id = ctx.params.id || 0
    let rs = await CookbookModel.findById(id)

    let cookbook = rs.toJSON()
    cookbook.covers = JSON.parse(cookbook.covers)
    cookbook.ingredients = JSON.parse(cookbook.ingredients)
    cookbook.cookers = JSON.parse(cookbook.cookers)
    cookbook.steps = JSON.parse(cookbook.steps)
    // console.log(cookbook.level);
    

    // console.log(cookbook);
    


    let categories = await CategoryModel.findAll();
    // console.log(categories);

    let data = categories.map(category => {
      // category.get('')
      return {
        id: category.get('id'),
        name: category.get('name'),
        pid: category.get('pid')
      }
    })

    categories = (new Tree(data)).getTree(0)



    ctx.body = ctx.template.render('user/user_edit.html',{
      user: ctx.state.user,
      active: 'cookbook',
      categories,
      cookbook
    })
  }



  /* 
    修改新菜谱接口
  */

  @Post('/user/cookbook/edit/')
  @Before(UserAuth)
  public async postCookbookEdit(@Ctx ctx: Context) {
    let body: any = ctx.request.body

    // console.log(body);
    
    

    let cookbook = await CookbookModel.findById(body.id)


    body.name && cookbook.set('name',body.name)
    body.categoryId && cookbook.set('categoryId', body.categoryId)
    body.covers && cookbook.set('covers', JSON.stringify(body.covers))
    body.description && cookbook.set('description', body.description)
    body.craft && cookbook.set('craft', body.craft)
    body.level && cookbook.set('level', body.level)
    body.needTime && cookbook.set('needTime', body.needTime)
    body.cookers && cookbook.set('cookers', JSON.stringify(body.cookers))
    body.ingredients && cookbook.set('ingredients', JSON.stringify(body.ingredients))
    body.steps && cookbook.set('steps', JSON.stringify(body.steps))
    body.tips && cookbook.set('tips', body.tips)

    if (!body.name) {
      return ctx.body = {
        code: 1,
        message: '菜谱名称不能为空'
      }
    }

    


    await cookbook.save()

    ctx.body = {
      code: 0,
      data: cookbook
    }


  }







}

