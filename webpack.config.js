"use strict";
const webpack = require('webpack');
const path = require('path');

const commonConfig = {
    // devtool: 'source-map',
    // module: {
    //     rules: [{
    //         test: /\.js$/,
    //         exclude: /(node_modules|bower_components)/,
    //         use: {
    //             loader: 'babel-loader',
    //             options: {
    //                 presets: ['es2015']
    //             }
    //         }
    //     }]
    // }
};

const gameConfig = Object.assign({}, commonConfig, {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'boomerang.js'
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
            exclude: /(node_modules|bower_components)/,
        })
    ],
});

module.exports = [gameConfig];