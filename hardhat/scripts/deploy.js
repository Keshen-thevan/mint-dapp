
const { ethers } = require("hardhat")
require("dotenv").config({path: ".env"})


async function main() {
  const mintContract = await ethers.getContractFactory("Mint");
  const deployedMintContract = await mintContract.deploy();
  await deployedMintContract.deployed()
  console.log("Mint contract address: ", deployedMintContract.address)

}

main()
.then(() => process.exit(0))
.catch((err) =>{
  console.error(err)
  process.exit(1)
})