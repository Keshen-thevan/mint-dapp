require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: ".env"})

const HTTP_URL = process.env.HTTP_URL;
const KEY = process.env.KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    mumbai:{
      url: HTTP_URL,
      accounts: [KEY],
    },
  },
};
