"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tree {
    constructor(data) {
        this.originData = [];
        this.originData = data;
    }
    /*
      获取originData 的tree 的形式
    */
    getTree(id) {
        let _data = this.originData.filter(item => item.pid == id);
        _data.forEach(d => {
            d.children = this.getTree(d.id);
        });
        return _data;
    }
}
exports.default = Tree;
