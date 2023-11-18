// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IDestruct.sol";

/**
 * @title IFactory Interface.
 * @dev Interface for the Factory contract.
 */
interface IFactory is IDestruct {
    /**
     * @dev Emitted when a new implement contract is created.
     * @param implement Address of the created implement contract.
     */
    event ImplementCreated(address indexed implement);

    /**
     * @dev Deploys a new Implement contract.
     * @param implementBytecode The bytecode of the Implement contract to be deployed.
     * @return implement The address of the newly deployed Implement contract.
     */
    function create1(
        bytes memory implementBytecode
    ) external returns (address implement);
}
