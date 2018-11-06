import Vue from 'vue'

let bus = new Vue()

export default {
  install (Vue, name = '$bus') {
    Object.defineProperty(Vue.prototype, name, { value: bus })
  }
}
