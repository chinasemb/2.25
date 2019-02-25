import * as Koa from 'koa';
import * as nunjucks from 'nunjucks';

declare module 'koa' {
  /* 扩展 koa 模块的 Context 接口 */

  interface Context {
    template: nunjucks.Environment;
  }
}