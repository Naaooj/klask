import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { CLIENT } from "./paths"

export default {
  entry: {
    client: ['./src/client/client.ts']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    },
    {
      test: /\.html$/,
      use: 'html-loader'
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ],

    }]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(process.env.PORT),
        DEBUG: JSON.stringify(process.env.DEBUG),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        HOST: JSON.stringify(process.env.HOST)
      }
    }),
    new HtmlWebpackPlugin({
      template: `${CLIENT}/index.html`
    })
  ],
  node: {
    fs: 'empty'
  }
};