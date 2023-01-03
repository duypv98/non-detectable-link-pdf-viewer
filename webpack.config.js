const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * @returns {import("webpack").Configuration}
 */
module.exports = (env, argv) => {
  const isDev = argv.mode === "development";
  const basePlugins = [
    new MiniCssExtractPlugin({
      filename: isDev ? "css/site.css" : "index.min.css"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      filename: "index.html"
    }),
    new webpack.ProgressPlugin()
  ];
  const devPlugins = [
    ...basePlugins
  ];
  const prodPlugins = [
    ...basePlugins,
    new CleanWebpackPlugin()
  ]
  return {
    entry: ["./index.js"],
    output: {
      filename: "index.bundle.js",
      path: path.resolve(__dirname, "dist"),
      library: "KPDFViewer"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { "runtime": "automatic" }],
                "@babel/preset-flow"
              ],
              plugins: [
                "@babel/transform-runtime"
              ]
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          type: "asset/resource"
        }
      ]
    },
    resolve: {
      extensions: [".jsx", ".js"],
      alias: {
        "@@": path.resolve()
      },
      fallback: { crypto: false }
    },
    devtool: isDev ? "source-map" : false,
    devServer: {
      static: {
        directory: path.join(__dirname, "public")
      },
      port: 3000,
      compress: true,
      historyApiFallback: true,
      hot: true
    },
    plugins: isDev ? devPlugins : prodPlugins,
    performance: { maxEntrypointSize: 800000 }
  }
}