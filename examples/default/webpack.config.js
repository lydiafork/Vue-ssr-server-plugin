var path = require('path');
var VueSSRServerPlugin = require('../../index.js');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    context: __dirname,
    entry: {
        index: path.join(__dirname, 'index.js'),
        page: path.join(__dirname, 'page.js'),
    },
    target: 'node',
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '',
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                    },
                ],
            },
            {
                test: /\.less$/, // style-loader 在sourceMap的情况下处理字体路径有问题,所以用vue-style来代替
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    }, {
                        loader: 'postcss-loader',
                    }, {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/, // 利用babel-loader编译js，使用更高的特性，排除npm下载的.vue组件
                loader: 'babel-loader',
                exclude: file => (
                  /node_modules/.test(file) &&
                  !/\.vue\.js/.test(file)
                )
              },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new VueSSRServerPlugin({
            filename: '.json'
        })
    ],
};