import lib from './lib'

let Libs = () => {}
Libs.prototype = lib

export default {
  install (Vue, name = '$lib') {
    Libs.prototype.$root = Vue.prototype
    Object.defineProperty(Vue.prototype, name, { value: new Libs() })
  }
}
