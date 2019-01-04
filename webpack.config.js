const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	mode: 'production',
	entry:  './src',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	devServer: {
		contentBase: __dirname + '/dist/',
		compress: false,
		port: 9000
	},
	module: {
		rules: [
		  {
			// Compile ES2015 using buble
			test: /\.js$/,
			loader: 'buble-loader',
			include: [resolve('.')],
			exclude: [/node_modules/],
			options: {
			  objectAssign: 'Object.assign'
			}
		  },
		  {
			test: /\.css$/,
			use: ['style-loader','css-loader'],
		  }
		]
	},
	resolve: {
		alias: {
		  // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
		  'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
		}
	},
	// Optional: Enables reading mapbox token from environment variable
	plugins: [
		new webpack.EnvironmentPlugin(['MapboxAccessToken']),
    	new HtmlWebpackPlugin({
    		title: 'deck.gl example',
    		filename: 'index.html',
    		template: 'src/html/index_template.html',
    	}),
    	new CopyWebpackPlugin(
    		['./src/json/buildings.json','./src/json/stations.json','./src/json/trips_sample.json']
    	)
	],
	optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
}
