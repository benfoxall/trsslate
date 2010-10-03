var express = require('express');
var request = require('request');
var trsslate = require('./trsslate').trsslate;

var app = express.createServer();

app.get('/',function(req,res){
	res.send("<!DOCTYPE html><html><head><title>trsslate</title><style type=\"text/css\" media=\"screen\">body{font-family:Helvetica,Arial,sans-serif;font-size:1.5em;}label{display:block;margin-top:1em;}input{font-size:1.4em;display:inline;height:40px;border:1px solid #ccc;}#u{width:20em;}</style></head><body><h1>Trsslate</h1><form method=\"get\" action=\"pre\"><p><label for=\"u\">Feed URL</label><input type=\"url\" name=\"u\" value=\"\" id=\"u\" placeholder=\"http://yoursite/feed.xml\"><label for=\"s\">Selector</label><input type=\"text\" name=\"s\" id=\"s\" value=\"\" placeholder=\"#content > img\"><input type=\"submit\" value=\"&raquo;\"></p></form></body></html>");
})

app.get('/pre', function(req, res){
	// console.log(req)
	
	uri = req.query['u'];
	selector = req.query['s'];
	
	console.log("URI=",uri, ",Selector=", selector);
	
	m = this;
	request({uri:uri}, function(error,response,body){
		if (!error && response.statusCode == 200) {
			trsslate(body,selector,res);
		} else {
			m.send("Error: " +  response)
		}
	})
});

app.listen(80);


