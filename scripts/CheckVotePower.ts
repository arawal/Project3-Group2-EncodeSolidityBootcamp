import { ethers, Signer, Wallet } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory, Ballot__factory } from "../typechain-types";
dotenv.config()

// yarn run ts-node --files ./scripts/CheckVotePower.ts deployedContractAddressHere Address here

async function checkVotePower() {
    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0]; // '0x284A7042be8749c1b3A35509F27ebb09c2737956'
    const targetAccount = params[1];
    const ballotContractAddress = '0x3dB15985d01971Fe4417d5dDd3B1F7E72fefF743';
    if (params.length <= 0) throw new Error("Not enough parameters");


    const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })
    let wallet: Wallet;

    if (process.env.MNEMONIC != "") {
        wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
    } else {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
    }
    const signer = wallet.connect(provider);
    const ballotFactory = new Ballot__factory(signer);
    const ballotContract = await ballotFactory.attach(ballotContractAddress);

    // Get the block number from when the contract was launched
    const targetBlockNumber = await ballotContract.targetBlockNumber();
    console.log(`the contract was launched on block ${targetBlockNumber}`);

    const MyTokenFactory = new MyToken__factory();
    const MyTokenContract = MyTokenFactory.attach(contractAddress);

    // Get the current block, which to use?
    //const currentBlock = await provider.getBlockNumber();
    const currentBlock = await provider.getBlock("latest");
    console.log(`the current block is ${currentBlock}`);

    // As per documentation, to get past votes, the blocknumber must have been already mined
    // So here we make sure that we have a larger block number
    if (currentBlock.number > targetBlockNumber.toNumber()) {
        console.log(`${currentBlock.number} is greater than ${targetBlockNumber.toNumber()}`);
        // Get passed voting power from when the Ballot contract was launched. Not current voting power.
        console.log(`Checking voting power for account: ${targetAccount}`);
        const pastVotes = await ballotContract.votePower(targetAccount);
        console.log(`${targetAccount} has a voting power of ${pastVotes} for Ballot ${ballotContractAddress}`);
    } else {
        console.log("Contract has just launched. Please wait until next block number");
    }
}

checkVotePower().catch((e) => {
    console.log(e);
    process.exitCode = 1;
})
