'use strict';

var clc = require('cli-color');
var pm2 = require('pm2');

var dir = process.cwd();
if(process.env.ROOT) {
  dir = process.env.ROOT
}
dir = dir.replace(/\/$/, '')
console.log("run abe into", clc.green(dir), "folder");

var processFile = require(dir + '/pm2-config.json')
console.log(clc.green('[ pm2-config ]'), JSON.stringify(processFile))

var processName = processFile.name || 'abe'
pm2.connect((err) => {
  if (err instanceof Error) throw err
  var start = pm2.start

  pm2.list(function(err, process_list) {
    var found = false;

    Array.prototype.forEach.call(process_list, function(process) {
      if (process.name === processName) {
        found = true
      }
    })

    var cb = function() {
      if(typeof processFile.env === 'undefined' || processFile.env === null) {
        processFile.env = {}
      }
      processFile.env.ROOT = dir
      console.log(clc.green('[ pm2 ]'), 'start', 'pm2-config.json', JSON.stringify(processFile))
      pm2.start(
        processFile,
        function(err, proc) {
          if (err instanceof Error) throw err

          pm2.list((err, list) => {
             if (err instanceof Error) throw err
            Array.prototype.forEach.call(list, (item) => {
              console.log(clc.green('[ pm2 ]'), '{', '"pid":', item.pid + ',', '"process":', '"' + item.name + '"', '}')
            })
            process.exit(0);
          })
        })
    }

    if (!found) {
      cb()
    }else {
      console.log(clc.green('[ pm2 ]'), 'stop ', processName)
      pm2.delete(processName, function(err, proc) {
        if (err) throw new Error(err);
        console.log(clc.green('[ pm2 ]'), processName,  'server stopped')
        cb()
      });
    }
  });
})