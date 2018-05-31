import api from './api'

let Api = () => {}
Api.prototype = api

export default {
  install (Vue, name = '$api') {
    Object.defineProperty(Vue.prototype, name, {value: new Api()})
  }
}
