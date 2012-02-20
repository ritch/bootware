
/**
 * Module dependencies.
 */

var express = require('express')
  , bootware = require('bootware')
;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(bootware({path: 'git://github.com/deployd/bootstrap.git', debug: true}));
  app.use(express.static(__dirname + '/public'));
});

app.listen(3000);

console.log('Express server listening on port 3000 - with bootstrap available at /bootstrap.css');
