/**
 * vue 打包后保留配置文件
 * 1.配置文件放到static中不用被打包
 * 2.在vue组件中使用window对象引用
 * @author zengping<331962716@qq.com>
 */

window.config = {
  HOME_SYSTEM: '/',
  LOGIN_PAGE: '/#/login',
  GATEWAY: '/api/v1'
}
