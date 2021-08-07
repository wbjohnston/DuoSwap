pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IDuoSwapPool.sol";
import "./DuoSwapPool.sol";

// SPDX-License-Identifier: MIT
contract DuoSwapPoolFactory {
    mapping(IERC20 => mapping(IERC20 => IDuoSwapPool)) public pools;

    event PoolCreated(address indexed who, IDuoSwapPool poolAddress);
    IDuoSwapPool[] private allPools;

    function createPool(ERC20 tokenA, ERC20 tokenB)
        external
        returns (IDuoSwapPool)
    {
        require(tokenA != tokenB);
        (tokenA, tokenB) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(
            pools[tokenA][tokenB] == DuoSwapPool(address(0)),
            "DuoSwap: Pool already created"
        );

        DuoSwapPool newPoolAddress = new DuoSwapPool(tokenA, tokenB);
        pools[tokenA][tokenB] = newPoolAddress;
        pools[tokenB][tokenA] = newPoolAddress;

        allPools.push(newPoolAddress);

        emit PoolCreated(msg.sender, newPoolAddress);

        return newPoolAddress;
    }
}
