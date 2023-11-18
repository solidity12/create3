const {
  expect
} = require("chai");
const {
  ethers
} = require("hardhat");

describe("Create3", function () {
  let deployerContract, factoryContract;
  let implementAddress;

  before(async function () {
    // Deploying the Deployer contract
    const Deployer = await ethers.getContractFactory("Deployer");
    deployerContract = await upgrades.deployProxy(
      Deployer,
      [], {
        initialize: "initializer",
      },
    );
    await deployerContract.deployed();
  });

  it("should have the correct factory bytecode & initcodehash", async function () {
    // Getting bytecode for Factory contract
    const factoryBytecode = (await ethers.getContractFactory("Factory")).bytecode;

    // Checking if the FACTORY_BYTECODE in the contract matches the actual Factory bytecode
    expect(await deployerContract.FACTORY_BYTECODE()).to.equal(factoryBytecode);

    // Checking if the FACTORY_INIT_CODE_HASH in the contract matches the keccak256 hash of the Factory bytecode
    expect(await deployerContract.FACTORY_INIT_CODE_HASH()).to.equal(ethers.utils.keccak256(factoryBytecode));
  });

  it("should deploy a new factory & implement contract", async function () {
    // Getting bytecode for ImplementTest contract
    const implementTestBytecode = (await ethers.getContractFactory("ImpleTest")).bytecode;

    // Deploying a new factory and implement contract
    const tx = await deployerContract.create3(implementTestBytecode);
    const receipt = await tx.wait();

    // Finding the FactoryCreated event in the transaction receipt
    const event = receipt.events.find(event => event.event === "FactoryCreated");
    expect(event).to.not.be.undefined;
    const factoryAddress = event.args.factory;

    // Comparing computed factory address with the event-emitted address
    const computedAddress = await deployerContract.computeAddress();
    expect(computedAddress).to.equal(factoryAddress);

    // Finding the ImplementCreated event and extracting the implement address
    const impleEvent = receipt.events.find(event => event.topics[0] === ethers.utils.id("ImplementCreated(address)"));
    expect(impleEvent).to.not.be.undefined;
    implementAddress = ethers.utils.getAddress("0x" + impleEvent.topics[1].slice(-40));

    // Verifying the factory contract's implement address
    factoryContract = await ethers.getContractAt("Factory", factoryAddress);
    expect(await factoryContract.implement()).to.be.equal(implementAddress);
  });

  it("should initially return 0 and then return 1 after setting the number to 1", async function () {
    // Interacting with the implement contract to test its functionality
    const implementContract = await ethers.getContractAt("ImpleTest", implementAddress);

    // Initially, the number in the contract should be 0
    expect(await implementContract.number()).to.be.equal(0);

    // Setting the number in the contract to 1
    await implementContract.setNumber(1);

    // Now, the number in the contract should be 1
    expect(await implementContract.number()).to.be.equal(1);
  });

  // it("should destruct the contracts at factoryContract.address and implementAddress", async function () {
  //   await deployerContract.destruct();

  //   expect(await ethers.provider.getCode(factoryContract.address)).to.be.equal("0x");
  //   expect(await ethers.provider.getCode(implementAddress)).to.be.equal("0x");
  // });

  it("should redeploy a new factory & implement contract", async function () {
    // Getting bytecode for the new version of the ImplementTest contract
    const implementTestNewBytecode = (await ethers.getContractFactory("ImpleTestNew")).bytecode;

    // Configuring the network for manual mining
    await network.provider.send("evm_setAutomine", [false]);
    await network.provider.send("evm_setIntervalMining", [0]);

    // Destruct the existing factory and implement contracts
    await deployerContract.destruct();
    // Deploy a new factory and implement contract
    const tx = await deployerContract.create3(implementTestNewBytecode);

    // Resuming automatic block mining
    await network.provider.send("evm_setIntervalMining", [1]);
    await network.provider.send("evm_mine");
    await network.provider.send("evm_setAutomine", [true]);

    // Waiting for the transaction to be mined
    const receipt = await tx.wait();

    // Asserting the FactoryCreated event was emitted with the correct address
    const event = receipt.events.find(event => event.event === "FactoryCreated");
    expect(event).to.not.be.undefined;
    factoryContract.address = event.args.factory;

    // Asserting the computed address matches the factory contract address
    const computedAddress = await deployerContract.computeAddress();
    expect(computedAddress).to.equal(factoryContract.address);

    // Asserting the ImplementCreated event was emitted with the correct implement address
    const impleEvent = receipt.events.find(event => event.topics[0] === ethers.utils.id("ImplementCreated(address)"));
    expect(impleEvent).to.not.be.undefined;
    implementAddress = ethers.utils.getAddress("0x" + impleEvent.topics[1].slice(-40));

    // Re-initializing the factory contract with the new address and verifying the implement address
    factoryContract = await ethers.getContractAt("Factory", factoryContract.address);
    expect(await factoryContract.implement()).to.be.equal(implementAddress);
  });

  it("should initially return 0 and then return 2 after setting the number2 to 1", async function () {
    // Interacting with the new version of the implement contract
    const implementContract = await ethers.getContractAt("ImpleTestNew", implementAddress);

    // Initially, the number2 in the contract should be 0
    expect(await implementContract.number2()).to.be.equal(0);

    // Setting the number2 in the contract to 2
    await implementContract.setNumber2(2);

    // Now, the number2 in the contract should be 2
    expect(await implementContract.number2()).to.be.equal(2);
  });
});