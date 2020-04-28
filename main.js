var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    //declare the contract address
    var contractAddress = "0x7a4524C56Af971D8AfFD8C52D7aA3E83d1F6EB57"
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
  //prescription number button
  $("#pres_num_button").click(totalSupply)
  //Set Doctor button
  $("#set_doctor_button").click(setDoctor)
  //Get doctor button
  $("#get_doctor_button").click(getDoctor)
  //Mint button
  $("#mint_token_button").click(mint)
  $("#add_Data_To_Array_button").click(addDatatoArray)
  //add prescription data button
  $("#add_data_button").click(addprescriptionData)
  //get prescription data button
  $("#get_data_button").click(getprescriptionData)

});

function addDatatoArray(){
  var name = $("#add_data_name").val();
  var code = $("#add_data_drugCode").val();
  var dosage = $("#add_data_dosage").val();

  contractInstance.methods.addprescriptionDatatoArray(name, code, dosage).send()
  .on("confirmation", function(confirmationNr){
    consol.log(confirmationNr);
  })
}

function addprescriptionData(){
  var id = $("#add_data_id").val();

  contractInstance.methods.addprescriptionData(id).send()
  .on("confirmation", function(confirmationNr){
    consol.log(confirmationNr);
  })
}

function getprescriptionData(){
  var id = $("#get_data_id").val();
  contractInstance.methods.getprescriptionData(id).call().then(function(res){
    console.log(res.length)
     $("#drugDosage_output").text(res[0].dosage)
     $("#drugName_output").text(res[0].drugName)
     $("#drugCode_output").text(res[0].drugCode)

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
