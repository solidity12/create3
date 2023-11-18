// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IDestruct.sol";

/**
 * @title IDeployer Interface.
 * @dev Interface for the Deployer contract.
 */
interface IDeployer is IDestruct {
    /**
     * @dev Emitted when the factory contract is created.
     * @param factory Address of the created factory contract.
     */
    event FactoryCreated(address indexed factory);

    /**
     * @dev Deploys the Factory and Implement contracts.
     * This function deploys the Factory and Implement contracts.
     * @param implementBytecode The bytecode of the Implement contract to be deployed.
     */
    function create3(bytes memory implementBytecode) external;

    /**
     * @dev Creates the Factory contract instance using the CREATE2 opcode for deterministic addresses.
     * This is an internal function and part of the create3 method's implementation.
     * @return factory Address of the created Factory contract.
     */
    function create2() external returns (address factory);

    /**
     * @dev Computes the address of the Factory contract based on the current Deployer contract address and salt.
     * This function calculates the expected address of the Factory contract.
     * @return factory The computed address of the Factory contract.
     */
    function computeAddress() external view returns (address factory);
}
