const {expect} = require("chai");
const { deployERC20Pair } = require("./shared/shared");
import { Contract } from "ethers";
// @ts-ignore
import { ethers } from "hardhat";

async function deployDuoSwapPoolFactory() {
    const DuoSwapMath = await ethers.getContractFactory("DuoSwapMath");
    const math = await DuoSwapMath.deploy();
    await math.deployed();

    const DuoSwapPoolFactory = await ethers.getContractFactory("DuoSwapPoolFactory", {
        libraries: {
            "DuoSwapMath": math.address
        }
    });
    const factory = await DuoSwapPoolFactory.deploy();

    await factory.deployed();

    return factory;
}


describe('DuoSwapPoolFactory', () => {
    let tokenA: Contract;
    let tokenB: Contract;
    let poolFactory: Contract;
    beforeEach(async () => {
        [tokenA, tokenB] = await deployERC20Pair();
        poolFactory = await deployDuoSwapPoolFactory();
    })

    it('can create a pool if it doesn\'t exist already', async () => {
        const pool = await poolFactory.createPool(tokenA.address, tokenB.address);

        expect(pool.address).not.equals(0);
    });
    
    it('cannot create a pool if it exists already', async () => {
        expect(await poolFactory.createPool(tokenA.address, tokenB.address)).to.not.equals(0);
        expect(poolFactory.createPool(tokenA.address, tokenB.address)).to.be.reverted;
    });
})