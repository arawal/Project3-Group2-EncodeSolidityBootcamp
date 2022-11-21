import { ethers, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()



async function vote() {
    // TODO
    let ballotContract: Ballot;

    const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })

    let wallet: Wallet;

    // check for accounts to use as signer in .env via mnemonic or private key
    if (process.env.MNEMONIC != "") {
        wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
    } else {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
    }
    const signer = wallet.connect(provider)
    
    const args = process.argv.slice(2);
    const proposal = args[0];  // proposal index of 1/3 proposals
    const voter = args[1]; // voter by address
    const amount = args[2];   // amount
    const ballotContractAddress = args[3];   // contract address
    console.log(`Input contract address: ${ballotContractAddress}`);
    console.log(`Voting for ${proposal} from address ${voter} with amount ${amount}`);

    if (args.length <= 0) throw new Error("Not enough parameters");

    // create an instance of the contract using the 
    const ballotFactory = new Ballot__factory(signer);
    ballotContract = await ballotFactory.attach(ballotContractAddress);
    console.log(`interacting with contract address: ${ballotContract.address}`);
    
    const tx = await ballotContract.vote(proposal, amount);
    await tx.wait();

    console.log(`Transaction hash: ${tx.hash}`);
    
    console.log(`Tokenized Ballot Contract Address at ${ballotContract}`);

};

vote().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
// To run file, yarn run ts-node --files scripts/Vote.ts    proposal    voterAddress    amount    contractAddress

    /*
    From TokenizedBallots.sol

    function vote(uint proposal, uint256 amount) external {
        require(votePower(msg.sender) >= amount, "Not enough vote power");
        proposals[proposal].voteCount += amount;
        spentVotingPower[msg.sender] += amount;
    }

    From constants.ts file
    
    export const ballotContractAddress: string = "";
    export const tokenContractAddress: string = "0x284A7042be8749c1b3A35509F27ebb09c2737956";


    From utils.ts

    import { ethers, Wallet } from "ethers";
    import { Ballot, Ballot__factory, MyToken, MyToken__factory } from "../typechain-types";
    import { ballotContractAddress, tokenContractAddress } from "./constants";
    import * as dotenv from "dotenv";
    dotenv.config()

    export async function SetupSigner(): Promise<Wallet> {
        const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })
        let wallet: Wallet;

        if (process.env.MNEMONIC != "") {
            wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
        } else {
            wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
        }
        return wallet.connect(provider)
    }

    export async function ballotContract(signer: Wallet): Promise<Ballot> {
        const ballotFactory = new Ballot__factory(signer);
        return await ballotFactory.attach(ballotContractAddress);
    }

    export async function tokenContract(signer: Wallet): Promise<MyToken> {
        const tokenFactory = new MyToken__factory(signer);
        return await tokenFactory.attach(tokenContractAddress);
    }
    */
