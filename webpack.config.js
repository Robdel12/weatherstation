const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/client/index.html",
  filename: "index.html",
  inject: "body"
});

const CopyImages = new CopyWebpackPlugin([
  { from: "src/client/images", to: "images" }
]);

let plugins = [HtmlWebpackPluginConfig, CopyImages];

if (isProduction) {
  plugins.push(new UglifyJSPlugin());
}

module.exports = {
  mode: "development",
  entry: "./src/client/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins
};
