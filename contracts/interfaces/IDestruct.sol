// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title IDestruct Interface.
 * @dev Interface for the Destruct contract.
 */
interface IDestruct {
    /**
     * @dev Destructs the contract.
     * This function triggers the self-destruct.
     */
    function destruct() external;
}
