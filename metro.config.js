const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default configuration
const config = getDefaultConfig(__dirname);

// Add 'ttf' to the list of asset extensions
config.resolver.assetExts.push('ttf');

// Add the @expo/vector-icons directory to the watched folders
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, 'node_modules/@expo/vector-icons'),
];

module.exports = config;