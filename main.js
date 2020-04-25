var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    //declare the contract address
    var contractAddress = "0x1a595b23bc054FeC8aae1549BbE5a7B5FC80885f"
      //connect to the contract pass in the abi(methods from contract declared in HTML head) contract address and the account that deployed
      //the contract ie. the contract owner now.
        contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
      //uncomment the below for development and testing purposes.
      console.log(contractInstance);
      getOwner()
      //display the contracct address
      $("#contract_address").text(contractAddress)
      //display the connected wallet's address
      $("#connectedWal_address").text(contractInstance._provider.selectedAddress)
  });

  $("#pres_num_button").click(totalSupply)
  $("#set_doctor_button").click(setDoctor)
  $("#get_doctor_button").click(getDoctor)
  $("#mint_token_button").click(mint)
  $("#add_data_button").click(addprescriptionData)
  $("#get_data_button").click(getprescriptionData)

});

function addprescriptionData(){
  var id = $("#add_data_id").val();
  var name = $("#add_data_name").val();
  var code = $("#add_data_drugCode").val();

  contractInstance.methods.addprescriptionData(id, name, code).send()
  .on("confirmation", function(confirmationNr){
    consol.log(confirmationNr);
  })
}

function getprescriptionData(){
  var id = $("#get_data_id").val();
  contractInstance.methods.getprescriptionData(id).call().then(function(res){
    console.log(res)
     $("#drugName_output").text(res.drugName)
     $("#drugCode_output").text(res.drugCode)
  })
}

function mint(){
  var address = $("#address_input").val();
  var id = $("#id_input").val();

  contractInstance.methods.mint(address, id).send()
  .on("confirmation", function(confirmationNr){
    consol.log(confirmationNr);
  })
}

function getOwner(){
  contractInstance.methods.owner().call().then(function(res){
    $("#owner_address").text(res)
  })
}

function setDoctor(){
  var _doctor = $("#doc_address_input").val();
  contractInstance.methods.setDoctor(_doctor).send({gasLimit:210000 }).then(function(){
    getDoctor()
  })
}


function getDoctor(){
  contractInstance.methods.doctor().call().then(function(res){
    $("#doc_address_output").text(res);
  })
}

function totalSupply(){
  contractInstance.methods.totalSupply().call().then(function(res){
    $("#pres_num_output").text(res);
  })
}
