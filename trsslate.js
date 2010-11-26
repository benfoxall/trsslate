var	htmlparser = require('./lib/node-htmlparser'),
	sys = require('sys'),
	log = require('./util').log,
	error = require('./util').error,
	fs = require("fs"),
	fetcher = require('./lib/fetch.js')

var trsslate = function(feed_url,selector,output){
	
	var handler = new htmlparser.RssHandler(function(err,rss){
		// TODO if(err)
		if(err || (rss.items == undefined)){
			error("Could not parse rss",output)
		} else {
			var count = rss.items.length;
			for (var i=0; i < rss.items.length; i++) {
				appendDom(rss.items[i],function(){
					if(count-- == 1){
						render(rss,selector,output);
					}
				})
			};
		}
	})
	
	
	var parser = new htmlparser.Parser(handler);
	
	fetcher.fetch(feed_url,function(rss){
		parser.parseComplete(rss)
	},error);

}

//append the dom to each item
var appendDom = function(item,callback){
	fetcher.fetchDOM(item.link,function(dom){
		item.page_dom = dom
		callback.call();
	},function(err){
		callback.call();
	})
}




/* TODO : refactor this...*/
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
				console.log(selector, ' matched ', elements.length, 'from', item.link)
				output.write('	<description><![CDATA[')
				for (var x = 0; x < elements.length; x++) {
					output.write(elements[x].outerHTML)
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


exports.trsslate = trsslate;