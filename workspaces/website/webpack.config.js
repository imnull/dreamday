const path = require('path')
const fs = require('fs')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const createOptimization = (esbuild) => {
    return {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.[jt]sx?(\?.*)?$/i,
                // minify: TerserPlugin.terserMinify,
                // minify: TerserPlugin.uglifyJsMinify,
                // minify: TerserPlugin.swcMinify,
                minify: esbuild === 'true' ? TerserPlugin.esbuildMinify : TerserPlugin.uglifyJsMinify,
                terserOptions: {},
            }),
        ],
    }
}

const esbuildLoader = {
    test: /\.[jt]sx?$/,
    use: [{
        loader: 'esbuild-loader',
        options: {
            // tsconfig: './tsconfig.json',
            // jsx: 'react-jsx'
        }
    }]
}

const babelLoader = {
    test: /\.[jt]sx?$/,
    use: [{
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
        }
    }]
}

module.exports = (options) => {
    const {
        WEBPACK_BUILD,
        WEBPACK_SERVE,
        WEBPACK_BUNDLE,
        mode = (WEBPACK_BUILD || WEBPACK_BUNDLE) ? 'production' : 'development',
        esbuild = '',
    } = options

    const config = {
        entry: path.resolve(__dirname, 'src/index'),
        output: {
            path: path.resolve(__dirname, 'dist')
        },
        mode,
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                '~': path.resolve(__dirname, 'src'),
                '@': path.resolve(__dirname, 'src'),
            },
        },
        module: {
            rules: [
                esbuild === 'true' ? esbuildLoader : babelLoader,
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.s[ac]ss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
            ]
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'src/template.html'),
                filename: 'index.html',
                inject: 'body',
                hash: true,
            }),
            new CleanWebpackPlugin({
                verbose: true
            })
        ],
        devServer: {
            port: 9081,
            open: true,
            hot: true,
        },
    }

    if (mode === 'production') {
        config.optimization = createOptimization(esbuild)
    }
    return config
}