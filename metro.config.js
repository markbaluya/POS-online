// Expo-sqlite web (alpha) loads its SQLite engine as a .wasm asset URL
// (see node_modules/expo-sqlite/web/worker.ts -> locateFile: () => wasmModule).
// Register wasm as an asset extension so Metro web can bundle it.
// Pattern per https://docs.expo.dev/guides/customizing-metro.md ("Adding more
// file extensions to assetExts"). Note: web runtime also needs COEP/COOP
// headers for SharedArrayBuffer, which GitHub Pages cannot set — on Pages the
// Inventory tab shows a fallback message while other tabs work normally.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("wasm");

module.exports = config;
