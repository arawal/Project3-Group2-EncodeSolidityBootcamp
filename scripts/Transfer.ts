import { ethers, Wallet } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()

// yarn run ts-node --files ./scripts/Transfer.ts deployedContractAddressHere addressToTransferToHere amountToTransferHere


async function main() {
    // connect to goerli testnet, using the private key from .env
    // attach to an instance of the ERC20Votes.sol contract and call the transfer function
    const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })
    // const provider = ethers.getDefaultProvider("hardhat");
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
    const toAddress = params[1];
    const tokenAmount = params[2];
    console.log(`transferring ${tokenAmount} tokens to ${toAddress} from token contract ${contractAddress}`);

    if (params.length <= 0) throw new Error("Not enough parameters");

    let tokenContract: MyToken;
    // create an instance of the contract
    const tokenFactory = new MyToken__factory(signer);
    tokenContract = await tokenFactory.attach(contractAddress);
    console.log(`interacting with ${tokenContract.address}`);

    // call the transfer function from the erc20 contract
    const tx = await tokenContract.transfer(toAddress, tokenAmount);
    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Transfer completed at block ${receipt.blockNumber}`);

}
main().catch((e) => {
    console.log(e);
    process.exitCode = 1;
})