const {
  ethers
} = require("hardhat");

const contracts = require("../config/contracts.json");

async function main() {
  const factoryBytecode = (await ethers.getContractFactory("Factory")).bytecode;
  const impleTestNewBytecode = (await ethers.getContractFactory("ImpleTestNew")).bytecode;
  const impleTestNewHash = ethers.utils.keccak256(impleTestNewBytecode);

  // 1. destruct factory & implement contract
  console.log("1. destruct factory & implement contract");
  const deployerContract = await ethers.getContractAt("Deployer", contracts.deployerContract);
  tx = await deployerContract.destruct();
  await tx.wait();
  console.log("destruct hash: ", tx.hash);

  const factoryCode = await ethers.provider.getCode(contracts.factoryContract);
  const implementCode = await ethers.provider.getCode(contracts.implementContract);
  console.log("factoryCode: ", factoryCode);
  console.log("implementCode: ", implementCode);

  // 2. redeploy Factory & Implement Contract
  console.log("2. redeploy Factory & Implement Contract");
  tx = await deployerContract.create3(impleTestNewBytecode);
  await tx.wait();
  console.log("create3 hash: ", tx.hash);

  // 3. test Implement Contract
  console.log("3. test Implement Contract");
  const implementContract = await ethers.getContractAt("ImpleTestNew", contracts.implementContract);
  const preNumber = (await implementContract.number2()).toString();

  const newNumber = 2;
  tx = await implementContract.setNumber2(newNumber);
  await tx.wait();
  console.log("set number2 hash: ", tx.hash);

  const curNumber = (await implementContract.number2()).toString();
  console.log("pre number2:", preNumber);
  console.log("cur number2:", curNumber);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});