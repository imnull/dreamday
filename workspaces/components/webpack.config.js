const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
        port = 8080,
    } = options

    const plugins = []
    if (mode === 'production') {
        plugins.push(
            new CleanWebpackPlugin({
                verbose: true
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'src/components/type.ts',
                        to: 'components.d.ts'
                    }
                ]
            })
        )
    } else {
        plugins.push(
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'src/template.html'),
                filename: 'index.html',
                inject: 'body',
                hash: true,
            }),
        )
    }

    const externals = {}
    if (mode === 'production') {
        externals.react = 'commonjs react'
    }
    const config = {
        entry: mode === 'production' ? path.resolve(__dirname, 'src/components/index') : path.resolve(__dirname, 'src/index'),
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: mode === 'production' ? 'components.js' : 'index.js',
            libraryTarget: 'commonjs2',
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
        plugins,
        externals,
        devServer: {
            port,
            open: true,
            hot: true,
        },
    }

    if (mode === 'production') {
        // config.optimization = createOptimization(esbuild)
    }
    return config
}