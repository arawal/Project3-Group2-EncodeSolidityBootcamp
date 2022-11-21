import { ethers } from "ethers";
import { SetupSigner, tokenContract } from "./utils";

async function giveVotingTokens() {
    const signer = await SetupSigner();
    const contract = await tokenContract(signer);

    const args = process.argv.slice(2);
    if (args.length != 2) throw new Error("Expecting exactly 2 args");
    const voter = args[0];
    const mintAmount = ethers.utils.parseEther(args[1]);

    const mintTx = await contract.mint(voter, mintAmount);
    await mintTx.wait()
    let voterTokenBalance = await contract.balanceOf(voter);
    console.log(`After mint voter ${voter} has a total of ${voterTokenBalance} decimal units`);
}

giveVotingTokens().catch((e) => {
    console.log(e);
    process.exitCode = 1;
})