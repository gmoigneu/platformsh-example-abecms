# recipe-pm2
This Abe recipe demonstrates how to deploy your Abe project admin in production with [pm2](https://github.com/Unitech/pm2).

This recipe will be split into 3 parts:

- Creation of your package.json for your project
- Creation of your pm2 start script
- Creation of your pm2 config file

## package.json

If you haven not created a package.json yet, do your homework :) (npm init)

Then you'll add the following dependencies:

```javascript
{
  "dependencies": {
    "abecms": "2.14.5",
    "babel-preset-es2015": "6.6.0",
    "pm2": "2.2.0",
    "cli-color": "1.1.0"
  }
}
``` 

(Run `npm i` to install dependencies).

### abecms
This will install Abe in your project. You could dcide to use an Abe installed globally, but this is not a best practice: We strongly recommend to have a local Abe installation for each of your projects. This way, you'll be able to select different versions of Abe per project.
Note also that we recommend to fix the Abe version: Letting a * for the patches to be applied is ok, although in production, a fully fixed version (2.14.5) is better.

### babel-preset-es2015
Abe is using Babel to transpile the code (we're ECMASCRIPT 2016). If you want to create scripts in your own repo which will extend Abe, add this mandatory dependency to be able to transpile your code.

### pm2
We use PM2 in this recipe, so you'd better install it ! :)

### cli-color
This is not mandatory. This dependency will colorize the Abe messages in your console.

Once done, let's add a npm start script in package.json:

```javascript
  "scripts": {
    "start": "./start.js"
  },
```
This will ease your deployment automation. To start Abe admin, you'll just have to enter : npm start

##PM2 script

Add your pm2 start script by creating a start.js file in your project (you can name it as you want and put it in whatever directory you want. Just remember to adjust your package.json accordingly (by modifying the path to your "start" script.

Put the following code in your start.js file. This code will take in charge the startup of PM2:

```javascript
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
```

## Add pm2-config.json

This is the config file for pm2. See pm2 process file [documentation](http://pm2.keymetrics.io/docs/usage/application-declaration/) for more details.
As a summary, name will give a precise name to your pm2 instance of the project, script is the commnd to launch to start Abe, and we're not in cluster mode (Not possible yet because of the stateful paradigm in Abe).
Last but not least, you can choose the port on which Abe admin will listen (here it's 8012)

```javascript
{
  "name": "pm2processname",
  "script": "./node_modules/abe-cli/dist/server/app.js",
  "args": "serve",
  "nodeArgs": ["--harmony","--max-old-space-size=2048"], # You can pass node arguments here
  "log_date_format" : "YYYY-MM-DD HH:mm Z", # Pm2 log format
  "exec_mode": "fork", # Pm2 exec mode (fork or cluster)
  "instances": "-1", # if cluster mode number of intances -1 = server number of cpus -1 
  "env": {
    "PORT": "8012" # local port to run Abe
  }
}
```

Then run `npm start`

> That's all ! You're ready to go and launch your production server. As a recommandation, we will show you how to configure a reverse proxy un the following chapter.

# Apache as a reverse proxy

# Nginx as a reverse proxy
