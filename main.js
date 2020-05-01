var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var connectedWal_address;
var nameArray = [];
var codeArray = [];
var dosageArray = [];

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    //declare the contract address
    var contractAddress = "0x1D3c7b03008b67b6b3c9c43EB4F82709cc365a69"
      //connect to the contract pass in the abi(methods from contract declared in HTML head) contract address and the account that deployed
      connectedWal_address = accounts[0];
      //the contract ie. the contract owner now.
        contractInstance = new web3.eth.Contract(abi, contractAddress,{from: accounts[0]});
      //uncomment the below for development and testing purposes.
      console.log(contractInstance);
      getOwner()
      //display the contracct address
      $("#contract_address").text(contractAddress)
      //display the connected wallet's address
      $("#connectedWal_address").text(connectedWal_address)
  });

  //prescription number button
  $("#pres_num_button").click(totalSupply)
  //Set Doctor button
  $("#set_doctor_button").click(setDoctor)
  //Get doctor button
  $("#get_doctor_button").click(getDoctor)
  //Mint button
  $("#mint_token_button").click(addprescriptionData)
  //add data to an array
  $("#add_Data_To_Array_button").click(addDatatoArray)
  //add prescription data button
  $("#add_data_button").click(addprescriptionData)
  //get prescription data button
  $("#get_data_button").click(getprescriptionData)
  //get my prescriptions button
  $("#get_mypres_button").click(getmyprescriptions)

  $("#get_mypres_data").click(getprescriptionDataCust)

});

function getmyprescriptions(){
  contractInstance.methods.arrayOfPrescriptionsByAddress(connectedWal_address).call().then(function(res){
    console.log(res);
    $("#my_pres_output").text("")
    res.forEach(element => {

        document.querySelector("#my_pres_output").innerHTML
          += '<button value="'+element+'" onclick="getprescriptionDataCust(this)">' + element + '</button>'
    });

  })
}

function addDatatoArray(){
  var name = $("#add_data_name").val();
  var code = $("#add_data_drugCode").val();
  var dosage = $("#add_data_dosage").val();

  nameArray.push(name);
  codeArray.push(code);
  dosageArray.push(dosage);
  $("#add_data_name").val("");
  $("#add_data_drugCode").val("");
  $("#add_data_dosage").val("");
  console.log(nameArray, codeArray, dosageArray);


}

function getprescriptionDataCust(e){
console.log(e);
  $("#output_cust").text("");
  var id = $(e).attr("value");

  contractInstance.methods.getprescriptionData(id).call().then(function(res){
    console.log(res)

      res.forEach(element => {
          document.querySelector("#output_cust").innerHTML
            += '<p> Name:' + element.drugName + '</p>' +
               '<p> drugCode:' + element.drugCode + '</p>' +
               '<p> dosage:' + element.dosage + '</p>';
      });


  })
}

function addprescriptionData(){
  var address = $("#address_input").val();
  var id = $("#id_input").val();

    console.log(address, id, nameArray, codeArray, dosageArray);

  contractInstance.methods.addprescriptionDatatoArrayBatch(address, id, nameArray, codeArray, dosageArray ).send()
  .on("confirmation", function(confirmationNr){
    console.log(confirmationNr);
  })
}

function getprescriptionData(){
  $("#output").text("");
  var id = $("#get_data_id").val();
  contractInstance.methods.getprescriptionData(id).call().then(function(res){
    console.log(res)

      res.forEach(element => {
          document.querySelector("#output").innerHTML
            += '<p> Name:' + element.drugName + '</p>' +
               '<p> drugCode:' + element.drugCode + '</p>' +
               '<p> dosage:' + element.dosage + '</p>';

      });

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
