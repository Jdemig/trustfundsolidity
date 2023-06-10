import { ethers } from "ethers";

export class SignError extends Error {
    constructor(message) {
        super(message);
        this.name = "SignError";
    }
}
export class DeniedSignature extends Error {
    constructor(message) {
        super(message);
        this.name = "DeniedSignature";
    }
}

export class RequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "RequestError";
    }
}

// export type ExternalProvider = {
//     isMetaMask?: boolean;
//     isStatus?: boolean;
//     host?: string;
//     path?: string;
//     sendAsync?: (
//         request: { method: string; params?: Array<any> },
//         callback: (error: any, response: any) => void
//     ) => void;
//     send?: (request: { method: string; params?: Array<any> }, callback: (error: any, response: any) => void) => void;
//     request?: (request: { method: string; params?: Array<any> }) => Promise<any>;
// };

export const sign = async ({ provider, domainSeparator, nonce, from, functionSignature, contract, chainId, version = "1" }) => {
    const typedData = getTypedData({
        name: domainSeparator,
        version,
        chainId,
        verifyingContract: contract,
        nonce,
        from,
        functionSignature,
    });

    try {
        return provider.send("eth_signTypedData_v4", [from, JSON.stringify(typedData)]);
    } catch (e) {
        if (e.message.includes("User denied message signature")) {
            throw new DeniedSignature(e.message);
        }
        throw new SignError(e.message);
    }
};

export const getRsvFromSig = (sig) => {
    const signature = sig.substring(2);
    const r = "0x" + signature.substring(0, 64);
    const s = "0x" + signature.substring(64, 128);
    const v = parseInt(signature.substring(128, 130), 16);

    return { r, s, v: v < 2 ? 27 + v : v };
};

export const getTypedData = (data) => {
    const { name, version, chainId, verifyingContract, nonce, from, functionSignature } = data;
    return {
        types: {
            EIP712Domain: [
                {
                    name: "name",
                    type: "string",
                },
                {
                    name: "version",
                    type: "string",
                },
                {
                    name: "verifyingContract",
                    type: "address",
                },
                {
                    name: "salt",
                    type: "bytes32",
                },
            ],
            MetaTransaction: [
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "from",
                    type: "address",
                },
                {
                    name: "functionSignature",
                    type: "bytes",
                },
            ],
        },
        domain: {
            name,
            version,
            verifyingContract,
            salt: "0x" + Number(chainId).toString(16).padStart(64, "0"),
        },
        primaryType: "MetaTransaction",
        message: {
            nonce: parseInt(nonce),
            from,
            functionSignature,
        },
    };
};