var http = require('http'),
  httpProxy = require('http-proxy'),
  url = require('url'),
  lib = require('./lib')

var proxy = httpProxy.createProxyServer({})
var server = http.createServer(function (req, res) {
  var path = url.parse(req.url, true)
  var query = path.query
  var target = 'http://localhost:9500'
  if (query.proxy) {
    query.proxy = query.proxy.indexOf('http://') > -1 ? query.proxy : 'http://' + query.proxy
    target = query.proxy
  }
  proxy.web(req, res, {
    target: target
  })
})
proxy.on('proxyRes', function (proxyRes, req, res) {
  var path = url.parse(req.url, true)
  var body = new Buffer('')
  proxyRes.on('data', function (data) {
    body = Buffer.concat([body, data])
  })
  proxyRes.on('end', function () {
    try {
      if (req.headers.downloadapi && res.getHeader('content-disposition')) {
        let originArray = res.getHeader('content-disposition').split('=')
        let originName = decodeURI(originArray[originArray.length - 1])
        lib.creatFile(path.pathname, body, originName)
      } else {
        body = body.toString()
        lib.creatJson(path.pathname, body)
      }
    } catch (e) {
      console.log(e.message)
    }
    res.end()
  })
})
proxy.on('error', function (proxyRes, req, res) {
  try {
    var path = url.parse(req.url, true)
    if (req.headers.downloadapi) {
      lib.readFile(path.pathname, res)
    } else {
      var jsons = lib.readJson(path.pathname)
      var obj = JSON.parse(jsons)
      obj.origin = 'local json'
      jsons = JSON.stringify(obj)
      res.end(jsons)
    }
  } catch (e) {
    res.end(e.message)
  }
})
server.listen(9191)
console.log('Server has started.')
