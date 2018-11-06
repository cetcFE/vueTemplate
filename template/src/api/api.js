let api = {
  getURL: (i) => {
    let a = {

      // 菜单
      'S_MENU': 'system/menu/getMenu',
      /**
       * 登录, 登出接口
       */
      // 登录
      'S_LOGIN': 'auth/system/login',
      // 登出
      'S_LOGOUT': 'auth/system/logout',
      // 用户信息
      'S_USERINFO': 'user/menu/user-info'
    }

    return window.config.API_MAPPING(a[i])
  }
}

export default api
