/**
 * vue 打包后保留配置文件
 * 1.配置文件放到static中不用被打包
 * 2.在vue组件中使用window对象引用
 * @author zengping<331962716@qq.com>
 */

window.config = {
  HOME_SYSTEM: '/',
  LOGIN_PAGE: '/#/login',
  GATEWAY: '/api/v1',
  API_MAPPING: apiMapping,
  PROXY_HOST: 'http://192.168.112.44:8000',
  TEST_HOST: 'http://172.17.225.119:56953'
}

/**
 * api映射函数，方便前后端api名称不一致
 * @param {*} api
 */
function apiMapping(api) {
  var a = {
    'test': 'target_test'
  }
  if (envCheck()) {
    a[api] = testApiMapping(api)
  }
  if (a[api]) {
    return a[api]
  } else {
    return api
  }
}

/**
 * env=test测试环境下api映射
 */
function testApiMapping(api) {
  var a = {
    'test': 'target_test',
    'spider/spiderGroup/getAllSpiderGroup': 'spiderGroup/getAllSpiderGroup'
  }
  if (a[api]) {
    return 'testapi/' + a[api] + '?proxy=' + window.config.TEST_HOST
  } else {
    return api
  }
}

function envCheck() {
  var query = getQuery()
  if (query['env'] && query['env'] === 'test') {
    return true
  }
  return false
}

function getQuery() {
  var queryStr = window.location.search.substring(1)
  var queryArr = queryStr.split('&')
  var query = {}
  queryArr.forEach(function (o) {
    var arr = o.split('=')
    query[arr[0]] = arr[1]
  })
  return query
}

function checkHost() {
  // proxy host白名单,不进行api映射
  var host = [
    '127.0.0.1'
  ]
  var queryStr = window.location.search.substring(1)
  var queryArr = queryStr.split('&')
  var query = {}
  queryArr.forEach(function (o) {
    var arr = o.split('=')
    query[arr[0]] = arr[1]
  })
  if (query['proxy']) {
    query['proxy'] = query['proxy'].indexof('http') > -1 ? query['proxy'].substring(7) : query['proxy']
    if (host.indexOf(query['proxy']) == -1) {
      return true
    }
  }
  return false
}
