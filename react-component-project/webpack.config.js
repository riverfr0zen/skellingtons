/* eslint-disable */

const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');


const BUILD_DIR = path.resolve(__dirname, 'examples/dist');
const APP_DIR = path.resolve(__dirname, 'examples/app');
const SRC_DIR = path.resolve(__dirname, 'src');
const DEV_SERVER_PUBLIC_PATH = '/'
const NPM_MODULES_DIR = path.resolve(__dirname, 'node_modules');

module.exports = (env, argv) => {
    let styleLoaderConf = 'style-loader';
    let includeCSSSourceMaps = true;
    if (argv.mode === 'production') {
        styleLoaderConf = MiniCssExtractPlugin.loader;
        includeCSSSourceMaps = false;
    }
    return {
        entry: APP_DIR + '/index.jsx',
        devServer: {
            contentBase: BUILD_DIR,
            publicPath: DEV_SERVER_PUBLIC_PATH,
            hot: true,
            historyApiFallback: { index: 'index.html'}
        },
        output: {
            path: BUILD_DIR + '/',
            publicPath: DEV_SERVER_PUBLIC_PATH,
            filename: 'bundle-[hash:6].js',
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].[contenthash].css",
                chunkFilename: "[id].[contenthash].css"
            }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                template: APP_DIR + '/index.html.tpl',
                alwaysWriteToDisk: true,
                hash: true, // Adds a '?+hash' to file addresses
                inject: true
            }),
            new HtmlWebpackHarddiskPlugin(),
        ],
        performance: {
            // hints: false,
            maxEntrypointSize: 320000,
            maxAssetSize: 320000,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: {
                        loader: 'babel-loader',
                        query: {
                            plugins:[ 'transform-object-rest-spread' ]
                        },
                    },
                    include: [APP_DIR, SRC_DIR,],
                },
                /* App css */
                {
                    test: /\.css$/,
                    use: [
                        {loader: styleLoaderConf},
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: includeCSSSourceMaps,
                                modules: true,
                                camelCase: true,
                                // camelCase: 'dashesOnly',
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        }
                    ],
                    include: [APP_DIR, SRC_DIR,],
                },
                /* NPM package css */
                {
                    test: /\.css$/,
                    use: [
                        {loader: styleLoaderConf},
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: includeCSSSourceMaps,
                            }

                        }
                    ],
                    include: [NPM_MODULES_DIR,],
                },
                // less
                {
                    test: /\.(less)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "less-loader"
                    ]
                },
                // handles images
                {
                    test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
                    // use: 'file-loader?name=[name].[ext]?[hash]'
                    use: [{
                         loader: 'url-loader',
                         options: {
                             limit: 8000, // Convert images < 8kb to base64 strings
                             name: 'assets/[hash]-[name].[ext]'
                         }
                     }],
                },

                // the following 3 rules handle font extraction
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                },

                {
                    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.otf(\?.*)?$/,
                    use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
                }
            ]
        }
    }
}
