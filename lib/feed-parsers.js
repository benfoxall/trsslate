var xml = require("./lib/node-xml");

/*
This takes a feed and splits it into different buffers to be dealt with independantly
*/

new xml.SaxParser(function(cb) {
	//start 
	var sections = []
	var sofar = ''
	
	//on '<item>', push sofar onto the sections
	sections.unshift(sofar)
	sofar = ''
	
	
	//on everything else
	sofar += thing
	
	
});