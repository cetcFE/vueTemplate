var path = require('path');
var fs = require('fs');
var os = require('os');
var Mock = require('mockjs');
var nodeExcel = require('excel-export');

module.exports = {
  creatJson(url, data) {
    let urls = url.split('/');
    let ctrl = urls[1];
    let action = urls[2];
    let ds = "/";
    if (os.platform() == 'win32') {
      ds = "\\";
    }
    let jsons = path.resolve(__dirname, '../../') + ds + 'static' + ds + 'jsons';
    let dir = jsons + ds + ctrl;
    let json = "";
    json = dir + ds + action + ".json";
    if (fs.existsSync(dir)) {
      if (fs.existsSync(json)) return;
    } else {
      if (!fs.existsSync(jsons)) {
        fs.mkdirSync(jsons);
      }
      fs.mkdirSync(dir);
    }
    fs.writeFile(json, JSON.stringify(data));
  },
  downfile (ctx) {
    var r = Math.floor(Math.random() * 50) + 1;
    var conf = Mock.mock({
      'cols': function () {
        var arr = [];
        for (let i = 0; i < r; i++) {
          arr.push(
            {
              caption: Mock.mock(/[0-9a-zA-Z]/),
              type: 'string'
            }
          );
        }
        return arr;
      },
      'rows': function () {
        var r2 = Math.floor(Math.random() * 40) + 1;
        var arr = [];
        for (let i = 0; i < r2; i++) {
          let x = [];
          for (let m = 0; m < r; m++) {
            x.push(Mock.mock(/[0-9a-zA-Z]/));
          }
          arr.push(x);
        }
        return arr;
      }
    });
    var result = nodeExcel.execute(conf);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', 'attachment; filename=' + 'template.xlsx');
    ctx.set('x-filename', 'template.xlsx');
    ctx.body = result;
  }
}
