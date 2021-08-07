pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT
library DuoSwapMath {
    function sqrt(uint256 x) external pure returns (uint256) {
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }

        return z;
    }
}
