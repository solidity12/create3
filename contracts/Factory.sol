// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IFactory.sol";

/**
 * @title Factory contract.
 */
contract Factory is IFactory {
    address public deployer;

    address public implement;

    constructor() {
        deployer = msg.sender;
    }

    /**
     * @dev Deploys a new Implement contract.
     * @param _implementBytecode The bytecode of the Implement contract to be deployed.
     * @return _implement The address of the newly deployed Implement contract.
     */
    function create1(
        bytes memory _implementBytecode
    ) external onlyDeployer returns (address _implement) {
        assembly {
            _implement := create(
                0,
                add(_implementBytecode, 0x20),
                mload(_implementBytecode)
            )
        }
        implement = _implement;

        emit ImplementCreated(implement);
    }

    /**
     * @dev Destructs the Implement contract.
     * This function triggers the self-destruct.
     */
    function destruct() external onlyDeployer {
        IDestruct(implement).destruct();
        selfdestruct(payable(deployer));
    }

    modifier onlyDeployer() {
        require(
            msg.sender == deployer,
            "Only deployer contract can call this function"
        );
        _;
    }
}
