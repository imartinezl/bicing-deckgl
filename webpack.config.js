const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
	mode: 'production',
	entry:  './app/index.js',
	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, 'dist')
	},
	devtool: 'source-maps',
	devServer: {
		publicPath: "/app/", // here's the change
		contentBase: resolve(__dirname, 'dist'),
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
		new webpack.EnvironmentPlugin(['MapboxAccessToken'])
	],
}
// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG)(env) : CONFIG);

