// this script calls the delegate function in the live instance of the MyToken contract
import { ethers, Wallet } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()

// yarn run ts-node --files ./scripts/Delegate.ts deployedContractAddressHere addressToDelegateToHere


async function main() {
    // connect to goerli testnet, using the private key from .env
    // attach to an instance of the Ballot.sol contract and call the 
    // const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })
    const provider = ethers.getDefaultProvider("hardhat");
    let wallet: Wallet;

    // check for accounts to use as signer in .env via mnemonic or private key
    if (process.env.MNEMONIC != "") {
        wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
    } else {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
    }
    const signer = wallet.connect(provider)
    const balanceBN = await signer.getBalance();

    console.log(`Connected to ${signer.address}`);
    console.log(`Balance: ${balanceBN.toString()} Wei`);

    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    const delegateAddress = params[1];
    console.log(`delegating voting power to ${delegateAddress} for contract ${contractAddress}`);

    if (params.length <= 0) throw new Error("Not enough parameters");

    let tokenContract: MyToken;
    // create an instance of the contract using the 
    const tokenFactory = new MyToken__factory(signer);
    tokenContract = await tokenFactory.attach(contractAddress);
    console.log(`interacting with ${tokenContract.address}`);

    // call the delegate function on the contract
    const tx = await tokenContract.delegate(delegateAddress);
    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Votes delegated at block ${receipt.blockNumber}`);

}

main().catch((e) => {
    console.log(e);
    process.exitCode = 1;
})