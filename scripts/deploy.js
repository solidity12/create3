const {
  ethers,
  upgrades
} = require("hardhat");
const fs = require("fs");
const path = require("path");

const contractsDir = path.join(__dirname, "../config");
const contractsFile = path.join(contractsDir, 'contracts.json');

async function main() {
  const implementTestBytecode = (await ethers.getContractFactory("ImpleTest")).bytecode;

  // 1. deploy Deployer Contract
  console.log("1. deploy Deployer Contract");
  const Deployer = await ethers.getContractFactory("Deployer");
  deployerContract = await upgrades.deployProxy(
    Deployer,
    [], {
      initialize: "initializer",
    },
  );
  await deployerContract.deployed();
  console.log("deployer: ", deployerContract.address);

  // 2. deploy Factory & Implement Contract
  console.log("2. deploy Factory & Implement Contract");
  tx = await deployerContract.create3(implementTestBytecode);
  const receipt = await tx.wait();
  console.log("create3 hash: ", tx.hash);

  const event = receipt.events.find(event => event.event === "FactoryCreated");
  const factoryAddress = event.args.factory;
  console.log("factory: ", factoryAddress);

  const impleEvent = receipt.events.find(event => event.topics[0] === ethers.utils.id("ImplementCreated(address)"));
  const implementAddress = ethers.utils.getAddress("0x" + impleEvent.topics[1].slice(-40));
  console.log("implement: ", implementAddress);

  // 3. test Implement Contract
  console.log("3. test Implement Contract");
  const implementContract = await ethers.getContractAt("ImpleTest", implementAddress);
  const preNumber = (await implementContract.number()).toString();

  const newNumber = 1;
  tx = await implementContract.setNumber(newNumber);
  await tx.wait();
  console.log("set number hash: ", tx.hash);

  const curNumber = (await implementContract.number()).toString();
  console.log("pre number:", preNumber);
  console.log("cur number:", curNumber);

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, {
      recursive: true
    });
  }

  const contracts = {
    deployerContract: deployerContract.address,
    factoryContract: factoryAddress,
    implementContract: implementAddress,
  }

  // Write the contract addresses to a JSON file
  fs.writeFileSync(contractsFile, JSON.stringify(contracts, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});