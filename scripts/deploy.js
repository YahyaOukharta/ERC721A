// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { network } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);

  // We get the contract to deploy

  console.log("Deploying Azukinho on network ", network.name);
  console.log("");

  const Azukinho = await hre.ethers.getContractFactory("Azukinho");

  // Deploy contract
  const maxBatchSize = 10;
  const collectionSize = 10000;
  const amountForAuctionAndDev = 8900;
  const amountForDevs = 200;
  const azukinho = await Azukinho.deploy(
    maxBatchSize,
    collectionSize,
    amountForAuctionAndDev,
    amountForDevs
  );
  await azukinho.deployed();
  console.log("Azukinho contract deployed to:", azukinho.address);

  // Save contract address and constructor args in file for source code verification
  const data = {
    address: azukinho.address,
    constructorArguments: [
      maxBatchSize,
      collectionSize,
      amountForAuctionAndDev,
      amountForDevs,
    ],
  };
  const fs = require("fs");
  fs.writeFile("deployed.json", JSON.stringify(data, null, 2), "utf-8", () => {
    console.log("Saved Contract address and args to 'deployed.json'");
  });

  // Set base uri
  const baseURI =
    "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/"
  await azukinho.setBaseURI(baseURI);
  console.log("BaseURI set to :", baseURI);

  // Dev mint
  const devMintAmount = 200;
  await azukinho.devMint(devMintAmount);
  console.log("Minted for dev, amount:", devMintAmount);

  // Start public Sale
  const publicSaleTime = 1646063367; // https://www.epochconverter.com/
  await azukinho.setAuctionSaleStartTime(publicSaleTime);
  console.log(
    "Public sale time set to:",
    publicSaleTime,
    " , view human readable time on epochconverter.com"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
