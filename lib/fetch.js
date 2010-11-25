var http = require('http'),
	parse_url = require('url').parse,
	jsdom = require('jsdom').jsdom;


(function(){
	
	var fetch = function(url_str,success,failure,max_redirects){
		
		url = parse_url(url_str);
		client = http.createClient(80, url.host);
		client.on('error',failure)
		
		path = url.pathname + (url.search ? url.search : '');
		
		// attempt to connect to the host
		request = client.request('GET', path,{'host': url.host});
		
		//deal with the response
		request.on('response', function(response){
			response.setEncoding('utf8');
			switch (response.statusCode){
				case 200:
					var data = ''
					response.on('data', function (chunk) {
						data += chunk;
					});
				    response.on('end', function() {
						success(data)
					});
				
				break;
				case 301: case 302: case 306:
					fetch(response.headers.location,success,failure, (max_redirects || 5) - 1)
				break;
				default:
					failure('Response statusCode: ' + response.statusCode)
			}
		}).on('error',failure).on('clientError',failure).end();
		
	}
	
	var fetchDOM = function(url,success,failure){
		fetch(url,function(page){
			try{
				success(jsdom(page))
			} catch (e){
				failure("couldn't parse response dom: " + e)
			}
		},failure)
	}
	
	
	
	exports.fetchDOM = fetchDOM;
	exports.fetch = fetch;
	
})();




/*

Usage 

fetchDOM('http://google.com/',function(dom){
	console.log('Dom : ' + dom.innerHTML)
},function(error){
	console.log('Failed : ' + error)
})

*/