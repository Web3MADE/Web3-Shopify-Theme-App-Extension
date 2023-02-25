const path = require("path");

module.exports = {
  entry: "./extensions/crypto-theme/assets/connect-wallet.js",
  output: {
    filename: "bundled-connect-wallet.js",
    path: path.resolve(__dirname, "./extensions/crypto-theme/assets"),
  },
};
