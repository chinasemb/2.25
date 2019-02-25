

import { Controller, Get ,Ctx ,Post } from 'koa-controllers'
import { Context } from 'koa';
import CategoryModel from '../../models/category';
import Tree from '../../libs/Tree';
import * as Sequelize from 'sequelize';



/* 
    把一个普通的类,装饰成控制器类

*/
@Controller
export class AdminCateGoryIndexController {

  @Get('/api/admin/category')
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
    
    data =( new Tree(data)) .getTree(0) 

    // console.log(data);

    ctx.body = {
      code: 0,
      data
    }
    
  }

  // @Get('/user')
  // public async user(){
  //   console.log("用户")
  // }

  @Post('/api/admin/category/add')
  public async add( @Ctx ctx: Context ) {
    /* 接收 name 和 pid  
      增加一个中间件  bodyparser 
      通过 ctx.request.body 
      如果没传,可以给一个'',0.
    */
    let body = <any>ctx.request.body;
    let name = body.name || '';
    let pid = 0; 

    if (!isNaN(Number(body.pid))) {
      pid = Number(body.pid)
    };

    //验证 
    // name 不能为空,
    if (name == '') {
      return ctx.body = {
        code: 1,
        message: '分类名称不能为空'
      }
    };

    let data = CategoryModel.build({
      name,pid
    })

    await data.save();
    
    ctx.body = {
      code: 0,
      data: data
    }

  }


  //删除分类
  @Post('/api/admin/category/remove')
  public async remove( @Ctx ctx: Context ) {
    /* 接收  id  
      增加一个中间件  bodyparser 
      通过 ctx.request.body 
    */
    let body = <any>ctx.request.body;
    let id = 0; 

    if (!isNaN(Number(body.id))) {
      id = Number(body.id)
    };

    
    //根据你传过来的id 查找对应的记录
    let data = await CategoryModel.findById(id)


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
    await CategoryModel.destroy({
      where: {
        [Sequelize.Op.or]: [
            {id:id},
            {pid:id}
        ]
      }
    })

    
    ctx.body = {
      code: 0
    }

  }
  //修改分类
  @Post('/api/admin/category/edit')
  public async edit( @Ctx ctx: Context ) {
    /* 接收 name 和 id  
      增加一个中间件  bodyparser 
      通过 ctx.request.body 
      如果没传,可以给一个'',0.
    */
    let body = <any>ctx.request.body;
    let name = body.name || '';
    let id = 0; 

    if (!isNaN(Number(body.id))) {
      id = Number(body.id)
    };

    //验证 
    // name 不能为空,
    if (name == '') {
      return ctx.body = {
        code: 1,
        message: '分类名称不能为空'
      }
    };
    //根据你传过来的id 查找对应的记录
    let data = await CategoryModel.findById(id)

    if (!data) {
      return ctx.body = {
        code: 2,
        message: '不存在该分类~~'
      }
    }
    //如果存在,修改并存储
    data.set('name',name);

    await data.save();
    
    ctx.body = {
      code: 0,
      data: data
    }

  }


  


}