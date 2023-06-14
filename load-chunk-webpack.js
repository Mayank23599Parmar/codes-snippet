var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {JsonpScriptSrcPlugin} = require('jsonpscriptsrc-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
var config = {
  module: {}
};
const ASSET_PATH = "https://cdn.shopify.com/s/files/1/0997/6284/t/1737/assets/";
module.sorceEnable = false;
function normalizeName(name) {
  const data=["react-redux","react-router"]
  return name.replace(/node_modules/g, "nodemodules").replace(/[\-_.|]+/g, " ")
    .replace(/\b(vendors|nodemodules|js|modules|es)\b/g, "")
    .trim().replace(/ +/g, "-");
}
returnAll = watchFile => {

  var checkoutPage = Object.assign({}, config, {
    entry: "./checkout-javascript/app-checkout.js",
    watch: watchFile,
    output: {
      path: __dirname,
      filename: "theme/assets/theme-checkout.js"
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          sideEffects:true,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: __dirname
              }
            },
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "theme/assets/theme-checkout.css"
      }),
    ]
  });

  var reactApp = Object.assign({}, config, {
    entry: ["@babel/polyfill", "./react/index.js"],
    watch: watchFile,
    
    output: {
      path: __dirname,
     filename: "theme/assets/simply-[name].js",
     publicPath: ASSET_PATH,
    },
    optimization: {
      runtimeChunk:"single",
      sideEffects: true,
      minimize: true,
      namedModules: true,
      namedChunks: true,
      removeAvailableModules: true,
      flagIncludedChunks: true,
      occurrenceOrder: false,
      usedExports: true,
      concatenateModules: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        automaticNameDelimiter: '-',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: 'all',
          },
        },
      },
    },
    devServer: {
      historyApiFallback: true
    },
    module: {
     
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env",'@babel/preset-react'],
              plugins: ["@babel/plugin-proposal-class-properties",            ]
            }
          }
        },
        {
          test: /\.(png|j?g|svg|gif)?$/,
          use: 'file-loader'
       },
        {
          test: /\.scss$/,
          sideEffects:true,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },

          ]
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },

          ]
        },
      ],
    },
    plugins: [
     // new BundleAnalyzerPlugin(),
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new webpack.optimize.SplitChunksPlugin({
        name: 'vendor',
        chunks: 'all',
      }),
      new JsonpScriptSrcPlugin({
        customJsonpSrc(chunkId, chunkMaps, original) {
           return __webpack_require__.p + "simply-" + ({}[chunkId]||chunkId) + ".js"
        }
      })
    ]
  });
  var allPages = Object.assign({}, config, {
    entry: {
      'theme': ['@babel/polyfill', './javascript/app.js'],
    },
    watch: watchFile,
    output: {
      path: __dirname,
      filename: "theme/assets/[name].js"
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          sideEffects:true,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: __dirname
              }
            },
            "css-loader",
            "sass-loader"
          ]
        },
        
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "theme/assets/[name].css"
      })
    ]
  });
  return [
    checkoutPage,
    reactApp,
    allPages
  ];
}
// Return Array of Configurations
module.exports = (env, argv) => {
  let watchFile = false;
  if (argv.mode === "development") {
    watchFile = true;
  }
  return returnAll(watchFile);

};
