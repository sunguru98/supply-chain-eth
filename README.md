# Supply Chain Project

## Description

A simple ethereum blockchain based supply chain application which allows a consumer/retailer/distributor/farmer to verify the authenticity of the supply chain.

## Specifications

- Truffle version -> **v4.1.14**
- Node version -> **v12.19.0**
- Web3 version -> **v0.20.6**
- Contract Address -> [**0xa2ffEa06dE7Fd7163645639ED045cA5aA135FbeE**](https://rinkeby.etherscan.io/address/0xa2ffea06de7fd7163645639ed045ca5aa135fbee)
- Libraries adopted -> **Roles** (contracts/coffeeaccesscontrol/Roles.sol) for managing different roles but with generic mechanism.

## Instructions/Explanations

- `npm install` (Root directory)
- `npm run ganache` (Starting up the local blockchain via GANACHE CLI)
- `npm run compile` (For compilation of all written contracts. This generates the necessary json files for the front end/testing purposes)
- `npm run dev` (Spins up a server for your client. Lite-server is used, and it's config can be changed inside `bs-config.json`)
- `npm run migrate` (To etch these contracts over the local blockchain)
- `npm run test` (To test against the SupplyChain contract using the cases provided inside `TestSupplyChain.js`. Make sure you have **GANACHE-CLI** spun up first before doing this)
- If you want to upload this over the rinkeby test net, please make sure to create a file called .env (layout mentioned over .env.example), and fill in your wallet's **MNEMONIC** and **INFURA PROJECT ID** and then run `npm run rinkeby`.
