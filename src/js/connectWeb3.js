const Web3 = require('web3');
const bigNumber = require('bignumber.js');

const addressJSON = require('../../build/contractAddress.json');
const contractJSON = require('../../build/contracts/Voting.json');

const CONTRACT_ADDRESS = addressJSON.address;
const CONTRACT_ABI = contractJSON.abi;

let web3, contract;

(async () => {
    web3 = new Web3(process.env.BLOCKCHAIN_EMULATOR_URI);
    const accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, { from: accounts[0] });
})();

const connectWeb3 = {
    async callStart(){
        contract.methods().then(function(numOfCandidates){
            console.log(numOfCandidates);
            return numOfCandidates;
        });
    }
    
    // async addManufacturer(address, manufacturerAddress ){
    //     contract.methods.addManufacturer(manufacturerAddress).send({from : address});
    // },
    // async addTransporter(address, transporterAddress){
    //     contract.methods.addTransporter(transporterAddress).send({from : address});
    // },
    // async addDistributer(address, distributerAddress){
    //     contract.methods.addDistributer(distributerAddress).send({ from : address});
    // }
}

module.exports = connectWeb3;