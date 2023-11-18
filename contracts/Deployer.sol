// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Factory.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Deployer is OwnableUpgradeable {
    event FactoryCreated(address indexed factory);

    IFactory public factory;

    bytes public FACTORY_BYTECODE;
    bytes32 public FACTORY_INIT_CODE_HASH;
    bytes32 public FACTORY_SALT;

    receive() external payable {}

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() external initializer {
        FACTORY_BYTECODE = type(Factory).creationCode;
        FACTORY_INIT_CODE_HASH = keccak256(FACTORY_BYTECODE);

        FACTORY_SALT = bytes32(0);

        __Ownable_init();
    }

    function create3(bytes memory implementBytecode) external onlyOwner {
        require(address(factory) == address(0), "Factory already exists.");
        factory = IFactory(create2());

        factory.create1(implementBytecode);
    }

    function destruct() external onlyOwner {
        require(address(factory) != address(0), "No factory to destruct.");
        factory.destruct();

        factory = IFactory(address(0));
    }

    function create2() internal returns (address _factory) {
        bytes memory factoryBytecode = FACTORY_BYTECODE;
        assembly {
            let salt := sload(FACTORY_SALT.slot)

            _factory := create2(
                0,
                add(factoryBytecode, 0x20),
                mload(factoryBytecode),
                salt
            )

            if iszero(extcodesize(_factory)) {
                revert(0, 0)
            }
        }
        require(
            _factory == _computeAddress(),
            "Computed address does not match the created address."
        );

        emit FactoryCreated(_factory);
    }

    function computeAddress() external view returns (address) {
        return _computeAddress();
    }

    function _computeAddress() internal view returns (address _factory) {
        bytes32 rawAddress = keccak256(
            abi.encodePacked(
                hex"ff",
                address(this),
                FACTORY_SALT,
                FACTORY_INIT_CODE_HASH
            )
        );

        _factory = address(uint160(uint256(rawAddress)));
    }
}
