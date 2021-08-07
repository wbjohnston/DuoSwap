import { Contract } from "ethers";
// @ts-ignore
import { ethers } from "hardhat";



export async function deployERC20Pair(): Promise<[Contract, Contract]> {
    const tokenA = await deployERC20Token("foo", "FOO");
    const tokenB = await deployERC20Token("bar", "BAR");

    return [tokenA, tokenB];
}

export async function deployERC20Token(name: string, symbol: string): Promise<Contract> {
    const ERC20TokenFactory = await ethers.getContractFactory("ERC20");
    const token = await ERC20TokenFactory.deploy(name, symbol);

    await token.deployed();

    return token;
}

