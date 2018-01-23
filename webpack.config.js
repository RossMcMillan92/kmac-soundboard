const path = require("path")
const webpack = require("webpack")
const autoprefixer = require("autoprefixer")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")

const nodeEnv = process.env.NODE_ENV
const isProduction = nodeEnv === "production"

const sourceDir = "/src"
const buildDir = "/www"
const entryJSFile = `${sourceDir}/scripts/index.js`
const entryCSSFile = `${sourceDir}/styles/main.sass`
const outputJSFile = "[name].[chunkhash].js"
const outputJSFileDev = "[name].js"
const outputCSSFile = "app.[contenthash].css"
const outputCSSFileDev = "app.css"
const externalCSS = new ExtractTextPlugin({
  filename: isProduction ? outputCSSFile : outputCSSFileDev,
  disable: false,
  allChunks: true
})
const cwd = process.cwd()

const modulePaths = [
  path.join(cwd, `/src/`),
  path.join(cwd, `/src/scripts/app/`),
  path.join(cwd, `/src/styles/styles/`)
]

const config = env => {
  const isPhoneGap = env.isPhoneGap === "true"
  const assetPathPrepend = isPhoneGap ? "" : "/"

  return {
    entry: {
      main: [path.join(cwd, entryCSSFile), path.join(cwd, entryJSFile)],
      vendorReact: ["react", "react-dom"],
      vendor: ["immutable-ext", "ramda-fantasy"]
    },
    output: {
      filename: isProduction ? outputJSFile : outputJSFileDev,
      path: path.join(cwd, buildDir),
      publicPath: assetPathPrepend
    },
    resolve: {
      extensions: [".js", ".jsx", ".scss"],
      alias: {
        react: path.join(cwd, "node_modules/react")
      },
      modules: [...modulePaths, "node_modules"]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["babel-loader"],
          exclude: /.*node_modules((?!immutable-ext).)*$/
        },
        {
          test: /\.(sass|s?css)$/,
          exclude: /node_modules/,
          use: ["css-hot-loader"].concat(
            ExtractTextPlugin.extract({
              use: [
                {
                  loader: "css-loader",
                  options: {
                    minimize: isProduction,
                    debug: !isProduction
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    plugins: loader => [
                      autoprefixer({
                        browsers: ["last 2 versions", "iOS 8"]
                      })
                    ]
                  }
                },
                {
                  loader: "sass-loader"
                }
              ]
            })
          )
        },
        {
          test: /\.((?!scss|sass|js|json).)*$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            minimize: true
          }
        }
      ]
    },
    devServer: {
      compress: isProduction,
      port: 3002,
      host: "0.0.0.0",
      publicPath: "/",
      contentBase: path.join(cwd, buildDir),
      historyApiFallback: true,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: "\u001b[32m"
        }
      }
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new CopyWebpackPlugin([{ from: "src/static/audio", to: "audio" }]),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(nodeEnv),
        IS_PHONEGAP: JSON.stringify(isPhoneGap),
        "process.env": {
          NODE_ENV: JSON.stringify(nodeEnv)
        }
      }),
      isProduction && new webpack.optimize.ModuleConcatenationPlugin(),
      isProduction &&
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true
          },
          output: {
            comments: false
          }
        }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ["vendor", "vendorReact", "manifest"]
      }),
      new HtmlWebpackPlugin({
        template: "./src/static/index.ejs",
        inject: "body",
        absolutePath: assetPathPrepend,
        isProduction,
        isPhoneGap
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: "defer"
      }),
      externalCSS
      // new BundleAnalyzerPlugin(),
    ].filter(Boolean)
  }
}

module.exports = config
