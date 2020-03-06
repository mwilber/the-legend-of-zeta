const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config.common');

module.exports = merge(webpackConfig, {

    mode: 'development',

    devtool: 'source-map',

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: '[name].js'
    },

    devServer: {
        host: 'localhost'
    },

});
