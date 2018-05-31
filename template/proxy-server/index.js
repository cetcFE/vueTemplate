var http = require("http"),
httpProxy = require('http-proxy'),
url = require("url")
var proxy = httpProxy.createProxyServer({})
var server = http.createServer(function(req, res) {
  var path = url.parse(req.url, true)
  var query = path.query
  var target = 'http://172.17.225.116:8185'
  if (query.proxy){
    query.proxy = query.proxy.indexOf('http://') > -1 ? query.proxy : 'http://' + query.proxy
    target = query.proxy
  }
  proxy.web(req, res, { target: target })
})
server.listen(8181)
console.log("Server has started.")
console.log("请在浏览器访问http://localhost:8181")
