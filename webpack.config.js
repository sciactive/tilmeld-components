const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    TilmeldComponents: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: ['tilmeld-components'],
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.html'],
  },
  externals: {
    'nymph-client': 'nymph-client',
    'tilmeld-client': 'tilmeld-client',
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'svelte-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/transform-classes',
                {
                  builtins: ['Error'],
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
