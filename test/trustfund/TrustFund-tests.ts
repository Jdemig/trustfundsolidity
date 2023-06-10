import { expect } from "../chai-setup";
import { ethers, deployments, getNamedAccounts, getUnnamedAccounts, network } from "hardhat";

// we import our utilities
import { setupUsers, setupUser } from "../utils";
import { TrustFund } from "../../types";
import { isLocalEnv } from "../../utils/environment";
import { BigNumber } from "ethers";

const {
    utils: { parseUnits, formatEther },
} = ethers;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("TrustFund Tests", () => {

    async function setup() {
        const { deployer } = await getNamedAccounts();

        // only deploy if local testing
        if (isLocalEnv(network.name)) {
            // it first ensures the deployment is executed and reset (use of evm_snapshot for faster tests)
            await deployments.fixture(["TrustFund"]);
        }

        // we get an instantiated contract in the form of a ethers.js Contract instance:
        const contracts = {
            trustFund: await ethers.getContract<TrustFund>("TrustFund"),
        };

        const users = await setupUsers(await getUnnamedAccounts(), contracts);

        const signer = await ethers.getSigner(deployer);

        return {
            ...contracts,
            users,
            owner: await setupUser(deployer, contracts),
        };
    }

    it("Should deposit funds and get amount equal to the same as deposited", async () => {
        const { users } = await setup();

        const timestamp = Math.round((new Date()).getTime() / 1000 + 10); // add 60 seconds

        const txn = await users[0].trustFund.depositFunds(users[0].address, timestamp, {
           value: parseUnits("0.01", "ether"),
        });

        console.log(txn);

        const receipt = await txn.wait();

        console.log(receipt);

        const amount = await users[0].trustFund.getFundsAmount(users[0].address);

        console.log(amount.toString());


        const etherAmount = formatEther(amount);

        console.log(etherAmount);

        expect(etherAmount).to.equal("0.01");
    });


    it("Should deposit funds and withdraw funds", async () => {
        const { users } = await setup();

        console.log(users[0].address);

        const timestamp = Math.round((new Date()).getTime() / 1000 + 6); // add 60 seconds

        const txn = await users[0].trustFund.depositFunds(users[0].address, timestamp, {
            value: parseUnits("0.01", "ether")
        });

        console.log(txn);

        const receipt = await txn.wait();

        console.log(receipt);

        await timeout(12000);

        const fundsTxn = await users[0].trustFund.withdrawFunds();

        console.log(fundsTxn);

        const fundReceipts = await fundsTxn.wait();

        console.log(fundReceipts);


    });


});
