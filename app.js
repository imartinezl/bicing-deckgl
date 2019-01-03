var app = require('./app/server.js').app()
,port = process.env.PORT || 8080

app.listen(port,function(err){
	if (err) {
		return console.error(err)
	}
	console.log('Listening on '+ port)
})
