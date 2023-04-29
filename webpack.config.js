const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //Плагин для HTLM npm install html-webpack-plugin -D
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //Плагин для CSS npm install mini-css-extract-plugin -D
const ESLintPlugin = require('eslint-webpack-plugin');
const mode = process.env.NODE_ENV || 'development'; //указание среды разработки ()

const devMode = mode === 'development'; // Проверка мода на девелопмент

const target = devMode ? 'web' : 'browserslist'; // Если development, то web настройки, если продакшн, то файл browserslistrc
const devtool = devMode ? 'source-map' : undefined; // При дев моде, будет source-map для отслежиания ошибок 

module.exports = {
    mode, //Мод (дев или прод)
    target, // ресурс (web или browserslistrc)
    devtool, // отслеживание ошибок
    devServer: {
        port: 3000, //Порт
        open: true, //Открывать браузер //Обновление стилей (бывают сложности)
    },
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')], //npm install --save @babel/polyfill : для поддержки скриптов из браузеров
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean:true,
        filename: 'index.js', //name - main по умолчанию, contenthash нужен для сборки разных имен, чтобы обновление было из разных файлов
    },
    module: {
        rules: [
            { //npm install --save-dev html-loader
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {//npm install --save-dev @babel/core @babel/preset-env babel-loader (Бабель)
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env'],
                }
            },
            {//npm install --save-dev css-loader sass-loader sass (Сассик)
                test: /\.(c|sc|sa)ss$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    { // npm install --save-dev postcss-loader postcss postcss-preset-env (Префиксы)
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions:  {
                                plugins: [require('postcss-preset-env')],
                            }
                        }
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(svg|jpg|jpeg|png|gif)$/,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new ESLintPlugin({
            extensions: ['js']
        }),

    ]
};

//npm i scss-reset --save; почистить html