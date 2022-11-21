import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat"
import { Ballot, MyToken } from "../typechain-types";

const PROPOSALS = ["A", "B", "C"]

// this describe block deploys the contract to be interacted with in each nested describe block
describe("TokenizedBallot Contract", async () => {
    // contract and accounts declared in higher scope so they can be used in nested describe blocks
    let tokenContract: MyToken;
    let ballotContract: Ballot;
    let accounts: SignerWithAddress[];
    let tokenContractAddress: string;
    let currentBlockNumber: number;
    let deployer: SignerWithAddress;
    let voter: SignerWithAddress;
    let other: SignerWithAddress;

    const TEST_MINT_TOKENS = ethers.utils.parseEther("10");

    // before each nested describe block, deploy the contract (this is a hook)
    beforeEach(async () => {
        [deployer, voter, other] = await ethers.getSigners();
        
        // get token contract factory
        const tokenFactory = await ethers.getContractFactory("MyToken");

        // deploy the token contract
        tokenContract = await tokenFactory.deploy();
        await tokenContract.deployed();

        // token contract init sequence
        // deployer mints token to self, voter, and other
        // then, voter and other delegate their votes to themselves
        await Promise.all([
            tokenContract.mint(deployer.address, TEST_MINT_TOKENS),
            tokenContract.mint(voter.address, TEST_MINT_TOKENS),
            tokenContract.mint(other.address, TEST_MINT_TOKENS),
            tokenContract.connect(voter).delegate(voter.address),
            tokenContract.connect(other).delegate(other.address)
        ]);

        tokenContractAddress = tokenContract.address;
        console.log(`Tokenized votes contract deployed at ${tokenContractAddress} by deployer ${deployer.address}`);
        
        // initialize the TokenizedBallot contract
        const ballotFactory = await ethers.getContractFactory("Ballot");
        currentBlockNumber = await ethers.provider.getBlockNumber();
        ballotContract = await ballotFactory.deploy(
            PROPOSALS.map(p => ethers.utils.formatBytes32String(p)),
            tokenContract.address,
            currentBlockNumber
        );
        await ballotContract.deployed();

    })

    describe("when the contracts are deployed", async () => {
        it("should have the token contract be initialized", async () => {
            await expect(await tokenContract.name()).to.equal("MyToken");

            // check that the deployer has the correct amount of tokens
            await expect(await tokenContract.balanceOf(deployer.address)).to.equal(TEST_MINT_TOKENS);
            
            // check that the voter has the correct amount of tokens
            await expect(await tokenContract.balanceOf(voter.address)).to.equal(TEST_MINT_TOKENS);

            // check that the other has the correct amount of tokens
            await expect(await tokenContract.balanceOf(other.address)).to.equal(TEST_MINT_TOKENS);

            // check that the deployer has the correct amount of votes
            await expect(await tokenContract.getVotes(deployer.address)).to.equal(0);

            // check that the voter has the correct amount of votes
            await expect(await tokenContract.getVotes(voter.address)).to.equal(TEST_MINT_TOKENS);

            // check that the other has the correct amount of votes
            await expect(await tokenContract.getVotes(other.address)).to.equal(TEST_MINT_TOKENS);

            // check that the deployer has the correct amount of delegates - should have none
            await expect(await tokenContract.delegates(deployer.address)).to.equal("0x0000000000000000000000000000000000000000");
            
            // check that the voter has the correct amount of delegates - should have some
            await expect(await tokenContract.delegates(voter.address)).to.equal(voter.address);

            // check that the other has the correct amount of delegates - should have some
            await expect(await tokenContract.delegates(other.address)).to.equal(other.address);

        })
        it("the ballot contract should be initialized", async () => {
            await expect(await tokenContract.name()).to.equal("MyToken");            
        })
    });

    describe("when the contract owner interacts with the vote function in the TokenizedBallots contract", function () {
        it("should not be able to vote - due to not having self-delegated", async function () {
            let tokenBalance = await ballotContract.votePower(deployer.address);
            console.log(`vote power of deployer: ${tokenBalance}`);
            
            await expect(ballotContract.connect(deployer).vote(0, TEST_MINT_TOKENS)).to.be.revertedWith("Not enough vote power");
        });
    });

    describe("when the voter interacts with the vote function in the TokenizedBallots contract", function () {
        it("should be able to vote - due to having self-delegated", async function () {
            let tokenBalance = await ballotContract.votePower(voter.address);
            console.log(`vote power of voter: ${tokenBalance}`);
            
           // expect the transaction to succeed
            await expect(ballotContract.connect(voter).vote(0, TEST_MINT_TOKENS)).to.not.be.reverted;
        });
    });
});