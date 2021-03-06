// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// get build artifacts from compiled smart contract and create the truffle contract
import votingArtifacts from "../../build/contracts/Voting.json"
var VotingContract = contract(votingArtifacts)

/*
 * This holds all the functions for the app
 */
window.App = {
  // called when web3 is set up
  start: function() { 
    // setting up contract providers and transaction defaults for ALL contract instances
    VotingContract.setProvider(window.web3.currentProvider)
    VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})
 
    // creates an VotingContract instance that represents default address managed by VotingContract
    VotingContract.deployed().then(function(instance){

      // calls getNumOfCandidates() function in Smart Contract, 
      // this is not a transaction though, since the function is marked with "view" and
      // truffle contract automatically knows this
      instance.getNumOfCandidates().then(function(numOfCandidates){
        if (numOfCandidates < 5){
          instance.addCandidate("Candidate3","Congress").then(function(result){  
           // console.log(`${result.logs[0].args.candidateID`);
            var boxData = `<div class="card mb-4 box-shadow"><div class="card-header"><h4 class="my-0 font-weight-normal">Congress</h4></div><div class="card-body"><h3 class="card-title pricing-card-title">Candidate3</h3><button type="button" onclick="App.voteFor('+result.logs[0].args.candidateID+')" class="btn btn-lg btn-block btn-outline-primary" id=${result.logs[0].args.candidateID} onclick="App.voteFor(${result.logs[0].args.candidateID})" >Vote</button></div></div>`;
            // $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`+code)
            $('#candidate-box').append(boxData);
          })
          instance.addCandidate("Candidate4","BJP").then(function(result){
            var boxData = '<div class="card mb-4 box-shadow"><div class="card-header"><h4 class="my-0 font-weight-normal">'+result.logs[0].args.candidateID+'</h4></div><div class="card-body"><h3 class="card-title pricing-card-title">'+result.logs[0].args.candidateID+'</h3><button type="button" onclick="App.voteFor('+result.logs[0].args.candidateID+')" class="btn btn-lg btn-block btn-outline-primary" id='+result.logs[0].args.candidateID+' >Vote</button></div></div>';
            // $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=1>Candidate1</label></div>`)
            $('#candidate-box').append(boxData);
          })
          // the global variable will take the value of this variable
          numOfCandidates = 2 
        }
        else { // if candidates were already added to the contract we loop through them and display them
          for (var i = 0; i < numOfCandidates; i++ ){
            // gets candidates and displays them
            instance.getCandidate(i).then(function(data){
              var boxData = '<div class="card mb-4 box-shadow"><div class="card-header"><h4 class="my-0 font-weight-normal">'+window.web3.toAscii(data[2])+'</h4></div><div class="card-body"><h3 class="card-title pricing-card-title">'+window.web3.toAscii(data[1])+'</h3><button type="button" onclick="App.voteFor('+data[0]+')" class="btn btn-lg btn-block btn-outline-primary" id='+data[0]+' >Vote</button></div></div>';
             // $("#candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${data[0]}><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data[1])}</label></div>`)
             $('#candidate-box').append(boxData);
            })
          }
        }
        // sets global variable for number of Candidates
        // displaying and counting the number of Votes depends on this
        window.numOfCandidates = numOfCandidates 
      })
    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  voteFor: function(data){
    console.log(data);
    //check if user id is entered
    var uid = $("#id-input").val();
    if (uid == ""){
     // $("#id-input").addClass('is-invalid');
      $("#msg").html('<div class="alert alert-danger" role="alert">Please enter a User Id!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
      return
    }
    var candidateID = data;
    VotingContract.deployed().then(function(instance){
      instance.vote(uid,parseInt(candidateID)).then(function(result){
        console.log(result); 
        $("#msg").html("<p>Voted for </p>")
      })
    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },
  // Function that is called when user clicks the "vote" button
  vote: function() {
    var uid = $("#id-input").val() //getting user inputted id

    // Application Logic 
    if (uid == ""){
      $("#msg").html("<p>Please enter id.</p>")
      return
    }
    if ($("#candidate-box :checkbox:checked").length > 0){ 
      // just takes the first checked box and gets its id
      var candidateID = $("#candidate-box :checkbox:checked")[0].id
    } 
    else {
      $("#msg").html("<p>Please vote for a candidate.</p>")
      return
    }
    VotingContract.deployed().then(function(instance){
      instance.vote(uid,parseInt(candidateID)).then(function(result){
        $("#msg").html("<p>Voted</p>")
      })
    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  findNumOfVotes: function() {
    VotingContract.deployed().then(function(instance){
      var box = $("<section></section>") 

      // loop through the number of candidates and display their votes
      for (var i = 0; i < window.numOfCandidates; i++){
        // calls two smart contract functions
        var candidatePromise = instance.getCandidate(i)
        var votesPromise = instance.totalVotes(i)

        // resolves Promises by adding them to the variable box
        Promise.all([candidatePromise,votesPromise]).then(function(data){
          box.append(`<p>${window.web3.toAscii(data[0][1])}: ${data[1]}</p>`)
        }).catch(function(err){ 
          console.error("ERROR! " + err.message)
        })
      }
      $("#vote-box").html(box) 
    })
  }
}

// When the page loads, we create a web3 instance and set a provider. We then set up the app
window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)
    
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))
  }
  // initializing the App
  window.App.start()
})