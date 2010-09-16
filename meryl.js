var meryl = require('meryl'),
trsslate = require('./trsslate').trsslate,
request = require('request');

meryl.h('GET /',function(){
	this.send("<!DOCTYPE html><html><head><title>trsslate</title><style type=\"text/css\" media=\"screen\">body{font-family:Helvetica,Arial,sans-serif;font-size:1.5em;}label{display:block;margin-top:1em;}input{font-size:1.4em;display:inline;height:40px;border:1px solid #ccc;}#u{width:20em;}</style></head><body><h1>Trsslate</h1><form method=\"get\" action=\"pre\"><p><label for=\"u\">Feed URL</label><input type=\"url\" name=\"u\" value=\"\" id=\"u\" placeholder=\"http://yoursite/feed.xml\"><label for=\"s\">Selector</label><input type=\"text\" name=\"s\" id=\"s\" value=\"\" placeholder=\"#content > img\"><input type=\"submit\" value=\"&raquo;\"></p></form></body></html>");
})


meryl.h('GET /pre', function(){
	var uri = this.params.u;
	var selector = this.params.s;
	console.log("URI=",uri, ",Selector=", selector);
	
	var m = this;
	this.headers['Content-Type'] = 'application/xml';
	
	request({uri:uri}, function(error,response,body){
		if (!error && response.statusCode == 200) {
			trsslate(body,selector,m);
		} else {
			m.send("Error: " +  response)
		}
	})
})


require('http').createServer(meryl.cgi()).listen(3000)