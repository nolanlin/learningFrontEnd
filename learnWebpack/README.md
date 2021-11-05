# Webpack - 奥利奥

## 从 0 到 1

1. yarn init

- 生成 package.json

2. yarn add webpack webpack-cli -D
3. 新建 webpack.config.js

```js
// webpack.config.js
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "main.js",
  },
};
// package.json
"scripts": {
  "build": "webpack"
}
```

4. yarn add @babel/core @babel/preset-env babel-loader -D

- 添加 ES6 转换能力

- yarn add @babel/plugin-proposal-decorators -D
- 添加装饰器

```js
// webpack.config.js

{
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
            plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
          },
        },
      },
    ];
  }
}
```

5. yarn add react react-dom @babel/preset-react -S

- 添加 react 脚手架

```js
// 使用缓存包
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        filename: 'vendor.js',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/
      },
    }
  }
}
```

6.yarn add style-loader css-loader -D

- yarn add mini-css-extract-plugin -D

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
// module.rules
// MiniCssExtractPlugin.loader 代替 style-loader
```

7. yarn add html-webpack-plugin -D

- 自动引入脚本和样式表，自动打包最终的 index.html

- 新建模板 template.html

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
plugins:[
    new HtmlWebpackPlugin({
      template: './template.html'
    })
],
```

8. yarn add webpack-cli webpack-dev-server -D

```js
// package.json
"scripts": {
    "start": "webpack serve"
 }
// webpack.config.js
{
  devServer: {
    port: 8000,
    hot: true
  }
}
```

9. yarn add @babel/plugin-transform-runtime -D

- 将使用率高、加载时间长的组件代码独立出去
