var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var connectedWal_address;
var nameArray = [];
var codeArray = [];
var dosageArray = [];

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    //declare the contract address
    var contractAddress = "0x89A6d5138D9cc7e13B5982E2DB62B0Caf7e32d95"
      //connect to the contract pass in the abi(methods from contract declared in HTML head) contract address and the account that deployed
      connectedWal_address = accounts[0];
      //the contract ie. the contract owner now.
        contractInstance = new web3.eth.Contract(abi, contractAddress,{from: accounts[0]});
      //uncomment the below for development and testing purposes.
      // console.log(contractInstance);
      getOwner()
      //display the contracct address
      $("#contract_address").text(contractAddress)
      //display the connected wallet's address
      $("#connectedWal_address").text(connectedWal_address)
  });

  // var burnEvent = contractInstance.PrescriptionData();
  //
  // burnEvent.watch(function(error, result){
  //   if(!error){
  //     $("#dataoutput").html(result.toString());
  //   }
  //   else{
  //     console.log(error);
  //   }
  // });

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
  $("#send_token_button").click(transfer)
  //get prescription data button
  $("#get_data_button").click(getprescriptionData)
  //get my prescriptions button
  $("#get_mypres_button").click(getmyprescriptions)
  //getprescriptionDataCust button returns a slightly modified version of get data function
  $("#get_mypres_data").click(getprescriptionDataCust)
  //destroy button
  $("#burn_token_button").click(burnToken)

});

//function to destroy tokens
function burnToken(){
  var id = $("#burn_token_id").val();
  //calls function in contract
  contractInstance.methods.destroy(id).send();
  }

//function to send the token from your account to pharmacy.
function transfer(){
  var to = $("#pharmacyaddress_input").val();
  var id = $("#presid_input").val();
  contractInstance.methods.transferPres( to, id).send();
  $("#pharmacyaddress_input").val("");
  $("#presid_input").val("");
}
//get the list of ids that are owned by the connected address and display them as clickable buttons on the screen.
function getmyprescriptions(){
  contractInstance.methods.arrayOfPrescriptionsByAddress(connectedWal_address).call().then(function(res){
    $("#my_pres_output").text("");
    $("#output_cust").text("");
    res.forEach(element => {

        document.querySelector("#my_pres_output").innerHTML
          += '<button class="btn btn--radius-2 btn--blue" value="'+element+'" onclick="getprescriptionDataCust(this)">' + element + '</button>'
    });

  })
}

//holds the information in an array before it can be sent to the contract
function addDatatoArray(){

  var name = $("#add_data_name").val();
  var code = $("#add_data_drugCode").val();
  var dosage = $("#add_data_dosage").val();

  if (name === "" || code === "" || dosage === "" ){
        alert("Inputs cannot be empty");
    }else{
      nameArray.push(name);
      codeArray.push(code);
      dosageArray.push(dosage);
      $("#add_data_name").val("");
      $("#add_data_drugCode").val("");
      $("#add_data_dosage").val("");
    }


}

// slightly altered get data function for use on the patients page
function getprescriptionDataCust(e){
  $("#output_cust").text("");
  var id = $(e).attr("value");

  contractInstance.methods.getprescriptionData(id).call().then(function(res){

      res.forEach(element => {
          document.querySelector("#output_cust").innerHTML
            += '<div class="row row-space"><p class="name"> Name:' + element.drugName + '</p>' +
               '<p class="name"> Drug Code:' + element.drugCode + '</p>' +
               '<p class="name"> Dosage:' + element.dosage + ' mg</p><div><br>';
      });


  })
}

//add the presctription data to the id and call the batch function in the contract.
function addprescriptionData(){
  var address = $("#address_input").val();
  var id = $("#id_input").val();

  contractInstance.methods.addprescriptionDatatoArrayBatch(address, id, nameArray, codeArray, dosageArray ).send()
  .on("confirmation", function(confirmationNr){
    console.log(confirmationNr);
  })
  //emptys the arrays
  nameArray = [];
  codeArray = [];
  dosageArray = [];
}

//get the data from a given id and display it to the screen
function getprescriptionData(){
  $("#output").text("");
  var id = $("#get_data_id").val();
  contractInstance.methods.getprescriptionData(id).call().then(function(res){

      res.forEach(element => {
          document.querySelector("#output").innerHTML
            += '<p class="name"> Name:' + element.drugName + '</p>' +
               '<p class="name"> Drug Code:' + element.drugCode + '</p>' +
               '<p class="name"> Dosage:' + element.dosage + ' mg</p><br>';

      });

  })
}

// function mint(){
//   var address = $("#address_input").val();
//   var id = $("#id_input").val();
//
//   contractInstance.methods.mint(address, id).send()
//   .on("confirmation", function(confirmationNr){
//     consol.log(confirmationNr);
//   })
// }

//returns the deployer/owner of the contract
function getOwner(){
  contractInstance.methods.owner().call().then(function(res){
    $("#owner_address").text(res)
  })
}

//sets the address to the doctor on contract
function setDoctor(){
  var _doctor = $("#doc_address_input").val();
  contractInstance.methods.setDoctor(_doctor).send({gasLimit:210000 }).then(function(){
    getDoctor()
  })
}

//returns doctor of contract
function getDoctor(){
  contractInstance.methods.doctor().call().then(function(res){
    $("#doc_address_output").text(res);
    totalSupply()
  })
}

//shows number of prescriptions minted
function totalSupply(){
  contractInstance.methods.totalSupply().call().then(function(res){
    $("#pres_num_output").text(res);
  })
}
