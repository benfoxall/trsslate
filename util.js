var log = exports.log = function(){
	try{
		console.log.apply(this,arguments)
	} catch(err) {
		//now what?
	}
}
exports.error = function(message,output){
	log('ERROR: ' + message)
	if(output != undefined){
		output.send('An error occured: ' + message + '\n')
	}
}