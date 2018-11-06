import http from './http'

let Http = () => {}
Http.prototype = http

export default {
  install (Vue, name = '$http') {
    Http.prototype.$root = Vue.prototype
    Object.defineProperty(Vue.prototype, name, {value: new Http()})
  }
}
