require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }, ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url : "https://api.wemix.com",
        // url: "https://api.test.wemix.com",
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    wemix: {
      url: "https://api.wemix.com",
      chainId: 1111,
    },
    wemixtestnet: {
      url: "https://api.test.wemix.com",
      chainId: 1112,
    },
  },
};