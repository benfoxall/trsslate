var sys = require('sys'),
events = require('events'),
nMemcached = require('node-memcached/nMemcached.js');


var memcached = new nMemcached('127.0.0.1:11211');
memcached.on('failure', function( details ){ sys.error( "Server " + details.server + "went down due to: " + details.messages.join( '' ) ) });
memcached.on('reconnecting', function( details ){ sys.debug( "Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms")})

var Cache = function(key, expire){
	if (!(this instanceof Cache)) return new Cache(key, expire);
	events.EventEmitter.call(this);
	
	var self = this;
	
	// setTimeout(function(){
	// 	self.emit('miss', function(result){
	// 		self.emit('value', result)
	// 	})
	// },10);
	
	/*
		attempt to get from memcache
		
		- if we couldn't connect to memcache
			read from emit
		
		- if we do :
			return cached version
		
		- if not :
			read from emit
			- return
			save to cache
		
	*/
	
	memcached.get(key, function( err, result ){
		if(err == false){
			setTimeout(function(){
				self.emit('miss', function(cval){
					self.emit('value', cval)
				})
				console.log('--cache-off:',key)
			},10)
		} else if(result){
			self.emit('value', result)
			console.log('--cache-HIT:',key)
		} else {
			self.emit('miss', function(cval){
				self.emit('value', cval)
				memcached.set(key, cval, expire || 0)
			})
			console.log('--cache-miss:', key);
		}
		
	});
}

sys.inherits(Cache, events.EventEmitter);

exports.Cache = Cache