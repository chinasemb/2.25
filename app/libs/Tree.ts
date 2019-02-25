export default class Tree {

  private originData: any[] = [];

  constructor(data: any[]) {
    this.originData = data;
  }


  /* 
    获取originData 的tree 的形式
  */
  getTree (id: number) {
    let _data : any[] = this.originData.filter( item => item.pid == id );

    _data.forEach( d => {
      d.children = this.getTree(d.id);
    } )

    return _data;
    
  }

}