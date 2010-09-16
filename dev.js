var request = require('request'), 
	sys = require('sys'),
	Apricot = require('apricot').Apricot,
	trsslate = require('./trsslate').trsslate;

var uri = 'http://active.cobini.local/posts/feeds/rss.xml';
var selector = '#post-title, div#post-description';

var uri = 'http://feeds.feedburner.com/Explosm'
var selector = '#maincontentx'

request({uri:uri}, function(error,response,body){
	if (!error && response.statusCode == 200) {
		trsslate(body,selector);
	} else {
		sys.puts("ERROR " + response)
	}
})



//
// 
// var next_tag = function(from,text,tag){
// 	var start = text.substring(from).match('<'  + tag + '[^>]*>');
// 	var   end = text.substring(from).match('</' + tag + '[^>]*>');
// 	
// }

/*

	WHAT DO I WANT TO HAPPEN
	
	..GO THROUGH EACH OF THE ITEMS
	links = [0..n]
	
	
	
	
*/

// var next_item = function(from,text){
// 	test = text.substring(from);
// 	
// 	//where the item starts
// 	item = test.match('<item>')
// 	description = test.substring(item.index).match('<description>')
// 	
// 	//what the link is
// 	link = test.match(/<link>([^<])+<\/link>/)
// 	
// 	
// 	console.log('item starts at', item.index);
// 	
// 	
// }

// var content = [];
// 
// var fetch = function(link,selector){
// 	var content = ''
// 	Apricot.open(link, function(doc) {
// 		doc.find('#post-description');
// 		doc.each(function(e){
// 			content += e.innerHTML
// 		});
// 		
// 	});
// 	
// 	
// 	return content;
// }

// var item_links = function(text){
// 	return text.substring(text.indexOf('<item')).match(/<link>([^<]*)<\/link>/g).map(function(m){return m.match('>(.*)<')[1]})
// }

// 
// var trsslate = function(rss,selector){
// 	
// 	var links = rss.
// 			substring(rss.indexOf('<item')).
// 			match(/<link>([^<]*)<\/link>/g).
// 			map(function(m){return m.
// 				match('>(.*)<')[1]}
// 			);
// 	
// 	i = 0;
// 	//this till read the rss to a tag
// 	function read(tag){
// 		to = rss.substring(i).indexOf('<'+tag)
// 		return rss.substring(i, i += to);
// 	}
// 	
// 
// 	
// 	function consume(links){
// 		console.log("OUT", read('item'));
// 		console.log("OUT", read('description'));
// 		console.log("OUT", '<description>')
// 		
// 		read('/description') //skip
// 		
// 		link = links.shift();
// 		
// 		console.log("OUT", link)
// 		
// 		if(link){
// 			Apricot.open(link, function(doc) {
// 				doc.find(selector);
// 				content = '';
// 				doc.each(function(e){
// 					content += e.innerHTML
// 				});
// 				console.log("OUT",content);
// 				consume(links);
// 			});
// 		} else {
// 			console.log("OUT", read('rss'))
// 		}
// 	}
// 	
// 	consume(links);
// 	
// }

/*
APRICOT


piping

print(fire_translation(extract))


/* This turns a document into blocks for use of  */
// blocks = function(documentBuffer){
// 	
// }

/*
var render = function(body, selector){
	
	data = [];
	data << '<xml>....  <items>'
	sections('item').each |s|
		data << '<item>.... <description>'
		s.description 
		s.link
		data << function(){
			
		}
		data << '</description>...</item>'
	end
	data << '</items> ....</xml>'

}

/*
	how this works:

	single linked list
	
	a > b > C > D > e
	
	eg.
	
	'string',function(el){el.callback}
	
	...can be built with
	
	element:
		retrieve = function(url,selector):
			get the url :
				transform response:
					setContent(transformed || '')
	
	...which can be printed out like this (efficiently,  as it will be printed up to the point of the content being created)
	
	element:
		on = function('content', callback){
			this.setCallback = callback;
			if(this.content){
				callback(content); // or this will be sent when the 
			}
		},
		setContent(c){
			content = c;
			callback(content);
		}
	
	outputter(a):
		c = function(element){
			element.on('content', function(){
				output;
				c(element.next);
			})
		}
		c(a)
	


*/


/*

var obj = {
	content : undefined,
	next : undefined,
}
var v_1 = function(doc,selector){
	console.log("----");

	/* we want to split the document into..
	 [
		'<xml> ....
		....
		..<entry>...<description>',
	  	scrape(link, selector, or_content),
	    '</description>...
		...</entry>...',
	]
	
}

*/