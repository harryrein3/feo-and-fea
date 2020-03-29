var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}
const isDevelopment = env.NODE_ENV === 'development'

var options = {
  mode: env.NODE_ENV || "development",
  stats: 'verbose',
  entry: {
    contentScript: path.join(__dirname, "src", "cs", "contentScript.js"),
    background: path.join(__dirname, "src", "bg", "background.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\lazy.s[ac]ss$/i,
        use: [
          { 
            loader: 'style-loader', 
            options: {
              injectType: 'lazyStyleTag',
               insert: function (element) {
                 const style = document.querySelector('.travis-jr-root-container');
                 style.appendChild(element)
               }
            } 
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\lazy_page.s[ac]ss$/i,
        use: [
          { 
            loader: 'style-loader', 
            options: {
              injectType: 'lazyStyleTag'
            } 
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                return `images/[${isDevelopment ? 'name' : 'contenthash'}].[ext]`;
              },
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: isDevelopment,
            },
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-react'],
              plugins: [
                'react-hot-loader/babel',
                '@babel/plugin-proposal-class-properties'
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions.map(extension => ("." + extension)).concat([".jsx", ".js", ".css"])
  },
  plugins: [
    // clean the build folder
     new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      to: "manifest.json",
      transform: function (content, path) {
        let existingManifest = JSON.parse(content.toString())
        return Buffer.from(JSON.stringify(
            env.NODE_ENV === "development" ?
              existingManifest :
              {
                ...existingManifest,
                name: 'Popcart'
              }
          ))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),
    new WriteFilePlugin()
  ],
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
