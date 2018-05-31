/**
 * 文件上传指令v-upload,支持单文件上传，文件分片上传
 * @params String url // 上传地址
 * @params Boolean slice // 是否分片
 * @params Function callback // 回调
 * @author zengping<331962716@qq.com>
 */
import axios from 'axios'

let upload = {
  inserted (el, binding, vnode) {
    for (let i in binding.value) {
      a[i] = binding.value[i]
    }
    if (!binding.value.pathId) delete a.pathId
    el.addEventListener('click', e => {
      let ifupload = el.getAttribute('data-ifupload')
      if (Number(ifupload) > 0) return false
      let cb = el.getAttribute('data-callback')
      if (cb) {
        a.callback = a[cb]
      }
      a.$Vue = vnode.context.$root
      a.init()
    }, false)
  }
}

let A = () => {
  this.$Vue = {}
  this.fileDom = {}
  this.files = []
  this.activeFile = {}
  this.reader = null
  this.step = 0
  this.total = 0
  this.cuLoaded = 0
  this.url = ''
  this.urlArr = []
  this.slice = false
  this.callback = null
  this.token = ''
  this.pathId = 0
}
A.prototype = {
  init: () => {
    document.body.appendChild(a.createFileInput())
    a.fileDom = document.querySelector('#v-uploadFile')
    a.bindEvent()
    a.fileDom.click()
  },
  // 创建上传按钮
  createFileInput: () => {
    let input = document.createElement('input')
    input.type = 'file'
    input.id = 'v-uploadFile'
    input.style.opacity = 0
    return input
  },
  bindEvent: () => {
    a.fileDom.onchange = e => {
      Array.prototype.slice.apply(a.fileDom.files).map(o => {
        a.activeFile = o
        // let extName = o.name.substr(o.name.lastIndexOf('.') + 1)
        // let extItem = ['jpg', 'png', 'jpeg', 'gif']
        // if (!a.$Vue.$lib.isInArray(extItem, extName)) {
        //   a.$Vue.$store.commit('setJalertText', {text: '不是图片，不能上传！'})
        //   return
        // }
        // 开始读取
        if (a.slice) {
          a.total = o.size
          a.reader = new FileReader()
          a.reader.onload = a.onload
          a.cuLoaded = 0
          a.step = 100 * 1024
          a.urlArr = a.url.split(',')
          a.getToken()
        } else {
          a.uploadFile2()
        }
      })
    }
  },
  // 获取文件token
  getToken: () => {
    let uri = a.$Vue.$http.getUrl({api: a.urlArr[0], type: 'get', id: a.pathId})
    let ds = uri.indexOf('?') > -1 ? '&' : '?'
    uri = uri + ds + 'fileName=' + a.activeFile.name + '&fileSize=' + a.total
    a.ajax({
      url: uri,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset:utf-8',
        'token': a.$Vue.$store.state.token,
        'timeout': 30000
      },
      callback: (data) => {
        a.token = data.token
        a.getStart()
      }
    })
  },
  // 获取文件断点，支持断点续传
  getStart: () => {
    let uri = a.$Vue.$http.getUrl({api: a.urlArr[1], type: 'get', id: a.pathId})
    let ds = uri.indexOf('?') > -1 ? '&' : '?'
    uri = uri + ds + 'token=' + a.token + '&fileName=' + a.activeFile.name + '&fileSize=' + a.total
    a.ajax({
      url: uri,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset:utf-8',
        'token': a.$Vue.$store.state.token,
        'timeout': 30000
      },
      callback: (data) => {
        a.readBlob(data.start)
      }
    })
  },
  onload: e => {
    let loaded = e.loaded
    if (e.target.readyState === FileReader.DONE) {
      let data = e.target.result
      a.uploadFile(data, a.cuLoaded, res => {
        a.cuLoaded += loaded
        let percent = Math.floor(a.cuLoaded / a.total * 100) + '%'
        a.process(percent)
        if (a.cuLoaded < a.total) {
          a.readBlob(a.cuLoaded)
        } else {
          a.cuLoaded = a.total
          a.total = 0
          a.cuLoaded = 0
          a.step = 0
          a.urlArr = []
          a.process('100%')
          a.callback(res)
        }
      })
    }
  },
  readBlob: start => {
    let blob = a.activeFile.slice(start, start + a.step)
    a.reader.readAsArrayBuffer(blob)
  },
  // 单文件分片上传
  uploadFile: (result, startIndex, onSuccess) => {
    let blob = new Blob([result])
    let fd = new FormData()
    fd.append('data', blob, a.activeFile.name)
    let uri = a.$Vue.$http.getUrl({api: a.urlArr[2], type: 'post', id: a.pathId})
    let ds = uri.indexOf('?') > -1 ? '&' : '?'
    uri = uri + ds + 'token=' + a.token + '&fileName=' + a.activeFile.name + '&fileSize=' + a.total
    a.ajax({
      url: uri,
      method: 'post',
      data: fd,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': a.$Vue.$store.state.token,
        'timeout': 30000
      },
      callback: (data) => {
        onSuccess(data)
      }
    })
  },
  // 单文件上传
  uploadFile2: () => {
    a.process('50%')
    let uri = a.$Vue.$http.getUrl({api: a.url, type: 'post', id: a.pathId})
    uri = uri.indexOf('?') > -1 ? uri : uri + '?'
    uri = uri + '&fileName=' + a.activeFile.name
    let fd = new FormData()
    fd.append('data', a.activeFile, a.activeFile.name)
    a.ajax({
      url: uri,
      method: 'post',
      data: fd,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': a.$Vue.$store.state.token,
        'timeout': 30000
      },
      callback: (data) => {
        a.process('100%')
        a.callback(data.data)
      }
    })
  },
  // 进度条
  process: percent => {
    let el = document.querySelector('#v-uploadProcess')
    if (!el) {
      a.processDiv()
    }
    document.querySelector('.blueprogress').style.width = percent
    document.querySelector('.processpercent').innerHTML = percent
    if (percent === '100%') {
      document.querySelector('#v-uploadProcess').remove()
      a.fileDom.remove()
    }
  },
  processDiv: () => {
    let div = document.createElement('div')
    div.id = 'v-uploadProcess'
    div.style = 'position:fixed;z-index:9999;width:100%;height:100%;top:0px;left:0px;'
    div.innerHTML = '<div class="processbg" style="position:fixed;z-index:1;display:block;width:100%;height:100%;background:#000;opacity:0.6;"></div><div class="processbar" style="position:fixed;z-index:2;display:block;width:600px;height:20px;background:#ebebeb;top:50%;left:50%;margin-top: -10px;margin-left:-300px; border-left: 1px solid transparent; border-right: 1px solid transparent;border-radius: 10px;"><span class="blueprogress" style="margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;position: relative;float: left;margin: 1px 0px;height: 18px;line-height: 16px;text-align: right;background: #cccccc;border: 1px solid;border-color: #bfbfbf #b3b3b3 #9e9e9e;border-radius: 10px;background-image: -webkit-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);background-image: -moz-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);background-image: -o-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);background-image: linear-gradient(to bottom, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);-webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);background: #5aaadb;border-color: #459fd6 #3094d2 #277db2;background-image: -webkit-linear-gradient(top, #aed5ed 0%, #7bbbe2 70%, #5aaadb 100%);background-image: -moz-linear-gradient(top, #aed5ed 0%, #7bbbe2 70%, #5aaadb 100%);background-image: -o-linear-gradient(top, #aed5ed 0%, #7bbbe2 70%, #5aaadb 100%);background-image: linear-gradient(to bottom, #aed5ed 0%, #7bbbe2 70%, #5aaadb 100%); width:0%;"><span class="processpercent" style="padding: 0 8px;font-size: 11px;font-weight: bold;color: #404040;color: rgba(0, 0, 0, 0.7);text-shadow: 0 1px rgba(255, 255, 255, 0.4);">0%</span></span></div>'
    document.body.appendChild(div)
    a.processCss()
  },
  processCss: () => {
    let s = document.createElement('style')
    s.innerText = '.blueprogress::before{ content: \'\';position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 1;height: 18px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAASUlEQVQ4je3RMQ7AIBADwTnK+/9bqVMmoUBAqCJcWZa1zQYS1Z189OE9vLMEaUHLENSYOff22AGBsgOCLDPn3n6sHWtfIf5t7QLBYTNAaHlxVQAAAABJRU5ErkJggg==) 0 0 repeat-x;border-radius: 10px;}'
    document.body.appendChild(s)
  },
  ajax: o => {
    axios({
      url: o.url,
      method: o.method,
      data: o.data,
      headers: o.headers
    }).then(res => {
      if (Number(res.data.status.code) === 200) {
        o.callback(res.data.data)
      } else {
        a.process('100%')
        a.$Vue.$store.commit('setJalertText', {text: res.data.status.message})
      }
    }).catch(err => {
      a.process('100%')
      a.$Vue.$store.commit('setJalertText', {text: err})
    })
  }
}
let a = new A()

export default upload
