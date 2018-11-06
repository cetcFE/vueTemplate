/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue'
import Vuex from 'vuex'
import token from './token'

Vue.use(Vuex)

let status = {
  state: {},
  getters: {},
  mutations: {},
  actions: {}
}

status = objAdd(status, token)

function objAdd (a, b) {
  Object.keys(a).forEach((o) => {
    for (let i in b[o]) {
      a[o][i] = b[o][i]
    }
  })
  return a
}

const store = new Vuex.Store(status)

export default store
