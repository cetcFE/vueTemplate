import curline from './curline'
import upload from './upload'

export default {
  init (Vue) {
    Vue.directive('curline', curline)
    Vue.directive('upload', upload)
  }
}
