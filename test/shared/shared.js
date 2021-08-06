


async function deployERC20Pair() {
    const tokenA = await deployERC20Token("foo", "FOO");
    const tokenB = await deployERC20Token("bar", "BAR");

    return [tokenA, tokenB];
}

async function deployERC20Token(name, symbol) {
    const ERC20TokenFactory = await ethers.getContractFactory("ERC20");
    const token = await ERC20TokenFactory.deploy(name, symbol);

    await token.deployed();

    return token;
}

module.exports = { deployERC20Token, deployERC20Pair};