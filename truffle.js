require("dotenv").config();
const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider");
const { MNEMONIC, INFURA_PUBLIC_URL } = process.env;

const CONTRACTS_BUILD_DIR = "./client/contracts";
if (!fs.existsSync(CONTRACTS_BUILD_DIR)) fs.mkdirSync(CONTRACTS_BUILD_DIR);

module.exports = {
  contracts_build_directory: "./client/contracts",
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
