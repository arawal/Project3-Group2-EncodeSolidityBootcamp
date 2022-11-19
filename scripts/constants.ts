import { ethers, Wallet } from "ethers";
import { Ballot__factory } from "../typechain-types";

const ballotContractAddress = "0x3dB15985d01971Fe4417d5dDd3B1F7E72fefF743";
const erc20ContractAddress = "0x772Ef1798896080b2Eb51b32E68c1E2EE696009F";

export async function SetupSigner() {
    const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })
    let wallet: Wallet;

    if (process.env.MNEMONIC != "") {
        wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
    } else {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
    }
    const signer = wallet.connect(provider)

    const ballotFactory = new Ballot__factory(signer);
    const ballotContract = await ballotFactory.attach(ballotContractAddress);

    return ballotContract;
}