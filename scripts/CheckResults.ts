import { SetupSigner } from "./utils";
//import { ballotContractAddress } from "./constants.ts";
dotenv.config();
import * as dotenv from "dotenv";


async function checkResults() {
    // TODO
    
    const ballotContract = await SetupSigner();

    // read winner name
    const winnerName = await ballotContract.winnerName();
    console.log(`winner name: ${winnerName}`);

    // read winning proposal
    const winninngProposal = await ballotContract.winningProposal();
    console.log(`winning proposal: ${winninngProposal}`);
}

checkResults().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});


/*

To run file,   yarn run ts-node --files ./scripts/CheckResults.ts   "ballotContractAddress"


From constants.ts
export const ballotContractAddress: string = "";
export const tokenContractAddress: string = "0x284A7042be8749c1b3A35509F27ebb09c2737956";

*/
