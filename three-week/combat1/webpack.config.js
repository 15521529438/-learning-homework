'use strict'
const path = require('path')
const config = require('./config')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const uglifyJsPlugin = webpack.optimize.uglifyJsPlugin;


module.exports = {
  entry: {
    app: './app_o.js'
  },
  output: {
    path: __dirname + '/build/',
    filename: 'script/[name]-[hash].js',
    // publicPath: process.env.NODE_ENV === 'production'
    //   ? config.build.assetsPublicPath
    //   : config.dev.assetsPublicPath
  },
   mode: 'development',
   optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
   plugins: [
  //将资源打进html内
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/views.index.html'
    }),
    //css打包
    // new ExtractTextPlugin('style/[name].css'),
     new ExtractTextPlugin("style.css", {
            allChunks: true,
            disable: false
        }),
    //提取公共代码
    // new webpack.optimize.CommonsChunkPlugin({
    //   name:'vendor',
    //   filename:'[name].[hash:8].js',
    //   minChunks:2,
    // }),

  //   optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         chunks: "initial",
  //         minChunks: 2,
  //         maxInitialRequests: 5, // The default limit is too small to showcase the effect
  //         minSize: 0 // This is example is too small to create commons chunks
  //       },
  //       vendor: {
  //         test: /node_modules/,
  //         chunks: "initial",
  //         name: "vendor",
  //         priority: 10,
  //         enforce: true
  //       }
  //     }
  //   }
  // },
    
    //压缩资源
    // new uglifyJsPlugin({
    //    compress:{
    //     warnings:false
    //   }
    // })
  ],
  module: {
   rules: [
        { test: /\.tsx?$/, loader: ['ts-loader'] },
        { test: /\.css$/, loader: "style-loader!css-loader" },
        {
            test: /\.scss$/, use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        },
        { test: /\.(otf|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'file-loader?name=./Scripts/dist/[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['.js','.css']
  }
}
