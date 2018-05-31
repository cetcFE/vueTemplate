var Mock = require('mockjs');

import { request, summary, body, tags, middlewares, path, description, okMsg, lib } from '../../lib';

const tag = tags(['首页']);

export default class IndexItemRouter {
  @request('get', '/internet/indexItem/news')
  @summary('互联网实时情报列表')
  @tag
  static async news(ctx) {
    okMsg.data = Mock.mock({
      'data|1-10': [
        {
          'id': function () {
            return Math.floor(Math.random() * 1000);
          },
          'type': /(行业信息|热点情报|公文公告)/,
          'date': /(2017-9-28 12:47:24|2017-11-21 12:47:24)/,
          'from': /(今日头条|人民网|腾讯新闻|百度新闻)/,
          'title': /(我市公安局举行党的十九大安保维稳专题|未来的奥迪轿车什么样？比A8还大，还没有方向盘！|税改方案令市场乐观 黄金反弹多头仍押注朝核危机|星巴克出了几款咖啡融合冰淇淋，不用你“冒险”乱星巴克出了几款咖啡融合冰淇淋，不用你“冒险”乱)/,
          'url': /(http:\/\/www\.12365auto\.com\/dcbg\/20180320\/329732\.shtml|http:\/\/www\.12365auto\.com\/dcbg\/20180321\/329839\.shtml)/
        }
      ]
    }).data;
    lib.creatJson('/indexItem/news', okMsg);
    ctx.body = okMsg;
  }

  @request('get', '/internet/indexItem/warning')
  @summary('告警列表')
  @tag
  static async warning(ctx) {
    okMsg.data = Mock.mock({
      'data|1-10': [
        {
          'id': function () {
            return Math.floor(Math.random() * 1000);
          },
          'title': /(质检处抽查信息对接任务中止运行！|工商行政许可信息对接任务配置出错|产品检验信息对接任务无响应|质检处抽查信息对接任务中止运行！|工商行政许可信息对接任务配置出错)/
        }
      ]
    }).data;
    lib.creatJson('/indexItem/warning', okMsg);
    ctx.body = okMsg;
  }

  @request('get', '/internet/indexItem/proportion')
  @summary('今日新增占比情况')
  @tag
  static async proportion(ctx) {
    okMsg.data = Mock.mock({
      'data': {
        'category': ['数量'],
        'legend': ['全部', '今日新增'],
        'series': [
          {
            'data': /(212|58|132|47|15)/,
            'name': '今日新增'
          },
          {
            'data': /(432|347|464|586|731)/,
            'name': '全部'
          }
        ]
      }
    }).data;
    lib.creatJson('/indexItem/proportion', okMsg);
    ctx.body = okMsg;
  }

  @request('get', '/internet/indexItem/information')
  @summary('情报数量统计')
  @tag
  static async information(ctx) {
    okMsg.data = Mock.mock({
      'data': {
        'category|7': [/(周一|周二|周三|周四)/],
        'legend|3': [/(互联网情报|企业情报|数据平台数据|外部资源数据)/],
        'series|3': [
            {
              'name': '互联网情报',
              'data|7': [/(120|132|101|134|90|230|210)/]
            },
            {
              'name': '企业情报',
              'data|7': [/(220|182|191|234|290|330|310)/]
            }
          ]
        }
    }).data;
    lib.creatJson('/indexItem/information', okMsg);
    ctx.body = okMsg;
  }

  @request('get', '/internet/indexItem/transmission')
  @summary('数据传输情况')
  @tag
  static async transmission(ctx) {
    okMsg.data = Mock.mock({
      'data': {
        'category|7': [/(10\/17|10\/16|10\/18|10\/19|10\/20)/],
        'legend|2': [/(接入量|导出量)/],
        'series|2': [
          {
            'name': '接入量',
            'data|6': [/(200|300|350|400|600|560)/]
          },
          {
            'name': '导出量',
            'data|6': [/(150|280|320|360|550|500)/]
          }
        ]
      }
    }).data;
    lib.creatJson('/indexItem/transmission', okMsg);
    ctx.body = okMsg;
  }
}
