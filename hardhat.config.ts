import "dotenv/config";

import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";

import "hardhat-deploy";

import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";

import "hardhat-contract-sizer";

import "solidity-coverage";

import "@ethersproject/abi";

import { HardhatUserConfig } from "hardhat/config";

import {
    NETWORKS_RPC_URL,
    NETWORKS_DEFAULT_GAS,
    buildForkConfig,
    eNetwork,
    ePolygonNetwork
} from "./helper-hardhat-config";

import { accounts } from "./test-wallets";

const { DEPLOYER_WALLET, POLYGONSCAN_API, REPORT_GAS } = process.env;

console.log("DEPLOYER_WALLET", DEPLOYER_WALLET);

const DEFAULT_BLOCK_GAS_LIMIT = 9500000;
const DEFAULT_GAS_MUL = 5;
const BUIDLEREVM_CHAINID = 31337;

const getCommonNetworkConfig = (networkName: eNetwork, networkId: number) => ({
    url: NETWORKS_RPC_URL[networkName],
    blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
    gasMultiplier: DEFAULT_GAS_MUL,
    gasPrice: NETWORKS_DEFAULT_GAS[networkName],
    chainId: networkId,
    accounts: DEPLOYER_WALLET ? [DEPLOYER_WALLET] : [accounts[0].secretKey, accounts[1].secretKey],
});

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.6.6",
            },
            {
                version: "0.8.9",
            },
            {
                version: "0.8.10",
            },
            {
                version: "0.8.11",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 200, // default
            },
        },
    },
    networks: {
        hardhat: {
            blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
            gas: DEFAULT_BLOCK_GAS_LIMIT,
            chainId: BUIDLEREVM_CHAINID,
            throwOnTransactionFailures: true,
            throwOnCallFailures: true,
            accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
                privateKey: secretKey,
                balance,
            })),
            forking: buildForkConfig(),
            allowUnlimitedContractSize: true,
        },
        localhost: {
            //chainId: process.env.FORK ? 41337 : 31337,
            blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
            gas: DEFAULT_BLOCK_GAS_LIMIT,
            gasPrice: 80000000000,
            throwOnTransactionFailures: true,
            throwOnCallFailures: true,
            forking: buildForkConfig(),
            accounts: accounts.map(({ secretKey }: { secretKey: string; balance: string }) => secretKey),
        },
        mumbai: getCommonNetworkConfig(ePolygonNetwork.mumbai, 80001),
        polygon: getCommonNetworkConfig(ePolygonNetwork.polygon, 137),
    },
    namedAccounts: {
        deployer: {
            hardhat: 8,
            localhost: 8,
            //default: process.env.HP_DEPLOYER && process.env.FORK ? 8 : 0,
            mumbai: 0,
            polygon: 0,
        },
        wETH: {
            polygon: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
            localhost: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // forked
        },
    },
    typechain: {
        outDir: "types",
        target: "ethers-v5",
    },
    mocha: { timeout: 66_666 },
    etherscan: {
        apiKey: POLYGONSCAN_API,
    },
    gasReporter: {
        enabled: !!REPORT_GAS,
        currency: "USD",
        //outputFile: "gas-report.txt",
        //real cost = transaction cost * price on eth station, then convert this gwei to eth
    },
    contractSizer: {
        runOnCompile: false,
        only: [
            "TrustFund",
        ],
    },
    external: process.env.FORK
        ? {
            deployments: {
                // process.env.FORK will specify the network that the fork is made from.
                // these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
                hardhat: ["deployments/" + process.env.FORK],
                localhost: ["deployments/" + process.env.FORK],
            },
        }
        : undefined,
};

export default config;
