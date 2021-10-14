const express = require("express");
const cors = require("cors");

const { LazyMinter } = require("../lib");
const ethers = require("ethers");

const db = require("quick.db");

const app = express();
const port = 7000;
app.options("*", cors());
app.use(cors({ origin: "*", credentials: true }));

const itx = new ethers.providers.InfuraProvider("rinkeby", "63ded85a9a5442c6ae2b94c2e97fb8c4");
const minter = new ethers.Wallet(
    "abd445f0700f2f164bcce0a54da23037b06f83c4e1838cf91b2d7453651fe75d",
    itx
);

const contractAddress = "0x2570f12074Ac007aEc09426C5D092Dd2a1Fa3E5F";
const lazyMinter = new LazyMinter({ contractAddress: contractAddress, signer: minter });
const minPrice = ethers.utils.parseEther("0.0666");

app.get("/create/voucher", async (req, res) => {
    if (!req.query.count) {
        res.status(400).send("Count value not provided");
    }

    let count = req.query.count;
    let vouchers = [];

    if (count > 20) {
        count = 20;
    }

    for (let i = 0; i < count; i++) {
        let currentIndex = await db.get("Ghoulies.currentIndex");
        let GhoulieJSON = await db.get(`Ghoulies.mintable[${currentIndex}]`);
        if (GhoulieJSON >= 9902) {
            return res.status(404).send("All vouchers claimed");
        }
        let cid = "QmaaNHcaU8HGHz7w3tJLnZactBGwdgGAHsRyQfxaqiAv89/" + GhoulieJSON + ".json";

        let voucher = await lazyMinter.createVoucher(false, cid, minPrice);
        console.log(voucher);
        vouchers.push(voucher);
        currentIndex++;
        await db.set("Ghoulies.currentIndex", currentIndex);
    }
    // console.log(currentVoucherId);
    res.status(200).send(vouchers);
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
