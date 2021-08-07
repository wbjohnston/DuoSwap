const { expect } = require("chai");
// @ts-ignore
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { deployERC20Pair } from "./shared/shared";


async function deployDuoSwapPool(tokenAAddress: string, tokenBAddress: string): Promise<Contract> {
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
    let tokenA: Contract;
    let tokenB: Contract;
    let pool: Contract;

    beforeEach(async () => {
        [tokenA, tokenB] = await deployERC20Pair();
        pool = await deployDuoSwapPool(tokenA.address, tokenB.address);
    })


    it('starts uninitialized', async () => {
        expect(await pool.totalLiqudity()).to.equal(0);
    });

})