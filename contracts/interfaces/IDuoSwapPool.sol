pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// SPDX-License-Identifier: MIT
abstract contract IDuoSwapPool {
    event LiquidityAdded(address indexed who, uint256 amount, IERC20 token);
    event Swapped(
        address indexed who,
        uint256 amountIn,
        uint256 amountOut,
        IERC20 targetToken
    );

    /// @notice Initialize a liqudity pool with tokens, returning the number of liqudity shares minted
    /// @param tokenAAmount number of tokenA to seed the liqudity pool with
    /// @param tokenBAmount number of tokenB to seed the liqudity pool witht
    /// @return liqudityShares number of liquidity shares minted
    function initialize(uint256 tokenAAmount, uint256 tokenBAmount)
        external
        virtual
        returns (uint256 liqudityShares);

    /// @notice Exchange liqudity shares for an amount of `tokenA` and `tokenB`
    /// @param liqudityShares number of liqudity shares to exchange
    /// @return amountA number of `tokenA` tokens sent to user in exchange for liquidity shares
    /// @return amountB number of `tokenB` tokens sent to user in exchange for liquidity shares
    function withdraw(uint256 liqudityShares)
        external
        virtual
        returns (uint256 amountA, uint256 amountB);

    /// @notice Deposit tokens in exchange for liquidityShares
    /// @param amountA number of tokenA tokens to deposit into the pool
    /// @param amountB number of tokenB tokens to deposit into the pool
    /// @return liqudityShares number of liquidity shares earned for deposit
    function deposit(uint256 amountA, uint256 amountB)
        external
        virtual
        returns (uint256 liqudityShares);

    /// @notice Swap tokenA for tokenB
    /// @param amount number of tokenA tokens
    /// @return number of tokenB tokens swapped for
    function swapAToB(uint256 amount) external virtual returns (uint256);

    /// @notice Swap tokenB for tokenA
    /// @param amount number of tokens to swap
    /// @return number of tokens swapped for
    function swapBToA(uint256 amount) external virtual returns (uint256);
}
