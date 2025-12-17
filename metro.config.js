const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);
const { assetExts, sourceExts } = defaultConfig.resolver;

const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
  },
  resolver: {
    // ✅ Ensure image extensions like jpg, png, jpeg remain included
    assetExts: [
      ...assetExts.filter((ext) => ext !== 'svg'),
      'jpg',
      'jpeg',
      'png',
      'gif',
      'webp',
    ],
    sourceExts: [...sourceExts, 'svg'],
    alias: {
      '~': path.resolve(projectRoot, 'src'),
      utils: path.resolve(projectRoot, 'src/utils'),
      components: path.resolve(projectRoot, 'src/components'),
      hooks: path.resolve(projectRoot, 'src/hooks'),
      styles: path.resolve(projectRoot, 'src/styles'),
      assets: path.resolve(projectRoot, 'src/assets'),
      constants: path.resolve(projectRoot, 'src/constants'),
      services: path.resolve(projectRoot, 'src/services'),
      features: path.resolve(projectRoot, 'src/features'),
      navigation: path.resolve(projectRoot, 'src/navigation'),
      types: path.resolve(projectRoot, 'src/types'),
      translation: path.resolve(projectRoot, 'src/translation'),
      store: path.resolve(projectRoot, 'src/store'),
      api: path.resolve(projectRoot, 'src/api'),
      database: path.resolve(projectRoot, 'src/database'),
    },
  },
};

// ✅ Merge everything
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// ✅ Apply NativeWind
const nativeWindConfig = withNativeWind(mergedConfig, {
  input: './global.css',
  tailwindConfig: path.resolve(projectRoot, 'tailwind.config.js'),
});

// ✅ Wrap with Reanimated config
const finalConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

module.exports = finalConfig;
