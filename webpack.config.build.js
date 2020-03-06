const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpackConfig = require('./webpack.config.common');

const dirAssets = path.join(__dirname, 'assets');
const webManifest = path.join(__dirname, 'manifest.json');

module.exports = merge(webpackConfig, {

    mode: 'production',

    devtool: '',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: (chunkData) => {
            return chunkData.chunk.name === 'service-worker'
                ? '[name].js'
                : '[name].[chunkhash:8].js';
        }
    },

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
			{ 
				from: dirAssets,
				to: path.resolve(__dirname, 'dist', 'assets'),
            },
            { 
				from: webManifest,
				to: path.resolve(__dirname, 'dist'),
			}
		]),
    ]

});
