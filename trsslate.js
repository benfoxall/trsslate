var Apricot = require('apricot').Apricot;

exports.trsslate = function(rss,selector,meryl_h){
	
	//this till read the rss to a tag
	function read(o,tag){
		to = (tag ==  undefined) ? o.src.substring(o.i).length : o.src.substring(o.i).indexOf('<'+tag)
		from = o.i;
		to = o.i + to;
		o.i = to;
		return o.src.substring(from,to);
	}

	function consume(obj){
		obj.output += read(obj,'item');
		link = obj.links.shift();
		console.log('checking ',link)
		
		if(link){
			obj.output += read(obj,'description');
			read(obj,'/description'); //skip
			obj.output += '<description><![CDATA['
			
			Apricot.open(link, function(doc) {
				doc.find(selector);
				content = '';
				doc.each(function(e){
					content += e.innerHTML
				});
				obj.output += content;
				obj.output += ']]>'
			consume(obj);
			});
		} else {
			obj.output += read(obj);
			if(obj.m != undefined){
				obj.m.send(obj.output, { 'Content-Type': 'application/xml' }, 200);
			} else {	
				console.log(obj.output);
			}
		}
	}
	
	consume({
		src : rss,
		selector : selector,
		output : '',
		i : 0,
		m : meryl_h,
		links : rss.
				substring(rss.indexOf('<item')).
				match(/<link>([^<]*)<\/link>/g).
				map(function(m){return m.
					match('>(.*)<')[1]})
	});

}