var http = require('http'),
	parse_url = require('url').parse,
	jsdom = require('jsdom').jsdom,
	Cache = require('./cache.js').Cache;

(function(){
	
	var fetch = function(url_str,success,failure,max_redirects){
		if(max_redirects && max_redirects < 0){
			failure('Max Redirects')
		}
		
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
	
	var fetch_cached = function(expire_time, url, success, failure){
		Cache(url,expire_time).on('miss',function(update_cache){
			fetch(url, update_cache, failure)
		}).on('value', success);
	}
	
	var fetchDOM = function(url,success,failure){
		fetch_cached(0, url,function(page){
			try{
				success(jsdom(page))
			} catch (e){
				failure("couldn't parse response dom: " + e)
			}
		},failure)
	}
	
	
	
	exports.fetchDOM = fetchDOM;
	exports.fetch = fetch;
	exports.fetch_cached = fetch_cached;
})();




/*

Usage 

fetchDOM('http://google.com/',function(dom){
	console.log('Dom : ' + dom.innerHTML)
},function(error){
	console.log('Failed : ' + error)
})

*/