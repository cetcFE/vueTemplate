import echarts from 'echarts'

export default {
  install (Vue, name = '$echarts') {
    Object.defineProperty(Vue.prototype, name, {value: echarts})
  }
}
