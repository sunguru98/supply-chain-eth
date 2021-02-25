require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const { MNEMONIC, INFURA_PUBLIC_URL } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          MNEMONIC,
          "https://rinkeby.infura.io/v3/" + INFURA_PUBLIC_URL
        );
      },
      network_id: "4",
    },
  },
  compilers: {
    solc: {
      version: "^0.4.24",
    },
  },
};
