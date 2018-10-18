var path = require('path');

const config = {
    entry: path.resolve(__dirname, './src/js/racer.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './web/assets/js/')
        //library: 'app'
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'es2015']
                }
            }
        }
        ]
    }
};

module.exports = config;
