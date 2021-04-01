const BigNumber = require("bignumber.js");

const VotingContract = artifacts.require('./Voting.sol');
const Web3 = require('web3');

contract("VotingContract", function(accounts){
    let contractNew;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    before(async() => {
        contractNew = await VotingContract.deployed();
        accounts = await web3.eth.getAccounts();
    });

    it("should be able to create candidate", async () => {
        const candidatesCountBefore = await contractNew.getNumOfCandidates.call();
        let str1 = await web3.utils.toHex('Candidate1');
        let str2 = await web3.utils.toHex('Democratic');
        const result = await contractNew.addCandidate(str1,str2);
        
         const candidatesCountAfter = await contractNew.getNumOfCandidates.call();
            assert(new BigNumber(candidatesCountAfter).minus(1).isEqualTo(new BigNumber(candidatesCountBefore)),"Candidate Count should be equal");
    });

    it("should be able to vote for a candidate",async () => {
        let str1 = await web3.utils.toHex('Candidate1');
        let str2 = await web3.utils.toHex('Democratic');
        const result = await contractNew.addCandidate(str1,str2);
        let candidateId= new BigNumber(result.logs[0].args.candidateId);
        const resultVote = await contractNew.vote(1,1);
        console.log(resultVote);
        assert.isTrue(true);
    }) ;
});