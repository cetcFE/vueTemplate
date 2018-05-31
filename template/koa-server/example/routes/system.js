import { request, summary, body, tags, middlewares, path, description, okMsg, lib } from '../../lib';

const tag = tags(['系统']);

export default class SystemRouter {
  @request('get', '/user/menu/getMenu')
  @summary('获取菜单')
  @tag
  @description('获取顶部系统菜单')
  static async getMenu(ctx) {
    okMsg.data = [
      {
        "id": 1,
        "pId": 0,
        "name": "首页",
        "icon": "",
        "url": "index",
        "moduleType": 0,
        "child": []
      }
    ];
    lib.creatJson('/system/menu', okMsg);
    ctx.body = okMsg;
  }



  @request('get', '/user/menu/user-info')
  @summary('获取用户信息')
  @tag
  static async userInfo(ctx) {
    okMsg.data = {
      "name": 'admin'
    };
    lib.creatJson('/menu/user-info', okMsg);
    ctx.body = okMsg;
  }

  @request('get', '/auth/system/logout')
  @summary('登出')
  @tag
  static async logout(ctx) {
    okMsg.data = 1;
    lib.creatJson('/system/logout', okMsg);
    ctx.body = okMsg;
  }
}
