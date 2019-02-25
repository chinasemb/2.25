

import { Controller, Get ,Ctx } from 'koa-controllers'
import { Context } from 'koa';
import CategoryModel from '../../models/category';
import CookbookModel from '../../models/cookbook'
import UserModel from '../../models/user'
import Tree from '../../libs/Tree';



/* 
    把一个普通的类,装饰成控制器类

*/
@Controller
export class MainIndexController {



  /* 
    美食分类
  */
  @Get('/')
  public async index( @Ctx ctx: Context ){
    // console.log("首页")
    // ctx.body = '首页'

    let categories = await CategoryModel.findAll();
    
    // console.log(categories);

    let data = categories.map( category => {
      // category.get('')
      return {
        id: category.get('id'),
        name: category.get('name'),
        pid: category.get('pid')
      }
    } )

    // console.log(ctx.session);
    
    
    data =( new Tree(data)) .getTree(0) 

    // console.log(data);


    //美食数据
    //UserModel   主要查询的是美食,然后根据美食的userId字段关联查询user表中的数据,
    //紧接着需要在 查询当中设置(findAll) , 查询美食的同时,把美食所归属的用户的信息也查询出来
    /* 
      findAll({
        include:[UserModel]
      })
    */

    CookbookModel.belongsTo(UserModel,{
      //关联字段 (外键)
      foreignKey: 'userId'
    })

    let cookbooks = await CookbookModel.findAll({
      limit:16,
      include:[{
        model: UserModel,
        attributes: ['username']
      }]
    })

    // console.log(cookbooks);

    let data2 = cookbooks.map(cookbook => {
      // category.get('')
      return {
        cover: cookbook.get('covers') === '' ? '' : JSON.parse(cookbook.get('covers'))[0],
        userId: cookbook.get('userId'),
        username: cookbook.get('user').get('username'),
        id: cookbook.get('id'),
        name: cookbook.get('name'),
        categoryId: cookbook.get('categoryId'),
      }
    })

    // console.log(data2);
    
    



    ctx.body = ctx.template.render('index.html',{
      categories: data,
      user: ctx.state.user,
      data2
    })
    
  }





  /* 
    美食详情页面
    当访问的url 匹配了当前的路由以后,会把view 后面的值赋值给id ,在我们的方法中就可以通过 
    ctx.params.id  拿到该值
    (\\d+):   view 后面的值只匹配数字类型的值
    针对params 的类型声明:  在app.d.ts 里  扩展koa 模块的Context 接口
    interface Context{
      params: any;
      template: nunjucks.Environment;
    }
  */
  @Get('/view/:id(\\d+)')
  async view (@Ctx ctx:Context){
    let id = ctx.params.id
    // console.log(id);
    // ctx.body = id


    //获取分类
    let categories = await CategoryModel.findAll();

    CookbookModel.belongsTo(UserModel, {
      //关联字段 (外键)
      foreignKey: 'userId'
    })
    CookbookModel.belongsTo(CategoryModel, {
      //关联字段 (外键)
      foreignKey: 'categoryId'
    })

    //把model对象直接转换成 JSON数据格式
    let cookbook = await CookbookModel.findById(id,{
      include: [{
        model: UserModel,
        attributes: ['username']
      },{
          model: CategoryModel,
      }]
    })
    // console.log(cookbook);
    
    // console.log(cookbook.toJSON());

    // var d = new Date();
    // var n = d.toJSON();

    // console.log(d);
    // console.log(n);
    // console.log(typeof d);  object
    // console.log(typeof n);  string


    cookbook = Object.assign(cookbook,{
      covers: cookbook.get('covers') ? JSON.parse(cookbook.get('covers')) : [],
      ingredients: cookbook.get('ingredients') ? JSON.parse(cookbook.get('ingredients')) : {m:[] ,s: []},
      steps: cookbook.get('steps') ? JSON.parse(cookbook.get('steps')) : [],
      taste: cookbook.get('taste') ? cookbook.get('taste') : '酸甜',
      level: cookbook.get('level') ? cookbook.get('level') : '初级',
      username: cookbook.get('user').username,
      avatar: cookbook.get('user').avatar ? cookbook.get('user').avatar : '1545271761528.png'
    })

    // console.log(cookbook.toJSON());
    

    ctx.body = ctx.template.render('view.html',{
      cookbook,
      categoryId: cookbook.get('categoryId'),
      user: ctx.state.user,
      categories,
      categoryName: cookbook.get('category').name
    })

    


    
    
    
    
    
  }





  /* 
    美食列表页面

    查看更多:  类似于分页,不是分页,类似于瀑布流的形式来查看分页的展示
    修改后端: page 
  */

    @Get('/list/:categoryId(\\d+)?')
    async list(@Ctx ctx: Context){

      // console.log(ctx.params.categoryId);
      let categoryId = ctx.params.categoryId

      let page = ctx.query.page || 1;  //?page = 1这样的一种形式传递过来
      let limit =1;
      let offset = (page -1)* limit;

      CookbookModel.belongsTo(UserModel, {
        //关联字段 (外键)
        foreignKey: 'userId'
      })

      //获取分类
      let categories = await CategoryModel.findAll()

      //根据 categoryId 获取对应的分类下的美食,如果传入的id的值是undefined ,那么where 就是空的
      let where: any = {}
      let categoryName = '全部'
      if (categoryId) {
        where.categoryId = categoryId
        categoryName = categories.find(cate => cate.get('id') == categoryId).get('name')
      }
      let rs = await CookbookModel.findAndCountAll({
        where: where,
        include: [{
          model: UserModel,
          attributes: ['username']
        }],
        limit,
        offset
      })

      // console.log(Cookbooks.length);

      let cookbooks = rs.rows.map(cookbook =>{

        let ingredients = cookbook.get('ingredients') ? JSON.parse(cookbook.get('ingredients')) : { m: [], s: [] }
        // console.log(ingredients);
        return Object.assign(cookbook, {
          covers: cookbook.get('covers') ? JSON.parse(cookbook.get('covers')) : [],
          ingredients: [...ingredients.m.map(val => val.k),...ingredients.s.map(val => val.k)].join('、'),
          steps: cookbook.get('steps') ? JSON.parse(cookbook.get('steps')) : [],
           username: cookbook.get('user').username,
           /*
          avatar: cookbook.get('user').avatar ? cookbook.get('user').avatar : '1545271761528.png',
          categoryName: cookbook.get('category').name */
          
        })
      })


      // console.log(cookbooks);
      // console.log(rs.count);
      
      

      /* 
        当请求的page, 与当前数据库中的总页码数 是一致的,那就表明用户看到的已经是最后一页了,后面没有数据了
        总数/ 每页条数 = 总页数  ---> 向上取整
      */
      let pages = Math.ceil((rs.count / limit))
      let isMore = page < pages

      // console.log(page,pages);
      

      //判断一下请求头: 看看 请求是  1: 浏览器发送 2: AJAX 发送的请求
      //如果是 浏览器发送的请求,返回对应的 渲染过后的 列表页面
      //如果是 AJAX 发送的请求,返回的是JSON 格式的数据,发送cookbooks , 其他的数据不需要
      if (ctx.headers['x-requested-with'] === 'XMLHttpRequest'){
        ctx.body = {
          cookbooks,
          isMore
        }
      }else{
        ctx.body = ctx.template.render('list.html', {
          categories,
          user: ctx.state.user,
          categoryId,
          cookbooks,
          categoryName,
          count: rs.count,
          isMore,
          page,
          pages
        })
      }

      

    }




}