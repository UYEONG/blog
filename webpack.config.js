const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const themePkg = require('./themes/mooji/package.json');
const isDevelopment = process.env.NODE_ENV !== 'production';
const filename = `${themePkg.alias}-${themePkg.version}${!isDevelopment ? '.min' : ''}`;
const plugins = [];
const entryList = ['index', 'post', 'tag', 'category', 'archive'];
const entryConfig = entryList.reduce((n, e) => (n[e] = `./themes/mooji/source/_js/${e}`) && n, {});

if (!isDevelopment) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false,
        output: {
            comments: false
        }
    }));
}

module.exports = {
    devtool: isDevelopment ? "source-map" : '',
    entry: entryConfig,
    output: {
        path: path.resolve(__filename, '../themes/mooji/source'),
        filename: `./assets/js/${filename.replace('-', `.[name]-`)}.js`
    },
    module: {
        rules: [{
            test: /(\.js)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: [['es2015', { modules: false }]],
                plugins: ['transform-class-properties'],
                cacheDirectory: true
            }
        }, {
            test: /\.(scss|css)/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader!postcss-loader!sass-loader",
            })
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            use: "url-loader?limit=10000&name=/assets/fonts/[name].[ext]&mimetype=application/font-woff"
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            use: "url-loader?limit=10000&name=/assets/fonts/[name].[ext]&mimetype=application/font-woff"
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: "url-loader?limit=10000&name=/assets/fonts/[name].[ext]&mimetype=application/octet-stream"
        }, {
            test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
            use: "file-loader?name=/assets/fonts/[name].[ext]"
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: "file-loader?name=/assets/fonts/[name].[ext]"
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: "url-loader?limit=10000&name=/assets/fonts/[name].[ext]&mimetype=image/svg+xml"
        }]
    },
    plugins: plugins.concat([
        new ExtractTextPlugin(`/assets/css/${filename}.css`)
    ])
};
