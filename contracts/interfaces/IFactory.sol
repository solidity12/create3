// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IDestruct.sol";

interface IFactory is IDestruct {
    function create1(
        bytes memory _implementBytecode
    ) external returns (address _implement);
}
