// const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const LiveReloadPlugin = require('webpack-livereload-plugin');
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
require('@babel/polyfill');

module.exports = {
  devtool: 'sourcemap',
  mode: 'development',
  entry: ["@babel/polyfill", "./src/conman.module.js"],
  output: {
    filename: "./conman.module.js",
    // path: path.resolve(__dirname, 'dist'),
    // publicPath: '/talent-network/assets/'
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'angularjs-template-loader',
            options: {
              relativeTo: path.resolve(__dirname, 'src')
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                ["babel-plugin-root-import"],
                ["@babel/plugin-transform-async-to-generator"],
                ["@babel/plugin-proposal-optional-chaining"],
              ]
            }

          },"source-map-loader",]
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader?variable=data'
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|eot|gif|otf|png|svg|ttf|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]"
          }
        }
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "[name].conman.module.css",
      allChunks: true,
    }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'demo/index.ejs'),
    //   inject: true,
    //   templateParameters: {
    //     'env': 'dev'
    //   },
    // }),
    // new LiveReloadPlugin({
    //   port: 35736
    // }),
    // new MonacoWebpackPlugin({
		// 	languages: ["typescript", "javascript", "css", "html"],
		// })
  ],
};
