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
{
    "name": "mayank-parmar",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "config": {
        "store": "",
        "dev_theme": "",
        "prod_theme": ""
    },
    "scripts": {
        "dev": "concurrently -n webpack,shopify  -c \"bgBlue.bold,bgGreen.bold\"  \"npm run webpeck-dev\" \"npm run shopify-open\"",
        "webpeck-dev": "webpack --mode development",
        "webpeck-prod": "webpack --mode production",
        "shopify-pull-json-live": "shopify theme pull -t %npm_package_config_prod_theme% --only templates/**/*.json --only templates/*.json --only config/*.json --only sections/*.json --only locales/*.json --path ./theme",
        "shopify-push-json-live": "shopify theme push -t %npm_package_config_prod_theme% --only templates/**/*.json --only config/*.json --only sections/*.json --only locales/*.json --path ./theme",
        "shopify-push-json": "shopify theme push -t %npm_package_config_dev_theme% --only templates/**/*.json --only config/*.json --only sections/*.json --only locales/*.json --path ./theme",
        "shopify-push": "shopify theme push -t %npm_package_config_dev_theme% --ignore \"config/*.json\" --ignore \"templates/**/*.json\" --ignore \"sections/*.json \"  --path ./theme",
        "shopify-push-live": "shopify theme push -t %npm_package_config_prod_theme%  --allow-live --ignore \"config/*.json\" --ignore \"templates/**/*.json\" --ignore \"sections/*.json \" --path ./theme",
        "shopify-open": "shopify theme dev -s %npm_package_config_store%  -t %npm_package_config_dev_theme% --ignore \"config/*.json\" --ignore \"templates/**/*.json\" --ignore \"sections/*.json \" --path ./theme",
        "shopify-pull": "shopify theme pull -t %npm_package_config_dev_theme% --ignore \"config/*.json\" --ignore \"templates/**/*.json\" --ignore \"sections/*.json \" --path ./theme",
        "shopify-pull-json": "shopify theme pull -t %npm_package_config_dev_theme% --only templates/**/*.json --only templates/*.json --only config/*.json --only sections/*.json --only locales/*.json --path ./theme",
        "build": "concurrently -n webpack,shopify -c \"bgBlue.bold,bgGreen.bold\"  \"npm run webpeck-prod\" \"npm run shopify-push\"",
        "deploy": "concurrently -n webpack,shopify -c \"bgBlue.bold,bgGreen.bold\"  \"npm run webpeck-prod\" \"npm run shopify-push-live\"",
        "info": "shopify theme info",
        "logout": "shopify auth logout",
        "login": "shopify theme dev -s %npm_package_config_store%"
    },
    "author": "Mayank Parmar",
    "license": "ISC",
    "devDependencies": {
        "@babel/core": "^7.22.17",
        "@babel/plugin-proposal-class-properties": "^7.18.6",
        "@babel/polyfill": "^7.12.1",
        "@babel/preset-env": "^7.22.15",
        "@babel/preset-react": "^7.22.15",
        "@babel/preset-stage-0": "^7.0.0",
        "babel-loader": "^9.1.3",
        "babel-preset-react-optimize": "^1.0.1",
        "concurrently": "^8.2.2",
        "css-loader": "^7.1.2",
        "license-webpack-plugin": "^4.0.2",
        "mini-css-extract-plugin": "^2.9.0",
        "node-sass": "^9.0.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "sass": "^1.77.6",
        "sass-loader": "^14.2.1",
        "webpack": "^5.92.0",
        "webpack-cli": "^5.1.4"
    },
    "dependencies": {
        "react-router-dom": "^6.26.1",
        "swiper": "^11.1.9"
    }
}

