const path = require('path');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config.common');

module.exports = merge(webpackConfig, {

    mode: 'production',

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
    ]

});
