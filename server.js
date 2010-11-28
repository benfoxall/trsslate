// require.paths.unshift(__dirname);

var express = require('express');
var request = require('request');
var trsslate = require('./trsslate').trsslate;
var log = require('./util').log
var error = require('./util').error

var app = express.createServer();

app.configure(function(){
    app.use(express.staticProvider(__dirname + '/public'));
});

app.get('/f', function(req, res){
		uri = req.query['u'];
		selector = req.query['s'];
		
		trsslate(uri,selector,res)
});

port = process.argv[2] || 3000;

app.listen(port)

log('Started trsslate on port ' + port)
