const BigNumber = require("bignumber.js");
const VotingContract = artifacts.require('./Voting.sol');

contract("VotingContract", function(accounts){
    let contractNew;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    before(async() => {
        contractNew = await VotingContract.deployed();
    });

    it("should be able to create candidate", async () => {
        const candidatesCountBefore = await contractNew.getNumOfCandidates.call();
        console.log("candidatesCountBefore"+candidatesCountBefore);
        const receipt = await contractNew.addCandidate("Candidate1","Democratic", {
            from: user1,
          });
        const candidatesCountAfter = await contractNew.getNumOfCandidates.call();
        console.log("candidatesCountAfter"+candidatesCountAfter);
            assert.isTrue(true);
    });
});