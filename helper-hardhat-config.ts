import "dotenv/config";
import { HardhatNetworkForkingUserConfig } from "hardhat/types";

const FORK: ePolygonNetwork = (process.env.FORK || "") as ePolygonNetwork;
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
    ? parseInt(process.env.FORK_BLOCK_NUMBER)
    : 0;

const GWEI = 1000 * 1000 * 1000;

export enum ePolygonNetwork {
    polygon = "polygon",
    mumbai = "mumbai",
}

export interface iPolygonParamsPerNetwork<T> {
    [ePolygonNetwork.polygon]: T;
    [ePolygonNetwork.mumbai]: T;
}

export type iParamsPerNetwork<T> =
    | iPolygonParamsPerNetwork<T>;

export type eNetwork = ePolygonNetwork;

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
    [ePolygonNetwork.mumbai]: process.env.MUMBAI_RPC_PROVIDER,
    [ePolygonNetwork.polygon]: process.env.POLYGON_RPC_PROVIDER,
};

export const NETWORKS_DEFAULT_GAS: iParamsPerNetwork<number> = {
    [ePolygonNetwork.mumbai]: 120 * GWEI,
    [ePolygonNetwork.polygon]: 120 * GWEI,
};

export const BLOCK_TO_FORK: iParamsPerNetwork<number | undefined> = {
    [ePolygonNetwork.mumbai]: undefined,
    [ePolygonNetwork.polygon]: undefined,
};

export const buildForkConfig = (): HardhatNetworkForkingUserConfig | undefined => {
    let forkMode: any;
    if (FORK) {
        forkMode = {
            url: NETWORKS_RPC_URL[FORK],
        };
        if (FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK]) {
            forkMode.blockNumber = FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK];
        }
    }
    return forkMode;
};