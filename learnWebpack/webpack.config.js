const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/react.js",
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/template.html" }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          filename: "react.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/]react[\\/]/,
        },
        "react-dom": {
          filename: "react-dom.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
        },
      },
    },
  },
  devServer: {
    port: 8000, // 顺便更改一下端口
    hot: true,
  },
};
