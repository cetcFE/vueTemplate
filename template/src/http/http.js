import axios from 'axios'
import store from '@/store'
import DEV_ENV from '@/http/DEV_ENV'
import api from '@/api/api'
const project = window.config.GATEWAY
let queryStr = window.location.search ? window.location.search.substring(1) : ''

let http = {
  get (o) {
    o.type = 'get'
    return this.xhr(o)
  },
  post (o) {
    o.type = DEV_ENV ? 'get' : 'post'
    return this.xhr(o)
  },
  put (o) {
    o.type = DEV_ENV ? 'get' : 'put'
    return this.xhr(o)
  },
  delete (o) {
    o.type = DEV_ENV ? 'get' : 'delete'
    return this.xhr(o)
  },
  getUrl (o) {
    let uri = api.getURL(o.api)
    if (uri === '') {
      store.commit('setJalertText', {text: '请填写api'})
    }
    uri = uri.indexOf('.json') > -1 ? '/static/jsons/' + uri + '?' : uri.indexOf('ws://') > -1 ? uri : project + '/' + uri
    if (typeof o.params.id === 'number') {
      uri = uri + '/' + o.params.id
    }
    if (typeof o.params.eventId === 'number') {
      uri = uri + '/' + o.params.eventId
    }
    if (o.type === 'get' && Object.keys(o.params).length > 0) {
      uri = uri + '?' + this.joinP(o.params)
    }
    if (queryStr) {
      uri = uri.indexOf('?') > -1 ? uri + '&' + queryStr : uri + '?' + queryStr
    }
    return uri
  },
  joinP (o) {
    let x = []
    for (let i in o) {
      if (i !== 'id' || i !== 'eventId') {
        x.push(`${i}=${o[i]}`)
      }
    }
    return encodeURI(x.join('&'))
  },
  checkToken (o) {
    if (!o.token) {
      let token = store.getters.getToken
      if (!token) {
        store.commit('setJalertText', {
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
    this.checkToken(o)
    return new Promise((resolve, reject) => {
      let config = {
        headers: {
          'Content-type': 'application/json;charset:utf-8',
          'Authorization': o.token,
          'timeout': o.timeout ? o.timeout : 30000
        }
      }
      if (o.headers) config.headers = Object.assign(config.headers, o.headers)
      if (o.config) config = Object.assign(config, o.config)
      let instance = axios.create(config)
      let params = o.type === 'get' ? '' : o.params
      instance[o.type](this.getUrl(o), params).then((res) => {
        store.commit('hideLoading')
        if (res.status === 200 && res.headers && res.headers['x-filename']) {
          if (res.request.readyState === 4) {
            if (res.request.status === 200) {
              var urlCreator = window.URL || window.webkitURL
              var blob = new Blob([res.data], { type: res.headers['content-type'] })
              var url = urlCreator.createObjectURL(blob)
              var link = document.createElement('a')
              link.setAttribute('href', url)
              link.setAttribute('download', decodeURI(res.headers['x-filename']))
              var event = document.createEvent('MouseEvents')
              event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
              link.dispatchEvent(event)
              resolve('200')
            } else {
              reject(res.request.status)
            }
          }
        }

        if (Number(res.data.status.code) === 401) {
          let msg = res.data.status.message ? res.data.status.message : '无访问权限，请重新登录！'
          store.commit('setJalertText', {
            text: msg,
            callback: () => {
              window.sessionStorage.clear()
              window.location.href = window.config.LOGIN_PAGE
            }
          })
          throw new Error('token无效，无访问权限！')
        }

        if (Number(res.data.status.code) === 200) {
          if (typeof res.data.data === 'string' && Number(res.data.data) === 0) {
            let msg = '操作失败！'
            reject(msg)
          } else if (typeof res.data.data === 'string' && Number(res.data.data) === 1) {
            let msg = '操作成功！'
            store.commit('setJalertText', {
              text: msg,
              callback: () => {
                resolve(res.data.data)
              }
            })
          } else {
            resolve(res.data.data)
          }
        } else {
          let msg = res.data.status.message ? res.data.status.message : '对不起，服务器接口出错！请联系技术人员！'
          reject(msg)
        }
      }).catch((err) => {
        if (err.message.indexOf('status code 504') > -1) {
          err.message = '请求超时,请重新请求！'
        }
        if (err.message.indexOf('status code 401') > -1) {
          let msg = '无访问权限，请重新登录！'
          store.commit('setJalertText', {
            text: msg,
            callback: () => {
              window.sessionStorage.clear()
              window.location.href = window.config.LOGIN_PAGE
            }
          })
          throw new Error('token无效，无访问权限！')
        }
        reject(err.message)
      })
    })
  }
}

export default http
