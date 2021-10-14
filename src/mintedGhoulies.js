const ethers = require("ethers");
const fs = require("fs");

const rawAbi = require("./abi.json");
const abi = JSON.parse(JSON.stringify(rawAbi));

async function mintedGhoulies() {
    let minted = {};
    const contractAddress = "0x2570f12074Ac007aEc09426C5D092Dd2a1Fa3E5F";
    const provider = new ethers.providers.InfuraProvider(
        "mainnet",
        "63ded85a9a5442c6ae2b94c2e97fb8c4"
    );
    const GhouliesContract = new ethers.Contract(contractAddress, abi, provider);

    for (i = 421; i <= 1056; i++) {
        let URI = await GhouliesContract.tokenURI(i.toString());
        let jsonIndex = parseInt(URI.substr(81, 88).slice(0, -5));
        console.log("ID: ", i, " ", jsonIndex);
        minted[i] = jsonIndex;
    }
    await fs.writeFileSync("MintedGhoulies.json", JSON.stringify(minted, null, 2));
}

mintedGhoulies();
