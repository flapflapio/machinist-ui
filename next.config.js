module.exports = {
  future: {
    webpack5: true,
  },

  // Use below if you need to serve assets from somewhere else
  // basePath: process.env.NODE_ENV === "production" ? "" : "",
  // assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  // basePath: process.env.ASSET_PREFIX || "",
  // assetPrefix: `${process.env.ASSET_PREFIX || ""}/`,

  // Use below to configure webpack
  webpack: (config) => config,
};
