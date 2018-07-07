const path = require('path');
const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: [
        //双入口文件
            path.join(__dirname, '../src/public/scripts/index.es6'),
            path.join(__dirname, '../src/public/scripts/indexadd.es6')
        ],
        tag: [
            path.join(__dirname, '../src/public/scripts/tag.es6')
        ]
    },
    output: {
        filename: 'public/scripts/[name]-[hash:5].js',
        path: path.join(__dirname, '../build/')
    },
    module: {
        rules: [{
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        //设置环境
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"dev"',
        }),
        //监测代码改变刷新浏览器，需要基于浏览器livereload插件   可以换成webpack-dev-server来浏览器监听
        new LiveReloadPlugin({
            appendScriptTag: true
        }),
        //抽取css
        new ExtractTextPlugin("public/css/[name]-[hash:5].css"),
        //抽取公共JS
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'public/scripts/common/vendor-[hash:5].min.js',
          }),
        //将打包的文件注入到html
          new HtmlWebpackPlugin({  // Also generate a test.html
            filename: './views/layout.html',   //将下方模块注入的html
            template: 'src/widget/layout.html',  //模块
            inject:false   //是否将依赖注入
          }),
          new HtmlWebpackPlugin({  // Also generate a test.html
            filename: './views/index.html',
            template: 'src/views/index.js',
            inject:false,
            chunks:['vendor','index','tag']    //该注入需要添加的模块
          }),
          new HtmlWebpackPlugin({  // Also generate a test.html
            filename: './widget/index.html',
            template: 'src/widget/index.html',
            inject:false
          }),
    ]
};