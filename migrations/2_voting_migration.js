var VotingContract = artifacts.require("Voting");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(VotingContract);
};