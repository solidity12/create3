# Create3

`Create3` is an innovative Solidity project that demonstrates a novel approach to smart contract deployment and management on the Ethereum blockchain. The core feature of this project is its ability to **redeploy contracts at the same address with modified bytecode**. This is achieved through a combination of Ethereum's `CREATE2` and `CREATE` opcodes, along with the strategic use of the self-destruct mechanism.

The process involves two main types of contracts: `Factory` and `Implement`. The `Deployer` contract, central to this system, utilizes the `create3` function to deploy these contracts. The `Factory` contract is deployed using `create2`, which allows for deterministic contract addresses, while the `Implement` contract is deployed using `create1`.

A key functionality of this system is its use of the self-destruct feature. By self-destructing the `Factory` and `Implement` contracts and then redeploying the `Implement` contract, we can reset the nonce of the `Factory` to zero. This nonce reset enables the redeployment of the `Implement` contract at the same address but with different bytecode, maintaining the address continuity while allowing for contract upgrades or modifications.

## Methods

### create3

```solidity
function create3(bytes memory implementBytecode) external onlyOwner;
```

This method is used to deploy the `Factory` and `Implement` contracts. It first checks if the `Factory` contract already exists; if not, it re-deploy the `Factory` contract using the `create2` method and then deploys the `Implement` contract using the `create1` method.

### destruct

```solidity
function destruct() external onlyOwner;
```

This method enables the destruction of the `Factory` and `Implement` contracts. It checks if the `Factory` contract exists and, if so, triggers its self-destruct mechanism. This process effectively removes both the `Factory` and `Implement` contracts from the blockchain.

## Prerequisites

- Node.js v14+ LTS and npm (comes with Node)
- Hardhat

## Installation

Clone the repository:

```bash
git clone https://github.com/solidity12/create3
```

Navigate to the project folder:

```bash
cd create3
```

Install dependencies:

```bash
npm install
```

## Set up configuration:

1. Review the `.example.env` file.
2. Create a `.env` file based on the example and adjust the values as needed.

For Linux or macOS:

```bash
cp .example.env .env
```

For Windows:

```bash
copy .example.env .env
```

## Compilation

Compile the smart contracts using Hardhat:

```bash
npx hardhat compile
```

## Quick Start Guide

### 1. Testing:

Run the following command to execute the contract tests. Make sure you've written the tests in your Hardhat project's `test` directory.

```bash
npx hardhat test
```

### 2. Local Deployment:

For local testing and development, follow these steps:

**Start a Local Ethereum Node:**

First, start a local Ethereum network. This simulates the Ethereum blockchain on your machine.

```bash
npx hardhat node --network localhost
```

**Deploy Contracts Locally:**

With your local node running, deploy the contracts to this network.

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Destruct Contracts Locally:**

If required, you can destruct the deployed contracts on your local network.

```bash
npx hardhat run scripts/destruct.js --network localhost
```

### 3. Deployment on Wemix Network:

Deploy to the `wemix` network, follow these steps:

**Deploy Contracts to Wemix:**

To deploy the `Deployer`, `Factory` and `ImpleTest` contracts, follow these steps:

Deploy `create3` to wemix network:

```bash
npx hardhat run scripts/deploy.js --network wemix
```

**Destruct Contracts on Wemix:**

To destruct the `create3` system, use this command:

```bash
npx hardhat run scripts/destruct.js --network wemix
```

## Conclusion

If you would like to contribute to the project, please fork the repository, make your changes, and then submit a pull request. We appreciate all contributions and feedback!
