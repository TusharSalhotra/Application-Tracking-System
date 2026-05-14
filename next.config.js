const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@deepak-pahwa/citywide-commonmodules"],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "redux/auth/slice": path.resolve(__dirname, "src/redux/auth/slice.tsx"),
      "redux/store": path.resolve(__dirname, "src/redux/store.tsx"),
    };

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule?.test?.test?.(".svg")
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset/resource",
    });

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
