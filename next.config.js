/** @type {import('next').NextConfig} */
const webpack = require("webpack");

const nextConfig = {
  // Disable server-side rendering for the entire app
  experimental: {
    appDir: true,
  },
  // Transpile specific packages
  transpilePackages: ["next-auth"],
  // Disable image optimization to reduce build complexity
  images: {
    unoptimized: true,
  },
  // Add Webpack configuration for various fallbacks
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      querystring: require.resolve("querystring-es3"),
      vm: require.resolve("vm-browserify"),
    };
    return config;
  },
};

module.exports = nextConfig;
