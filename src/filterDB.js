const db = require("quick.db");
const ethers = require("ethers");

const rawAbi = require("./abi.json");
const abi = JSON.parse(JSON.stringify(rawAbi));

async function initDB() {
    let arr = [];
    for (let i = 421; i <= 5999; i++) {
        arr.push(i);
    }
    db.set("Ghoulies", { currentIndex: 0, mintable: arr });
}

async function filterDB() {
    let mintableGhoulies = [];
    mintableGhoulies = await db.get("Ghoulies.mintable");
    if (!mintableGhoulies) {
        initDB();
        mintableGhoulies = await db.get("Ghoulies.mintable");
    }
    const contractAddress = "0x2570f12074Ac007aEc09426C5D092Dd2a1Fa3E5F";

    const provider = new ethers.providers.InfuraProvider(
        "mainnet",
        "63ded85a9a5442c6ae2b94c2e97fb8c4"
    );

    const GhouliesContract = new ethers.Contract(contractAddress, abi, provider);

    for (i = 421; i <= 1015; i++) {
        let URI = await GhouliesContract.tokenURI(i.toString());
        let jsonIndex = parseInt(URI.substr(81, 88).slice(0, -5));
        console.log("ID: ", i, " ", jsonIndex);
        if (mintableGhoulies.includes(jsonIndex)) {
            mintableGhoulies.splice(mintableGhoulies.indexOf(jsonIndex), 1);
        }
    }
    mintableGhoulies.sort();
    db.set("Ghoulies.mintable", mintableGhoulies);
    console.log(db.get("Ghoulies.mintable"));
}
filterDB();
module.exports = { initDB, filterDB };
