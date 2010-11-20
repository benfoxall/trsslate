require.paths.unshift(__dirname); //make local paths accessible

var express = require('express');
var request = require('request');
var trsslate = require('./trsslate').trsslate;
var log = require('./util').log
var error = require('./util').error

var app = express.createServer();

app.get('/',function(req,res){
	res.send('<!DOCTYPE html><html><head><title>trsslate</title><style type="text/css" media="screen">body{font-family:Helvetica,Arial,sans-serif;font-size:1.5em;}label{display:block;margin-top:1em;}input{font-size:1.4em;display:inline;height:40px;border:1px solid #ccc;}#u{width:20em;}</style></head><body><h1>Trsslate</h1><form method="get" action="f"><p><label for="u">Feed URL</label><input type="url" name="u" value="" id="u" placeholder="http://yoursite/feed.xml"><label for="s">Selector</label><input type="text" name="s" id="s" value="" placeholder="#content > img"><input type="submit" value="&raquo;"></p></form></body></html>');
})

app.get('/f', function(req, res){
		uri = req.query['u'];
		selector = req.query['s'];
		
		log('** >>', uri, selector, req.socket.remoteAddress, (new Date()).toUTCString());
		trsslate(uri,selector,res)
});

port = process.argv[2] || 3000;

app.listen(port)

console.log("started")



// exit if any js file or template file is changed.
// it is ok because this script encapsualated in a batch while(true);
// so it runs again after it exits.
// var autoexit_watch=require('autoexit').watch;
// //
// var on_autoexit=function (filename) { } // if it returns false it means to ignore exit this time;  
// autoexit_watch(__dirname,".js", on_autoexit);
// //autoexit_watch(__dirname+"/templates",".html", on_autoexit);
// 
