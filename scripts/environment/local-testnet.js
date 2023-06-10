const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

if (!process.env.FORK) {
    console.log("ERROR: FORK environment variable not set.");
    return;
}

let dataCopied = false;

const localTestnetProcess = exec("npx hardhat node --no-deploy --show-stack-traces", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
});

localTestnetProcess.stdout.on("data", function (data) {
    console.log(data);

    if (!dataCopied) {
        const deployPath = "./deployments/localhost";

        fs.cpSync("./deployments/" + process.env.FORK, deployPath, { recursive: true, force: true });

        const filename = path.join(deployPath, ".chainId");

        const fileData = fs.readFileSync(filename, "utf8");

        let result = fileData.replace(/137/g, "31337");
        result = fileData.replace(/80001/g, "31337");

        fs.writeFileSync(filename, result, "utf8");

        dataCopied = true;
    }
});




