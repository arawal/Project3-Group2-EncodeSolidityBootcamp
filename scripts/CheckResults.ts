

import { SetupSigner, ballotContract } from "./utils";
import "./constants.ts";
import { Ballot } from "../typechain-types";
dotenv.config()
import * as dotenv from "dotenv";




async function checkResults() {
    // TODO
    
    let tokenizedBallotContract: Ballot;
    const signer = await SetupSigner();
    

    // function from utils.ts
    tokenizedBallotContract = await ballotContract(signer);

    // read winner name
    const winnerName = await tokenizedBallotContract.winnerName();
    console.log(`winner name: $(winnerName})`);

    // read winning proposal
    const winningProposal = tokenizedBallotContract.winningProposal();
    console.log(`winning proposal: ${winningProposal}`);

}

checkResults().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


/*

To run file,   yarn run ts-node --files ./scripts/CheckResults.ts   "ballotContractAddress"


From constants.ts
export const ballotContractAddress: string = "";
export const tokenContractAddress: string = "0x284A7042be8749c1b3A35509F27ebb09c2737956";

*/
