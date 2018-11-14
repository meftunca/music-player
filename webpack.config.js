const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: path.join(__dirname, 'src', 'index.js'),
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.(jpe?g|png|gif|svg|mp4)$/i,
				use: 'file-loader'
			},
			{
				test: /\.(ogg|mp3|wav|mpe?g)$/i,
				use: 'file-loader'
			}
		]
	},
	performance: {
		hints: false
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	output: {
		path: path.resolve(__dirname + '/public'),
		filename: 'index.bundle.js'
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	devServer: {
		contentBase: './public',
		hot: true,
		port: 3000
	}
};
