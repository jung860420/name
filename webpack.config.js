import config from './config';

import webpack from 'webpack';

module.exports = {
    entry: './src/'+config.dir+'/js/'+config.dir+'/main.js',

    output: {
        path: __dirname + '/dist/'+config.dir+'/js/'+config.dir,
        filename: config.dir+'.min.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};