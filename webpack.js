const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

// https://nodejs.org/docs/latest-v20.x/api/crypto.html
// https://webpack.js.org/guides/shimming/#node-built-ins
// https://stackoverflow.com/questions/58104131/add-fallback-typings-only-of-untyped-modules

module.exports = {
  context: __dirname,
  entry: "./src/index.html", // "src/index.js"
  output: {
    path: path.join(__dirname, "docs"), // "build"
    filename: "index.html", // "main.js"
    publicPath: "/", // "/"
  },
  target: "web",
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", //3. Inject styles into DOM
          "css-loader", //2. Turns css into commonjs
          "sass-loader", //1. Turns sass into css
        ],
      },
      {
        test: /\.(png|jp?g|svg|gif)?$/,
        use: {
          loader: "file-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, "public/index.html"),
      filename: "index.html",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      tls: "empty",
      child_process: false,
      util: require.resolve("util/"),
      buffer: require.resolve("buffer"),
      assert: require.resolve("assert/"),
      http: require.resolve("stream-http"),
      path: require.resolve("path-browserify"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      "crypto-browserify": require.resolve("crypto-browserify"),
      os: require.resolve("os-browserify/browser"),
    },
  },
};
