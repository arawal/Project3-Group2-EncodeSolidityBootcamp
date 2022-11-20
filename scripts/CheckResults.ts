
import * from "./utils.ts";
import * from "./constants.ts";
import { Wallet } from "ethers";
import { TokenizedBallots } from "../typechain-types";
dotenv.config()
import * as dotenv from "dotenv";




async function checkResults() {
    // TODO
    
    let tokenizedBallotContract: TokenizedBallots;
    
    // function from utils.ts
    tokenizedBallotContract.SetUpSigner();

    // function from utils.ts
    tokenizedBallotContract.ballotContract(signer: Wallet);


    // read winner name
    const winnerName = await tokenizedBallotContract.winnerName();
    console.log(`winner name: $(winnerName})`);

    // read winning proposal
    const winningProposal = tokenizedBallotContract.sol.winningProposal();
    console.log(`winning proposal: ${winningProposal}`);

}

checkResults().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


/*

To run file,   yarn run ts-node --files ./scripts/CheckResults.ts ./scripts/CheckResults.ts  "ballotContractAddress"


From constants.ts
export const ballotContractAddress: string = "";
export const tokenContractAddress: string = "0x284A7042be8749c1b3A35509F27ebb09c2737956";

*/
