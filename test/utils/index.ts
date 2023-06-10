import { Contract } from "ethers";
import { ethers } from "hardhat";

export async function setupUsers<T extends { [contractName: string]: Contract }>(
    addresses: string[],
    contracts: T
): Promise<({ address: string } & T)[]> {
    const users: ({ address: string } & T)[] = [];
    for (const address of addresses) {
        users.push(await setupUser(address, contracts));
    }
    return users;
}

export async function setupUser<T extends { [contractName: string]: Contract }>(
    address: string,
    contracts: T
): Promise<{ address: string } & T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = { address };
    for (const key of Object.keys(contracts)) {
        user[key] = contracts[key].connect(await ethers.getSigner(address));
    }
    return user as { address: string } & T;
}

export function getRandomEthereumAddress(): string {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
}

export function getRandomString(): string {
    return (Math.random() + 1).toString(36);
}

export function encodeAddressLeaf(address: string) {
    // Same as `abi.encodePacked` in Solidity
    return ethers.utils.defaultAbiCoder.encode(["address"], [address]);
}

export function encodeStringLeaf(value: string) {
    // Same as `abi.encodePacked` in Solidity
    return ethers.utils.defaultAbiCoder.encode(["string"], [value]);
}

export function getRandomUser(users) {
    const randomAddressIndex = Math.floor(Math.random() * users.length);

    return users[randomAddressIndex];
}