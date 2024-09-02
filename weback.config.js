var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var config = {
  module: {},
};
module.sourceEnable = false;

const returnAll = watchFile => {
  var allPages = Object.assign({}, config, {
    entry: {
    
      'theme-index': './javascript/template-index.js',
      'theme-collection': './javascript/template-collection.js',
      'theme-list-collections': './javascript/template-list-collections.js',
      'theme-product': './javascript/template-product.js',
      'theme-cart': './javascript/template-cart.js',
      'theme-page': './javascript/template-page.js',
      'theme-blog-article': './javascript/template-blog-article.js',
      'theme-account': './javascript/template-account.js',
      'theme-global':'./javascript/template-global.js'
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
  var reactApp = Object.assign({}, config, {
    entry: ["@babel/polyfill", "./src/index.js"],
    watch: watchFile,
    output: {
      path: __dirname,
     filename: "theme/assets/theme-react.js",
    },
    devServer: {
      historyApiFallback: true
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
     
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env",'@babel/preset-react'],
              plugins: ["@babel/plugin-proposal-class-properties",]
            }
          }
        },
        {
          test: /\.(png|j?g|svg|gif)?$/,
          use: 'file-loader'
       },
        {
          test: /\.scss$/,
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
      

    ]
  });
  return [
    allPages,
    reactApp,
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
// package.json
