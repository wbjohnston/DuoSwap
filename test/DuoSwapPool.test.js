const { expect } = require("chai");
const { ethers } = require("ethers");
const { deployERC20Pair } = require("./shared/shared");


async function deployDuoSwapPool(tokenAAddress, tokenBAddress) {
    const DuoSwapMath = await ethers.getContractFactory("DuoSwapMath");
    const math = await DuoSwapMath.deploy();
    await math.deployed();

    const DuoSwapPool = await ethers.getContractFactory("DuoSwapPool", {
        libraries: {
            "DuoSwapMath": math.address
        }
    });
    const pool = await DuoSwapPool.deploy(tokenAAddress, tokenBAddress);
    await pool.deployed();

    return pool;

}

describe('DuoSwapPool', () => {

    it('starts uninitialized', async () => {
        const [tokenA, tokenB] = await deployERC20Pair();
        const pool = await deployDuoSwapPool(tokenA.address, tokenB.address);

        expect(await pool.totalLiqudity()).to.equal(0);
    });
    it('can initialize the pool with tokens in a 1:1 ratio', async () => {
        const [tokenA, tokenB] = await deployERC20Pair();
        const pool = await deployDuoSwapPool(tokenA.address, tokenB.address);

        const {owner} = ethers.getSigners();

        tokenA._mint(owner, 10 * (10 ** 18));
    });
})