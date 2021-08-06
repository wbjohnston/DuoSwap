const {expect} = require("chai");
const { deployERC20Pair } = require("./shared/shared");

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
    it('can create a pool where none exists', async () => {
        const factory = await deployDuoSwapPoolFactory();
        const [tokenA, tokenB] = await deployERC20Pair();

        const pool = await factory.createPool(tokenA.address, tokenB.address);

        expect(pool.address).not.equals(0);
    });
    
    it('cannot create a pool if it exists already', async () => {
        const factory = await deployDuoSwapPoolFactory();
        const [tokenA, tokenB] = await deployERC20Pair();

        expect(await factory.createPool(tokenA.address, tokenB.address)).not.equals(0);
        expect(factory.createPool(tokenA.address, tokenB.address)).to.be.reverted;
    });
})