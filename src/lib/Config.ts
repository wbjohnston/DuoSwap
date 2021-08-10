import { ChainId, Config } from "@usedapp/core";



export interface AppConfig {
    infuraProjectId: string;
    hotdogSwapPoolFactoryContractAddress: string;
}

export function getUseDappProviderConfigFromConfig(config: AppConfig): Config {
    return {
        readOnlyChainId: ChainId.Ropsten,
        readOnlyUrls: {
            [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${config.infuraProjectId}`,
            [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${config.infuraProjectId}`,
        }

    }
}

export function getAppConfigFromEnvironment(overrides?: Partial<AppConfig>): AppConfig {
    return {
        infuraProjectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string, // TODO: error handling
        hotdogSwapPoolFactoryContractAddress: process.env.NEXT_PUBLIC_HOTDOG_SWAP_POOL_FACTORY_CONTRACT_ADDRESS as string,
        ...overrides
    }
}