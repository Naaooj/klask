
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const dotenv = require('dotenv').config({path: __dirname + '/.env.dev'});

module.exports = merge(common, {
  mode: 'development',
  entry: {
    client: ['webpack-hot-middleware/client']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed
    })
  ]
});