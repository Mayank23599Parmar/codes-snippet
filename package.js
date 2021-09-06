{
  "name": "myntra",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "start": "webpack --mode development & cd theme && theme open && theme deploy && theme watch",
    "watch": "webpack --mode development & cd theme && theme open && theme watch",
    "deploy": "webpack && cd theme && theme open --env=production && theme deploy --env=production --allow-live",
    "webpack": "webpack && cd theme && theme deploy assets/theme.css && theme deploy assets/theme.js",
    "download": "cd theme && theme open && theme download"
  },
  "repository": {
    "type": "git",
    "url": "git+https://prakash_lucentinnovation@bitbucket.org/prakash_lucentinnovation/myntra.git"
  },
  "author": "",
  "license": "ISC",
  "homepage": "https://bitbucket.org/prakash_lucentinnovation/myntra#readme",
  "devDependencies": {
    "@babel/core": "^7.4.3",
    "@babel/plugin-proposal-class-properties": "^7.7.0",
    "@babel/polyfill": "^7.4.3",
    "@babel/preset-env": "^7.4.3",
    "@babel/preset-stage-0": "^7.0.0",
    "babel-loader": "^8.0.5",
    "css-loader": "^1.0.1",
    "mini-css-extract-plugin": "^0.4.5",
    "node-sass": "^4.13.1",
    "sass-loader": "^7.3.1",
    "webpack": "^4.42.0",
    "webpack-cli": "^3.3.11"
  },
  "dependencies": {
    "jquery": "^2.2.4"
  }
}
