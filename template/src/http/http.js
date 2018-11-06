import axios from 'axios'
import store from '@/store'
import api from '@/api/api'
const project = window.config.GATEWAY
let queryStr = window.location.search ? window.location.search.substring(1) : ''

let http = {
  get (o) {
    o.type = 'get'
    return this.xhr(o)
  },
  post (o) {
    o.type = 'post'
    return this.xhr(o)
  },
  put (o) {
    o.type = 'put'
    return this.xhr(o)
  },
  delete (o) {
    o.type = 'delete'
    return this.xhr(o)
  },
  getUrl (o) {
    if (o.json) return o.json
    let uristr = this.getApi(o)
    let uriarr = uristr.split('?')
    let uri = uriarr[0]
    if (typeof o.params.id === 'number' || typeof o.params.id === 'string') {
      uri = uri + '/' + o.params.id
      delete o.params.id
    }
    if (typeof o.params.eventId === 'number' || typeof o.params.eventId === 'string') {
      uri = uri + '/' + o.params.eventId
      delete o.params.eventId
    }
    if ((o.type === 'get' || o.type === 'delete') && Object.keys(o.params).length > 0) {
      uri = uri.indexOf('?') > -1 ? uri + '&' + this.joinP(o.params) : uri + '?' + this.joinP(o.params)
    }
    if (uriarr.length > 1) {
      uri = uri.indexOf('?') > -1 ? uri + '&' + uriarr[1] : uri + '?' + uriarr[1]
    } else if (queryStr) {
      uri = uri.indexOf('?') > -1 ? uri + '&' + queryStr : uri + '?' + queryStr
    }
    return uri
  },
  getApi (o) {
    let uri = api.getURL(o.api)
    if (uri === undefined || uri === '') {
      this.$root.$bus.$emit('alert', {text: '请填写api'})
    }
    uri = project + '/' + uri
    return uri
  },
  joinP (o) {
    let x = []
    for (let i in o) {
      x.push(`${i}=${o[i]}`)
    }
    return encodeURI(x.join('&'))
  },
  checkToken (o) {
    if (!o.token) {
      let token = store.getters.getToken
      if (!token) {
        this.$root.$bus.$emit('alert', {
          text: 'token丢失，请重新登录！',
          callback: () => {
            window.location.href = window.config.LOGIN_PAGE
          }
        })
        throw new Error('token is error')
      } else {
        o.token = token
      }
    }
  },
  xhr (o) {
    let self = this
    this.checkToken(o)
    let config = {
      headers: {
        'Content-type': 'application/json;charset:utf-8',
        'Authorization': o.token,
        'timeout': o.timeout ? o.timeout : 30000
      }
    }
    if (o.headers) config.headers = Object.assign(config.headers, o.headers)
    if (o.config) config = Object.assign(config, o.config)
    // config.params = o.params
    let instance = axios.create(config)
    let params = o.type === 'get' ? '' : o.params
    if (o.headers && o.headers.responseType) {
      this.downloadFile(o)
      return
    }
    let url = this.getUrl(o)
    return new Promise((resolve, reject) => {
      instance[o.type](url, params).then((res) => {
        // store.commit('hideLoading')
        if (Number(res.data.status.code) === 401) {
          let msg = res.data.status.message ? res.data.status.message : '无访问权限，请重新登录！'
          self.$root.$bus.$emit('alert', {
            text: msg,
            callback: () => {
              window.sessionStorage.clear()
              window.location.href = window.config.LOGIN_PAGE
            }
          })
          throw new Error('token无效，无访问权限！')
        }

        if (Number(res.data.status.code) === 200) {
          if (typeof res.data.data === 'string' && Number(res.data.data) === 0 && typeof o.confirm === 'undefined') {
            let msg = '操作失败'
            reject(msg)
          } else if (typeof res.data.data === 'string' && Number(res.data.data) === 1 && typeof o.confirm === 'undefined') {
            let msg = '操作成功'
            self.$root.$bus.$emit('alert', {
              text: msg,
              callback: () => {
                resolve(res.data.data)
              }
            })
          } else {
            resolve(res.data.data)
          }
        } else {
          // reject(res.data.status.message)
          let msg = res.data.status.message ? res.data.status.message : '对不起，服务器接口出错！请联系技术人员！'
          reject(msg)
        }
      }).catch((err) => {
        if (err.message.indexOf('status code 504') > -1) {
          err.message = '请求超时,请重新请求！'
        }
        if (err.message.indexOf('status code 401') > -1) {
          let msg = '无访问权限，请重新登录！'
          self.$root.$bus.$emit('alert', {
            text: msg,
            callback: () => {
              window.sessionStorage.clear()
              window.location.href = window.config.LOGIN_PAGE
            }
          })
          throw new Error('token无效，无访问权限！')
        }
        if (err.message.indexOf('status code 400') > -1) {
          err.message = '请求无效，请检查api是否正确！无效api为：' + self.getUrl(o)
        }
        if (err.message.indexOf('status code 404') > -1) {
          err.message = '找不到页面，请检查api是否正确！无效api为：' + self.getUrl(o)
        }
        reject(err.message)
      })
    })
  },
  downloadFile (o) {
    var myxhr = new XMLHttpRequest()
    myxhr.open('get', this.getUrl(o))
    myxhr.setRequestHeader('Authorization', o.token)
    myxhr.setRequestHeader('downloadapi', 'downloadapi')
    myxhr.responseType = o.headers.responseType
    myxhr.onreadystatechange = function () {
      if (myxhr.readyState === 4) {
        if ((myxhr.status === 200 && myxhr.status < 300) || myxhr.status === 304) {
          var urlCreator = window.URL || window.webkitURL
          var blob = new Blob([myxhr.response], { type: myxhr.getResponseHeader('content-type') })
          var url = urlCreator.createObjectURL(blob)
          var link = document.createElement('a')
          link.setAttribute('href', url)
          let originArray = []
          let originName = 'downloadFile.pdf'
          let attachment = myxhr.getResponseHeader('content-disposition')
          if (attachment) {
            originArray = attachment.split('=')
            originName = decodeURI(originArray[originArray.length - 1])
          }
          if (o.params && o.params.fileName) {
            originName = o.params.fileName
          }
          link.setAttribute('download', originName)
          var event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', false, false, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          link.dispatchEvent(event)
        }
      }
    }
    myxhr.send()
  }
}

export default http
