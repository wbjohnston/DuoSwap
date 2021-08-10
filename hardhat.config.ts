import '@typechain/hardhat'
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";
import "dotenv"


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploys smart contracts", async (taskArgs, hre) => {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Deploying contract to this chain:", await deployer.getChainId())

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DuoSwapMath = await hre.ethers.getContractFactory("DuoSwapMath");
  const math = await DuoSwapMath.deploy();
  await math.deployed();

  const DuoSwapPoolFactory = await hre.ethers.getContractFactory("DuoSwapPoolFactory", {
    libraries: {
      "DuoSwapMath": math.address
    }
  }); const factory = await DuoSwapPoolFactory.deploy();

  console.log("Factory address:", factory.address);

})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/175f8829b9e143c6a2a80c9ed2cd0fed",
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    }
  },
  solidity: {
    version: "0.8.4"
  },
};

export default config;
