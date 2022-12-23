const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // remove build folder

// Read 'arisan.sol' file from the 'contracts' folder
const arisanPath = path.resolve(__dirname, "contracts", "arisan.sol");
const source = fs.readFileSync(arisanPath, "utf8");
let interface;
let bytecode;
var input = {
  language: "Solidity",
  sources: {
    "arisan.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)), 1);
fs.ensureDirSync(buildPath); // ensure build folder exists

for (let contract in output.contracts["arisan.sol"]) {
  fs.outputJSONSync(
    path.resolve(buildPath, "arisan.json"),
    (interface = output.contracts["arisan.sol"][contract].abi)
  );

  fs.outputJSONSync(
    path.resolve(buildPath, "arisanBytecode.json"),
    (bytecode = output.contracts["arisan.sol"][contract].evm.bytecode.object)
  );
}

module.exports = {
  interface,
  bytecode,
};
