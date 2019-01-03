var express = require('express')
,path = require('path')

module.exports = {
	app: function(){
		var app = express()

		var publicPath = express.static(path.join(__dirname,'../dist'))
			,indexPath = path.join(__dirname,'../dist/index.html')

		app.use('/dist',publicPath)
		app.get('/', function(req,res){
			res.sendFile(indexPath)
		})

		return app
	}
}
