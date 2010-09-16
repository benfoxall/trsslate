var Apricot = require('apricot').Apricot;

exports.trsslate = function(rss,selector,meryl_h){
	var return_str = ''
	
	var links = rss.
			substring(rss.indexOf('<item')).
			match(/<link>([^<]*)<\/link>/g).
			map(function(m){return m.
				match('>(.*)<')[1]}
			);
	
	i = 0;
	
	//this till read the rss to a tag
	function read(tag){
		to = (tag == undefined) ? rss.substring(i).length : rss.substring(i).indexOf('<'+tag)
		return rss.substring(i, i += to);
	}
	function out(str){
		return return_str += str
	}
	

	
	function consume(links){
		out(read('item'));
		
		link = links.shift();
		console.log('checking ',link)
		
		if(link){
			out(read('description'));
			read('/description') //skip
			out('<description>')
			
			Apricot.open(link, function(doc) {
				doc.find(selector);
				content = '';
				doc.each(function(e){
					content += e.innerHTML
				});
				out(content);
			consume(links);
			});
		} else {
			var ret = out(read());
			if(meryl_h != undefined){
				meryl_h.send(ret);
			} else {	
				console.log(ret);
			}
		}
	}
	
	consume(links);
	
}