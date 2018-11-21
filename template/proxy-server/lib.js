var path = require('path')
var fs = require('fs')
var os = require('os')

module.exports = {
  creatJson(url, data) {
    let obj = JSON.parse(data)
    if (!obj.data) return false
    if (obj.status.code != 200) return false
    if (JSON.stringify(obj.data) === '{}') return false
    if (obj.data instanceof Array && obj.data.length < 1) return false
    let urls = url.split('/')
    let ds = '/'
    if (os.platform() === 'win32') {
      ds = '\\'
    }
    let jsons = path.resolve(__dirname, './') + ds + 'jsons'
    let dir = jsons
    let json = ''
    json = jsons + url + '.json'
    if (fs.existsSync(json)) {
      return
    }
    for (let i = 0; i < (urls.length - 1); i++) {
      dir = dir + ds + urls[i]
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
    fs.writeFileSync(json, data, {
      encoding: 'utf-8'
    })
  },
  readJson(url) {
    let ds = '/'
    if (os.platform() === 'win32') {
      ds = '\\'
    }
    let jsons = path.resolve(__dirname, './') + ds + 'jsons'
    let json = ''
    json = jsons + url + '.json'
    if (!fs.existsSync(json)) {
      return JSON.stringify({
        status: {
          code: 404,
          message: '接口不存在！'
        },
        data: 0
      })
    }
    return fs.readFileSync(json, {
      encoding: 'utf-8'
    })
  },
  creatFile(url, data, originName) {
    let urls = url.split('/')
    let ds = '/'
    if (os.platform() === 'win32') {
      ds = '\\'
    }
    let filepath = path.resolve(__dirname, './') + ds + 'jsons'
    let dir = filepath
    let filename = ''
    let json = ''
    filename = filepath + url + '.' + originName
    json = filepath + url + '.json'
    if (fs.existsSync(json) && fs.existsSync(filename)) {
      return
    }
    for (let i = 0; i < (urls.length - 1); i++) {
      dir = dir + ds + urls[i]
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
    fs.writeFileSync(json, originName, {
      encoding: 'utf-8'
    })
    let ws = fs.createWriteStream(filename)
    ws.once('open', function () {
      console.log('流打开了~~~')
    })
    ws.once('close', function () {
      console.log('流关闭了~~~')
    })
    ws.write(data)
    ws.end()
  },
  readFile(url, res) {
    let ds = '/'
    if (os.platform() === 'win32') {
      ds = '\\'
    }
    let filepath = path.resolve(__dirname, './') + ds + 'jsons'
    let json = ''
    json = filepath + url + '.json'
    if (!fs.existsSync(json)) {
      return JSON.stringify({
        status: {
          code: 404,
          message: '接口不存在！'
        },
        data: 0
      })
    }
    let filename = fs.readFileSync(json, {
      encoding: 'utf-8'
    })
    if (!fs.existsSync(filename)) {
      return JSON.stringify({
        status: {
          code: 404,
          message: '文件不存在！'
        },
        data: 0
      })
    }
    let rs = fs.createReadStream(filepath + url + '.' + filename)
    res.writeHead(200, {
      'content-disposition': 'attachment;fileName=' + encodeURI(filename)
    })
    rs.once('open', function () {
      console.log('可读流已经打开')
    })
    rs.once('close', function () {
      console.log('可读流已经关闭')
      res.end()
    })
    rs.on('data', function (data) {
      res.write(data)
    })
  }
}
