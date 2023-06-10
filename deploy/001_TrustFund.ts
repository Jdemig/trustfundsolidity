import { DeployFunction } from "hardhat-deploy/types";
import { isLocalEnv, VERIFICATION_BLOCK_CONFIRMATIONS } from "../utils/environment";
import { TrustFund } from "../types";

const func: DeployFunction = async ({
    ethers: { getContract },
    deployments: { deploy, getOrNull },
    getNamedAccounts,
    network,
}) => {
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = isLocalEnv(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    console.log("Deployer", deployer);
    console.log();
    console.log("TrustFund pre-deploy address:", (await getOrNull("TrustFund"))?.address);


    await deploy("TrustFund", {
        proxy: {
            owner: deployer,
        },
        from: deployer,
        log: true,
        waitConfirmations: waitBlockConfirmations,
        autoMine: true,
    });

    const trustFund = await getContract<TrustFund>("TrustFund");

    console.log();
    console.log("TrustFund address:", await trustFund.address);
    console.log("TrustFund deploy completed.");
    console.log();
};

func.tags = ["TrustFund"];

export default func;
