// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImpleTestNew is Ownable {
    uint256 public number2;

    function setNumber2(uint256 _number2) external {
        number2 = _number2;
    }

    function destruct() external onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}
