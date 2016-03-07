var fs = require('fs')
var path = require('path')
var webpack = require('webpack');

module.exports = {

    // devtool: 'inline-source-map',

    entry: "./app.js",
    /*
    entry: fs.readdirSync(__dirname).reduce(function (entries, dir) {
      if (fs.statSync(path.join(__dirname, dir)).isDirectory())
        entries[dir] = path.join(__dirname, dir, 'app.js')

      return entries
    }, {}),
    */

    /*
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    */
    output: {
      path: __dirname + '/build',
      filename: 'app.js',
      publicPath: 'build'
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.jsx?|\.js$/, loaders: ['jsx?harmony']}
        ]
    },

    plugins: [
      // new webpack.optimize.CommonsChunkPlugin('common.js'),
    
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
    
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};