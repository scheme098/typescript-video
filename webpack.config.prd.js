const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')  //生成html模板插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //清除打包文件插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //模块化css 插件

module.exports = {
    entry: "./src/main.ts",
    output: {
        path:path.resolve(__dirname,'dist'),
        filename: "main.js"
    },
    devServer: {
        contentBase:"/dist",
        open:true
    },
    resolve: {
      "extensions":['.ts','.js','.json']
    },
    module: {
        rules:[
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,'css-loader'],
                exclude:[ //不包含
                    path.resolve(__dirname,'src/components')
                ]
            },
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,{
                    loader: "css-loader",
                    options:{
                        modules:true //模块化
                    }
                }],
                include:[ //包含
                    path.resolve(__dirname,'src/components')
                ]

            },
            {
                test:/\.(eot|woff2|woff|ttf|svg)$/,
                use:[{ //将字体文件打包到iconfont 目录下
                    loader:'file-loader',
                    options: {
                        outputPath:'iconfont'
                    }
                }]
            },
            {
                test:/\.ts$/,
                use:['ts-loader'],
                exclude:/node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
    ],
    mode:"production"
}
