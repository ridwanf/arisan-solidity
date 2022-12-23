const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");
const { MNEMONIC, INFURA_URL } = require("./constants");
const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);

// when using Garnache
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "http://localhost:7545"));

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });
  console.log("Contract depoly to", result.options.address);
  provider.engine.stop();
};

deploy();
