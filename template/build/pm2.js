#!/usr/bin/env node

var exec = require('child_process').exec

runProxy('pm2 delete all', function () {
  runProxy('pm2 start ./proxy-server/index.js --name="proxy9191"')
})

function runProxy(cmd, callback) {
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      console.log('get weather api error:' + stderr)
    }
    if (callback) callback()
  })
}
