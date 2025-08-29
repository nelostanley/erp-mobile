
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');
config.resolver.sourceExts.push('js', 'json', 'ts', 'tsx', 'jsx');

module.exports = config;
