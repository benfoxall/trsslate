require.paths.unshift(__dirname); //make local paths accessible

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
