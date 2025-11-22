const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Load environment variables from .env file
const dotenv = require('dotenv');
const envResult = dotenv.config({path: path.resolve(__dirname, '.env')});

// Debug: Log if .env file was loaded
if (envResult.error) {
  console.error('❌ Error loading .env file:', envResult.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `Found (length: ${process.env.GEMINI_API_KEY.length})` : 'NOT FOUND');
  console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? `Found (length: ${process.env.GOOGLE_MAPS_API_KEY.length})` : 'NOT FOUND');
}

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname);
// Force webpack to use project root
process.chdir(projectRoot);
// Set NODE_PATH to project root
process.env.NODE_PATH = projectRoot;

// Monkey-patch require to prevent reading parent package.json and resolve from project root
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;
const fs = require('fs');

Module._resolveFilename = function(request, parent, isMain, options) {
  // Convert parent to string path if it's an object
  let parentPath = '';
  if (parent) {
    if (typeof parent === 'string') {
      parentPath = parent;
    } else if (parent && typeof parent === 'object') {
      parentPath = parent.filename || parent.id || parent.path || String(parent);
    } else {
      parentPath = String(parent);
    }
  }
  
  // If trying to resolve package.json, only look in project root
  if (request === './package.json' || request === 'package.json') {
    const projectPackageJson = path.join(projectRoot, 'package.json');
    if (fs.existsSync(projectPackageJson)) {
      return projectPackageJson;
    }
  }
  
  // If parent is clearly outside project directory, redirect all relative imports to project root
  if (parentPath && typeof parentPath === 'string') {
    const isParentDirectory = parentPath.includes('C:\\Users\\16473') && !parentPath.includes('ellehack-vibe');
    const isOutsideProject = !parentPath.includes(projectRoot);
    
    if (isParentDirectory || isOutsideProject) {
      // Handle './src' or './src/App' or './src/...' requests
      if (request === './src' || request.startsWith('./src/')) {
        if (request === './src/App' || request === './src') {
          const srcApp = path.join(projectRoot, 'src', 'App.tsx');
          if (fs.existsSync(srcApp)) {
            return srcApp;
          }
        }
        // For './src/...', resolve from project src
        const relativePath = request.replace('./src/', '').replace('./src', '');
        const extensions = ['', '.tsx', '.ts', '.js', '.jsx'];
        for (const ext of extensions) {
          const fullPath = path.join(projectRoot, 'src', relativePath + ext);
          if (fs.existsSync(fullPath)) {
            return fullPath;
          }
        }
        // Return src directory as last resort
        return path.join(projectRoot, 'src');
      }
      
      // For any other relative import from parent directory, try to resolve from project root
      if (request.startsWith('./') || request.startsWith('../')) {
        try {
          const cleanRequest = request.replace(/^\.\//, '').replace(/^\.\.\//, '');
          const extensions = ['', '.tsx', '.ts', '.js', '.jsx'];
          for (const ext of extensions) {
            const fullPath = path.join(projectRoot, cleanRequest + ext);
            if (fs.existsSync(fullPath)) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignore errors, fall through to original resolution
        }
      }
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
      path.resolve(projectRoot, 'web'),
      path.resolve(projectRoot, 'node_modules'),
      'node_modules',
    ],
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-async-storage/async-storage':
        '@react-native-async-storage/async-storage',

      '@': path.resolve(projectRoot, 'src'),
      // Prevent resolving './src' from parent directories - redirect to project src
      './src': path.resolve(projectRoot, 'src'),
      'src': path.resolve(projectRoot, 'src'),
      // Also handle if something tries to resolve src as a file
      './src/App': path.resolve(projectRoot, 'src', 'App.tsx'),
      './src/index': path.resolve(projectRoot, 'src', 'App.tsx'),

      '@react-native-vector-icons/material-design-icons':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      'react-native-vector-icons/MaterialCommunityIcons':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons/MaterialCommunityIcons':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons/build/MaterialCommunityIcons':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons/build/createIconSet':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      '@expo/vector-icons':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),
      'react-native-vector-icons':
        path.resolve(projectRoot, 'web', 'stubs', 'IconStub.js'),

      '@env': path.resolve(projectRoot, 'src', 'config', 'env.web.ts'),
    },

    extensions: [
      '.web.js', '.js',
      '.web.ts', '.web.tsx', '.ts', '.tsx',
      '.json'
    ],

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
          // Exclude root index.js (React Native entry point, not for web)
          const rootIndexJs = path.join(projectRoot, 'index.js');
          if (modulePath === rootIndexJs || modulePath.includes(rootIndexJs)) {
            return true;
          }
          // Exclude parent directory files
          if (modulePath.includes('C:\\Users\\16473') && !modulePath.includes('ellehack-vibe')) {
            return true;
          }
          if (modulePath.includes('node_modules')) {
            const needsProcessing =
              modulePath.includes('react-native-vector-icons') ||
              (modulePath.includes('@expo') && modulePath.includes('vector-icons')) ||
              modulePath.includes('@react-navigation');
            return !needsProcessing;
          }
          return false;
        },
        include: (modulePath) => {
          // Always include src and web directories
          if (modulePath.includes(path.resolve(projectRoot, 'src')) ||
              modulePath.includes(path.resolve(projectRoot, 'web'))) {
            return true;
          }
          // Include @expo/vector-icons from any location
          if (modulePath.includes('@expo') && modulePath.includes('vector-icons')) {
            return true;
          }
          // Include react-native-vector-icons
          if (modulePath.includes('react-native-vector-icons')) {
            return true;
          }
          // Include @react-navigation packages
          if (modulePath.includes('@react-navigation')) {
            return true;
          }
          return false;
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY || ''),
    }),
    

    new webpack.NormalModuleReplacementPlugin(
      /^dotenv$/,
      path.resolve(projectRoot, 'node_modules', 'dotenv', 'lib', 'main.js')
    ),

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
