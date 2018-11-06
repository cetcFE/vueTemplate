import Vue from 'vue'
import Router from 'vue-router'
import MessageBox from 'element-ui/packages/message-box'
import 'element-ui/lib/theme-chalk/index.css'
import api from '@/api'
import http from '@/http'
import lib from '@/lib'
import bus from '@/bus'
import echarts from '@/lib/echarts'
import directives from '@/directives'
// 首页
import Index from '@/views/index/Index'
// token
import Token from '@/views/token/Index'

Vue.use(Router)
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(api)
Vue.use(http)
Vue.use(lib)
Vue.use(bus)
Vue.use(echarts)
directives.init(Vue)

export default new Router({
  routes: [
    {
      path: '/index',
      name: '首页',
      component: Index
    },
    {
      path: '/token/:token',
      name: 'token初始化',
      component: Token
    },
    {
      path: '*',
      redirect: '/index'
    },
    {
      path: '/',
      redirect: '/index'
    }
  ]
})
