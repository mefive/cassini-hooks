const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: './index',
  },

  module: {
    rules: [
      {
        test: /\.([jt])sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  context: path.resolve(__dirname, './src'),

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  devtool: 'source-map',

  devServer: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:1986',
    },
  },

  plugins: [
    new HtmlWebpackPlugin(),
  ],
};
