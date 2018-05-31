var Mock = require('mockjs');
var fs = require('fs');
var nodeExcel = require('excel-export');
var formidable = require('formidable');
var BufferHelper = require('bufferhelper');
var path = require('path');
var os = require('os');

var app = function () { };

app.prototype = {
  download(req, res) {
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
    // var conf ={};
    // conf.cols = [
    //     {caption:'string', type:'string'},
    //     {caption:'date', type:'date'},
    //     {caption:'bool', type:'bool'},
    //     {caption:'number', type:'number'}
    // ];
    // conf.rows = [
    //     ['pi', (new Date(2013, 4, 1)).getJulian(), true, 3.14],
    //     ["e", (new Date(2012, 4, 1)).getJulian(), false, 2.7182]
    // ];
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "report.xlsx");
    res.setHeader("x-filename", "report.xlsx");
    res.end(result, 'binary');
  },
  async import(req, res, o) {
    var ds = "/";
    var self = this;
    if (os.platform() == 'win32') {
      ds = "\\";
    }
    var dir = path.resolve(__dirname, '../../') + ds + 'jsons';
    var _fileName = o.query.fileName;

    var bufferHelper = new BufferHelper();
    var form = new formidable.IncomingForm();

    form.onPart = function onPart(part) {
      if (part.name != 'data') { // part.name == data的部分才是上传文件流
        return;
      }
      part.addListener('data', function (chunck) {
        bufferHelper.concat(chunck);
      });
      part.addListener('end', function () {
        fs.writeFile(dir + ds + _fileName, bufferHelper.toBuffer(), { flag: 'w' }, function (err) {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          res.write(JSON.stringify({
            status: {
              code: 200,
              msg: 'ok'
            }, data: o.data ? o.data : 0
          }));
          res.end();
        });
      });
    };
    return await form.parse(req, function (err, fields, files) { });
  },
  first(req, res) {
    res.write(JSON.stringify({
      status: {
        code: 200,
        msg: 'ok'
      }, data: { token: Mock.mock(/[0-9a-zA-Z]/) }
    }));
    res.end();
  },
  second(req, res) {
    res.write(JSON.stringify({
      status: {
        code: 200,
        msg: 'ok'
      }, data: { start: 0 }
    }));
    res.end();
  },
  async three(req, res, o) {
    var ds = "/";
    var self = this;
    if (os.platform() == 'win32') {
      ds = "\\";
    }
    var dir = path.resolve(__dirname, '../../') + ds + 'jsons';
    var _fileName = o.query.fileName;

    var bufferHelper = new BufferHelper();
    var form = new formidable.IncomingForm();

    form.onPart = function (part) {
      if (part.name != 'data') { // part.name == data的部分才是上传文件流
        return;
      }
      part.addListener('data', function (chunck) {
        bufferHelper.concat(chunck);
      });
      part.addListener('end', function () {
        fs.writeFile(dir + ds + _fileName, bufferHelper.toBuffer(), { flag: 'a' }, function (err) {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          res.write(JSON.stringify({
            status: {
              code: 200,
              msg: 'ok'
            }, data: o.data ? o.data : 0
          }));
          res.end();
        });
      });
    };
    return await form.parse(req, function (err, fields, files) { });
  }
}

module.exports = new app();
