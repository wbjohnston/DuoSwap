import { Contract, ethers } from "ethers"
import { useState } from "react";
import DuoSwapPoolFactoryContractType from "../../artifacts/contracts/DuoSwapPoolFactory.sol/DuoSwapPoolFactory.json"
import { useConfig } from "./useConfig";

export default function useDuoSwapFactoryContract(): Contract {
    const config = useConfig()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

    const DuoSwapPoolFactoryContract = new ethers.Contract(config.hotdogSwapPoolFactoryContractAddress, DuoSwapPoolFactoryContractType.abi, signer);
    const [contract] = useState(DuoSwapPoolFactoryContract);

    return contract
}
