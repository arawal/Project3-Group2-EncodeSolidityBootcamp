import * from "./utils.ts";
import * from "./constants.ts";
import { Wallet } from "ethers";
import { TokenizedBallots } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()


async function vote() {
    // TODO
    
    let tokenizedBallotContract: TokenizedBallots;
    // function from utils.ts
    tokenizedBallotContract.SetUpSigner();

    // function from utils.ts
    tokenizedBallotContract.ballotContract(signer: Wallet);
    
    const args = process.argv.slice(2);

    const proposal = args[0];  // proposal index of 1/3 proposals
    const amount = args[1];   // amount
    console.log(`Voting for ${vote}`);

    const tx = await tokenizedBallotContract.vote(proposal, amount);

    const ballotContractAddress: string = "";
    console.log(`Tokenized Ballot Contract Address at ${ballotContractAddress}`);
    
    vote().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });

};

// To run file, yarn run ts-node --files scripts/Vote.ts proposalIndexNum amount

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