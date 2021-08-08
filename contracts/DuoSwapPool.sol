pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./interfaces/IDuoSwapPool.sol";
import "./libraries/DuoSwapMath.sol";

// SPDX-License-Identifier: MIT
contract DuoSwapPool is IDuoSwapPool, Context {
    using SafeMath for uint256;
    using DuoSwapMath for uint256;

    ERC20 public tokenA;

    ERC20 public tokenB;

    uint256 public totalLiqudity;

    mapping(address => uint256) public liquidityOf;

    // amount of token A managed by this contract
    uint256 public aReserves = 0;

    // amount of token B managed by this contract
    uint256 public bReserves = 0;

    uint256 private constant _percentageSignificantFigures = 1000;

    bool private _locked = false;

    event PoolInitialized(
        address indexed who,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityMinted
    );
    event Withdrawn(
        address indexed who,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityWithdrawn
    );
    event Deposited(
        address indexed who,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityMinted
    );
    event Swapped(
        address indexed who,
        uint256 amountFrom,
        IERC20 tokenFrom,
        uint256 amountT,
        IERC20 tokenTo
    );

    modifier lock() {
        require(_locked == false);
        _locked = true;
        _;
        _locked = false;
    }

    modifier isInitialized() {
        require(totalLiqudity != 0);
        _;
    }

    // solhint-disable-next-line
    constructor(ERC20 tokenA_, ERC20 tokenB_) {
        tokenA = tokenA_;
        tokenB = tokenB_;
    }

    /// @inheritdoc IDuoSwapPool
    function initialize(uint256 amountA, uint256 amountB)
        external
        override
        returns (uint256)
    {
        require(
            amountA > 0 && amountB > 0,
            "DuoSwap: must deposit non-zero amounts of both tokens"
        );
        require(totalLiqudity == 0, "DuoSwap: pool already initialized");

        aReserves = aReserves.add(amountA);
        bReserves = bReserves.add(amountB);

        uint256 liquidityShares = (amountA * amountB).sqrt();

        totalLiqudity = totalLiqudity.add(liquidityShares);
        liquidityOf[_msgSender()] = liquidityOf[_msgSender()].add(
            liquidityShares
        );

        require(tokenA.transferFrom(_msgSender(), address(this), amountA));
        require(tokenB.transferFrom(_msgSender(), address(this), amountB));

        emit PoolInitialized(_msgSender(), amountA, amountB, liquidityShares);
        return liquidityShares;
    }

    /// @inheritdoc IDuoSwapPool
    function withdraw(uint256 liquidityShares)
        external
        override
        lock
        isInitialized
        returns (uint256, uint256)
    {
        require(
            liquidityOf[_msgSender()] >= liquidityShares,
            "DuoSwap: cannot withdraw more liquidity than you have"
        );

        uint256 percentShareOfLiquidityToWithdraw = liquidityShares
            .mul(100)
            .div(totalLiqudity);

        uint256 amountA = aReserves.mul(100).div(
            percentShareOfLiquidityToWithdraw
        );
        uint256 amountB = bReserves.mul(100).div(
            percentShareOfLiquidityToWithdraw
        );

        liquidityOf[_msgSender()] = liquidityOf[_msgSender()].sub(
            liquidityShares
        );

        require(tokenA.transferFrom(address(this), _msgSender(), amountA));
        require(tokenB.transferFrom(address(this), _msgSender(), amountB));

        return (amountA, amountB);
    }

    /// @inheritdoc IDuoSwapPool
    function deposit(uint256 amountA, uint256 amountB)
        external
        override
        lock
        isInitialized
        returns (uint256)
    {
        uint256 liquidityShares = _getLiquiditySharesMinted(
            amountA,
            amountB,
            aReserves,
            bReserves
        );

        liquidityOf[_msgSender()] = liquidityOf[_msgSender()].add(
            liquidityShares
        );
        totalLiqudity = totalLiqudity.add(liquidityShares);

        require(tokenA.transferFrom(_msgSender(), address(this), amountA));
        require(tokenB.transferFrom(_msgSender(), address(this), amountB));

        return liquidityShares;
    }

    /// @inheritdoc IDuoSwapPool
    function swapAToB(uint256 amount)
        external
        override
        isInitialized
        returns (uint256)
    {
        return _swap(amount, tokenA, tokenB);
    }

    /// @inheritdoc IDuoSwapPool
    function swapBToA(uint256 amount)
        external
        override
        isInitialized
        returns (uint256)
    {
        return _swap(amount, tokenB, tokenA);
    }

    function _swap(
        uint256 amount,
        ERC20 inputToken,
        ERC20 outputToken
    ) private returns (uint256) {
        require(inputToken == tokenA || inputToken == tokenB);
        require(outputToken == tokenA || outputToken == tokenB);
        require(inputToken != outputToken);

        (uint256 inputReserves, uint256 outputReserves) = inputToken == tokenA
            ? (aReserves, bReserves)
            : (bReserves, aReserves);

        uint256 outputTokenAmount = _getOutputAmount(
            amount,
            inputReserves,
            outputReserves
        );

        // update reserves
        (aReserves, bReserves) = inputToken == tokenA
            ? (aReserves.add(amount), bReserves.sub(outputTokenAmount))
            : (aReserves.sub(outputTokenAmount), bReserves.add(amount));

        require(inputToken.transferFrom(_msgSender(), address(this), amount));
        require(
            outputToken.transferFrom(
                address(this),
                _msgSender(),
                outputTokenAmount
            )
        );

        emit Swapped(
            _msgSender(),
            amount,
            inputToken,
            outputTokenAmount,
            outputToken
        );

        return outputTokenAmount;
    }

    function _getOutputAmount(
        uint256 inputAmount,
        uint256 inputReserves,
        uint256 outputReserves
    ) private pure returns (uint256) {
        uint256 inputAmountWithFee = inputAmount; /*.mul(1000.sub(fee));*/ // TODO: take fee
        uint256 numerator = inputAmountWithFee.mul(100).mul(outputReserves);
        uint256 denominator = inputReserves.mul(100).add(inputAmountWithFee);
        return numerator.div(denominator);
    }

    function _getLiquiditySharesMinted(
        uint256 amountA,
        uint256 amountB,
        uint256 reservesA,
        uint256 reservesB
    ) private pure returns (uint256) {
        return 0;
    }
}
