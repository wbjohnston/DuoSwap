pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// SPDX-License-Identifier: MIT
interface IDuoSwapPool {
    event LiquidityAdded(address indexed who, uint256 amount, IERC20 token);
    event Swapped(address indexed who, uint256 amountIn, uint256 amountOut, IERC20 targetToken);
    
    function initialize(uint256 tokenAAmount, uint256 tokenBAmount) external returns (uint256 liqudityShares);
    
    function withdraw(uint256 liqudityShares) external returns (uint256 amountA, uint256 amountB);
    
    function deposit(uint256 amountA, uint256 amountB) external returns (uint256 liqudityShares);
    
    function swapAToB(uint256 amount) external returns (uint256);
    
    function swapBToA(uint256 amount) external returns (uint256);
}