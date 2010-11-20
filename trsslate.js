var select = require('soupselect').select,
	htmlparser = require('./lib/node-htmlparser'),
	http = require('http'),
	sys = require('sys'),
	parse_url = require('url').parse,
	log = require('./util').log,
	// sizzle = require('node-sizzle').sizzleInit,
	error = require('./util').error,
	fs = require("fs");

var jsdom = require('jsdom').jsdom;

var update = function(item,callback){
	
	var url = parse_url(item.link);
	var client = http.createClient(80, url.host);
	var path = url.pathname + (url.search ? url.search : '');
	var request = client.request('GET', path,{'host': url.host});
	log("<- ", item.link)
	
	request.on('response', function (response) {
		log("-> ", item.link)
		var back = "";
		response.setEncoding('utf8');
		switch (response.statusCode){
			case 200:
				response.on('data', function (chunk) {
					back += chunk;
				});
			    response.on('end', function() {
				    item.page_dom = jsdom(back);
					callback.call()
				});
			break;
			case 301: case 302:
				log('RR ', item.link, ' -> ', response.headers.location)
				item.link = response.headers.location
				update(item,callback)
			break;
			default:
				log("Got response " + response.statusCode)
				callback.call()
		}
	});
	request.end();
	
	
}

var render = function(rss,selector,output){
	try{
	output.writeHead(200,{ 'Content-Type': 'application/xml; charset=utf-8' })
	output.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
	output.write('<rss version="2.0">\n')
	output.write('<channel>\n')
	output.write('	<title>'+rss.title+'</title>\n')
	output.write('	<description>'+rss.description+'</description>\n')
	output.write('	<link>'+rss.link+'</link>\n')
	
	for (var i=0; i < rss.items.length; i++) {
		var item = rss.items[i];
		
		output.write('<item>\n')
		output.write('	<title>'+item.title+'</title>\n')
		
		if(item.page_dom){
			try{
				
				var document = item.page_dom;
				var window = {}
				
				//load sizzle
				eval(fs.readFileSync("./deps/sizzle/sizzle.js", "utf8"))
				
				// console.log("selector : " + selector);
				var elements = window.Sizzle(selector);
				console.log("found " + elements.length, 'with', selector)
				output.write('	<description><![CDATA[')
				for (var x = 0; x < elements.length; x++) {
					output.write(elements[x].outerHTML)
					console.log('Loop ', x, elements[x].outerHTML)
				};
				output.write(']]></description>\n')
			} catch (e){
				console.log(e.message)
				output.write('	<description>An error occured scraping this page. (trsslate)</description>\n')
			}
		} else {
			output.write('	<description>An error occured fetching this page. (trsslate)</description>\n')
		}
		
		output.write('	<link>'+item.link+'</link>\n')
		output.write('	<guid>'+item.id+'</guid>\n')
		output.write('	<pubDate>'+item.pubDate+'</pubDate>\n')
		output.write('</item>\n')
	};
	
	output.write('</channel>\n')
	output.write('</rss>\n')
	output.end();
	log('** << rendered	', (new Date()).toUTCString())
	}
	catch(e){
		log('ERROR OCCURED RENDERING')
		log(e.stack)
		output.send('An error occured')
	}
}


var trsslate = function(feed_url,selector,output,max_directs){
	if(max_directs && max_directs < 1){
		return error('Max Redirects Reached')
	}
	
	var url = parse_url(feed_url);
	
	var client = http.createClient(80, url.host);
	var path = url.pathname + (url.search ? url.search : '');
	var request = client.request('GET', path,{'host': url.host});
	
	
	var handler = new htmlparser.RssHandler(function(err,rss){
		// TODO if(err)
		if(err || (rss.items == undefined)){
			error("Could not parse rss",output)
		} else {
			var count = rss.items.length;
			var added_callback = function(){
				count--
				if(count == 0){
					log('** << rendering', rss.link)
					render(rss,selector,output);
				}
			}
			for (var i=0; i < rss.items.length; i++) {
				update(rss.items[i],added_callback)
			};
		}
	})
	
	
	
	var parser = new htmlparser.Parser(handler);
	
	request.on('response', function (response) {
		switch (response.statusCode){
			case 200:
				response.setEncoding('utf8');
				response.on('data', function (chunk) {
				    parser.parseChunk(chunk)
				});
			    response.on('end', function() {
					parser.done();
				});
				break;
			case 302:
			case 303:
				log("Redirect> ", response.headers.location)
				trsslate(response.headers.location,selector,output);
				break;
			default :
				error('RSS returned with status ' + response.statusCode ,output);
				break;
		}
	});
	request.end();
}


exports.trsslate = trsslate;