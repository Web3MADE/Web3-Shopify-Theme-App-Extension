const path = require("path");
const webpack = require("webpack");

module.exports = {
  // the file being bundled
  entry: "./extensions/crypto/assets/connect-wallet.js",
  output: {
    filename: "bundled-connect-wallet.js",
    path: path.resolve(__dirname, "./extensions/crypto/assets"),
  },
  // enables $ jquery to be accessed globally in minter moal
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    // Limit Minter Modal chunks to 1 file
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
