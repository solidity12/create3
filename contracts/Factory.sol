// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IFactory.sol";

contract Factory {
    event ImplementCreated(address indexed implement);

    address public deployer;

    address public implement;

    constructor() {
        deployer = msg.sender;
    }

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
