// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImpleTest is Ownable {
    uint256 public number;

    function setNumber(uint256 _number) external {
        number = _number;
    }

    function destruct() external onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}
