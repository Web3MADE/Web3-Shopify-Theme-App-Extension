const path = require("path");
const webpack = require("webpack");

module.exports = {
  // the file being bundled
  entry: "./extensions/crypto/assets/connect-wallet.js",
  output: {
    filename: "bundled-connect-wallet.js",
    path: path.resolve(__dirname, "./extensions/crypto/assets"),
  },
};
