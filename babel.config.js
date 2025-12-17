module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': './src',
          utils: './src/utils',
          components: './src/components',
          hooks: './src/hooks',
          styles: './src/styles',
          assets: './src/assets',
          constants: './src/constants',
          services: './src/services',
          features: './src/features',
          navigation: './src/navigation',
          types: './src/types',
          translation: './src/translation',
          store: './src/store',
          api: './src/api',
          database: './src/database',
          services: './src/services',
        },
      },
    ],
    ['module:react-native-dotenv',
      {
        envName: 'APP_ENV',          // the environment variable to determine env file suffix, e.g. "production"
        moduleName: '@env',          // import name e.g. import { API_URL } from '@env'
        path: `.env`,  // will load e.g. .env.uat by default or .env.production for APP_ENV=production
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,        // allow variables to be undefined without build error
      }
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
