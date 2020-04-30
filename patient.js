var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var connectedWal_address;

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    //declare the contract address
    var contractAddress = "0x532e4169cc50930eff4ac6E7E830cF06ff9282df"
      //connect to the contract pass in the abi(methods from contract declared in HTML head) contract address and the account that deployed
      connectedWal_address = accounts[0];
      //the contract ie. the contract owner now.
        contractInstance = new web3.eth.Contract(abi, contractAddress, connectedWal_address);
      //uncomment the below for development and testing purposes.
      console.log(contractInstance);
      getOwner()
      //display the contracct address
      $("#contract_address").text(contractAddress)
      //display the connected wallet's address
      $("#connectedWal_address").text(connectedWal_address)
  });

  //get my prescriptions button
  $("#get_mypres_button").click(getmyprescriptions)

});

function getmyprescriptions(){
  contractInstance.methods.arrayOfPrescriptionsByAddress(connectedWal_address).call().then(function(res){
    console.log(res);
    $("#my_pres_output").text(res)
  })
}
