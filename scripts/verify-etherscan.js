// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { network } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  fs.readFile(
    "deployed.json",
    "utf-8",
    async function readFileCallback(err, data) {
      if (err) return console.err(err);
      // Verify source code
      if (network.name === "rinkeby") {
        data = JSON.parse(data);
        await hre.run("verify:verify", {
          address: data.address,
          constructorArguments: data.constructorArguments,
        });
        console.log(
          "Contract Source code verified on etherscan, network:",
          network.name,
          ", Address:",
          data.address
        );
      }
    }
  );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
