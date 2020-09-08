/**
 * Main file of webpack config.
 * Please do not modified unless you know what to do
 */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackRTLPlugin = require("webpack-rtl-plugin");
const del = require("del");

// global variables
const rootPath = path.resolve(__dirname);
const distPath = path.resolve(__dirname, 'dist');

const entries = {
  "sass/style.react": "./src/index.scss",
  "main": "./src/index.ts"
};

const mainConfig = function () {
  return {
	mode: "development",
  devtool: 'inline-source-map',
  target: "web",
	stats: "errors-only",
    performance: {
      hints: false
    },
    entry: entries,
    output: {
      // main output path in assets folder
      path: distPath,
      // output path based on the entries' filename
	    filename: '[name].js'
    },
    resolve: { 
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
		  root: [
			  path.resolve(__dirname, 'src'),
			  path.resolve(__dirname, 'node_modules')
		  ]
	},
    plugins: [
      // create css file
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new WebpackRTLPlugin({
        filename: "[name].rtl.css",
      }),
      {
        apply: (compiler) => {
          // hook name
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            (async () => {
              await del.sync(distPath + "/sass/*.js", {force: true});
            })();
          });
        }
      },
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              }
            },
          ]
		    },
        {
          test: /\.tsx?$/,
          use: ['babel-loader', 'ts-loader'],
          exclude: /node_modules/,
        }
      ]
    },
  }
};

module.exports = function () {
  return [mainConfig()];
};
