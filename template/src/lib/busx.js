import bus from './bus'

export default {
  install (Vue, name = '$bus') {
    Object.defineProperty(Vue.prototype, name, { value: new bus() })
  }
}
