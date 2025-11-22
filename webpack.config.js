const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Load environment variables from .env file
require('dotenv').config({path: path.resolve(__dirname, '.env')});

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname);
// Force webpack to use project root
process.chdir(projectRoot);
// Set NODE_PATH to project root
process.env.NODE_PATH = projectRoot;

// Monkey-patch require to prevent reading parent package.json
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  // If trying to resolve package.json, only look in project root
  if (request === './package.json' || request === 'package.json') {
    const projectPackageJson = path.join(projectRoot, 'package.json');
    if (require('fs').existsSync(projectPackageJson)) {
      return projectPackageJson;
    }
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

let packageJson;
try {
  packageJson = require(path.join(projectRoot, 'package.json'));
} catch (e) {
  packageJson = { name: 'citybuddy-ai' };
}

module.exports = {
  context: projectRoot,
  entry: {
    main: path.resolve(projectRoot, 'web', 'index.js'),
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(projectRoot, 'web-build'),
    filename: 'bundle.js',
    publicPath: '/',
    uniqueName: 'citybuddy-ai-web',
    clean: true,
  },
  resolveLoader: {
    modules: [path.resolve(projectRoot, 'node_modules'), 'node_modules'],
  },
  resolve: {
    modules: [
      path.resolve(projectRoot, 'src'),
      path.resolve(projectRoot, 'node_modules'),
      'node_modules',
    ],
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-async-storage/async-storage': '@react-native-async-storage/async-storage',
      '@': path.resolve(projectRoot, 'src'),
      '@react-native-vector-icons/material-design-icons': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons/MaterialCommunityIcons': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons/build/MaterialCommunityIcons': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons/build/createIconSet': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      'react-native-vector-icons': path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@env': path.resolve(projectRoot, 'src', 'config', 'env.web.ts'),
    },
    extensions: ['.web.js', '.js', '.web.ts', '.web.tsx', '.ts', '.tsx', '.json'],
    symlinks: false,
    roots: [projectRoot],
    mainFields: ['browser', 'module', 'main'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": false,
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "buffer": require.resolve("buffer/"),
      "process": require.resolve("process/browser"),
      "vm": require.resolve("vm-browserify"),
      "events": require.resolve("events/"),
    },
  },
  devServer: {
    static: {
      directory: path.resolve(projectRoot, 'web'),
    },
    compress: true,
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    hot: true,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: (modulePath) => {
          // Exclude node_modules except for packages that need JSX processing
          if (modulePath.includes('node_modules')) {
            // Check if this is a package that needs JSX processing
            const needsProcessing = 
              modulePath.includes('react-native-vector-icons') ||
              (modulePath.includes('@expo') && modulePath.includes('vector-icons'));
            return !needsProcessing;
          }
          return false;
        },
        include: [
          path.resolve(projectRoot, 'src'),
          path.resolve(projectRoot, 'web'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {runtime: 'automatic'}],
              '@babel/preset-typescript',
              'module:metro-react-native-babel-preset',
            ],
            plugins: [
              [
                'module:react-native-dotenv',
                {
                  moduleName: '@env',
                  path: path.resolve(projectRoot, '.env'),
                  safe: false,
                  allowUndefined: true,
                },
              ],
            ],
            cwd: projectRoot,
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(projectRoot, 'web', 'index.html'),
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({
            ...process.env,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
            GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
          }),
        }),
    new webpack.NormalModuleReplacementPlugin(
      /^dotenv$/,
      path.resolve(projectRoot, 'node_modules', 'dotenv', 'lib', 'main.js')
    ),
    // Replace @expo/vector-icons with our stub (match any path containing it)
    new webpack.NormalModuleReplacementPlugin(
      /.*@expo\/vector-icons.*/,
      path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js')
    ),
  ],
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
};
