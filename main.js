var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
        contractInstance = web3.eth.contract(abi, "0x9265Ac8c319e1f31161067BF29fCB5a4705472e0", {from: accounts[0]});
      console.log(contractInstance);
  });
  $("#add_data_button").click(inputData)
});


function inputData(){
  alert("input Data clicked!")
}
