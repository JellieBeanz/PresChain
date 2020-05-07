const PresChain = artifacts.require("CryptoPres");
const truffleAssert = require("truffle-assertions");

contract("CryptoPres", async function(accounts){
  it("should initialize correctly", async function(){
    let instance = await PresChain.deployed();
    let doctor = await instance.doctor();
    let owner = await instance.owner();
    assert(doctor == 0x0000000000000000000000000000000000000000, "Doctor Address is null");
  });
  //setDoctor() function testing
  it("Cannot set contract owner as doctor", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    await truffleAssert.fails(instance.setDoctor(owner), truffleAssert.ErrorType.Revert);
  });
  it("Can only be called by owner", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    await truffleAssert.passes(instance.setDoctor(accounts[1], {from:accounts[0]}));
  });
  it("Cannot be called by non owner address", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    await truffleAssert.fails(instance.setDoctor(accounts[1], {from:accounts[1]}), truffleAssert.ErrorType.Revert);
  });
  //addprescriptionDatatoArrayBatch
  it("Will not accept null entries", async function(){
    let instance = await PresChain.deployed();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.addprescriptionDatatoArrayBatch(accounts[2], 1, [""], [""],[""], {from:doctor}), truffleAssert.ErrorType.Revert);
  });
  it("Will allow to be sent from doctor address", async function(){
    let instance = await PresChain.deployed();
    let doctor = await instance.doctor();
    await truffleAssert.passes(instance.addprescriptionDatatoArrayBatch(accounts[2], 1, ["Lexapro"], ["Lx450"],["30"], {from:doctor}));
  });
  it("Cannot send to Contract owner", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.addprescriptionDatatoArrayBatch(owner, 2, ["Lexapro"], ["Lx450"],["30"], {from:doctor}), truffleAssert.ErrorType.Revert);
  });
  it("Cannot send to self", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.addprescriptionDatatoArrayBatch(doctor, 2, ["Lexapro"], ["Lx450"],["30"], {from:doctor}), truffleAssert.ErrorType.Revert);
  });
  it("Token must have a unique ID", async function(){
    let instance = await PresChain.deployed();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.addprescriptionDatatoArrayBatch(accounts[2], 1, ["Lexapro"], ["Lx450"],["30"], {from:doctor}), truffleAssert.ErrorType.Revert);
  });
  it("All arrays should be equal length", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.addprescriptionDatatoArrayBatch(doctor, 2, ["Lexapro","DecaVit"], ["Lx450","DV50"],["30"], {from:doctor}), truffleAssert.ErrorType.Revert);
  });
  it("All arrays should be equal length", async function(){
    let instance = await PresChain.deployed();
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.passes(instance.addprescriptionDatatoArrayBatch(accounts[2], 2, ["Lexapro","DecaVit"], ["Lx450","DV50"],["30","50"], {from:doctor}));
  });
  //arrayOfPrescriptionsByAddress()
  it("Should return array of length 2", async function(){
    let instance = await PresChain.deployed();
    let patient = await accounts[2];
    let array = await instance.arrayOfPrescriptionsByAddress(patient);
    assert(array.length == 2);
  });
  it("Should increase length when minted token to address", async function(){
    let instance = await PresChain.deployed();
    let patient = await accounts[2];
    let doctor = await instance.doctor();
    await instance.addprescriptionDatatoArrayBatch(patient, 3, ["Lexapro","DecaVit"], ["Lx450","DV50"],["30","50"], {from:doctor});
    let array = await instance.arrayOfPrescriptionsByAddress(patient);
    await truffleAssert.passes(array.length == 3);
  })
  it("Should display array of ids", async function(){
    let instance = await PresChain.deployed();
    let patient = await accounts[2];
    let array = await instance.arrayOfPrescriptionsByAddress(patient);
    await truffleAssert.passes(array === ["1","2","3"]);
  });
  it("Should decrease when token is destroyed", async function(){
    let instance = await PresChain.deployed();
    let patient = await accounts[2];
    await instance.destroy("2", {from:patient});
    let array = await instance.arrayOfPrescriptionsByAddress(patient);
    assert(array.length == 2);
  });
  it("Should display without id 2", async function(){
    let instance = await PresChain.deployed();
    let patient = await accounts[2];
    let array = await instance.arrayOfPrescriptionsByAddress(patient);
    await truffleAssert.passes(array === ["1","3"]);
  });
  //getprescriptionData()
  it("should return data from presction", async function(){
    let instance = await PresChain.deployed();
    let data = await instance.getprescriptionData(3);
    await truffleAssert.passes(data === [['Lexapro','Lx450','30'],['DecaVit','DV50','50']]);
  });
  it("should fail if ID does not exist", async function(){
    let instance = await PresChain.deployed();
    await truffleAssert.fails(instance.getprescriptionData(2),truffleAssert.ErrorType.Revert);
  });
  //transferPres()
  it("cannot be sent to Doctor", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.transferPres(doctor, 3, {from:ownerOfToken}),truffleAssert.ErrorType.Revert);
  });
  it("cannot be sent to Contract owner", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.transferPres(owner, 3, {from:ownerOfToken}),truffleAssert.ErrorType.Revert);
  });
  it("cannot be sent from non owner address", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.fails(instance.transferPres(owner, 3, {from:owner}),truffleAssert.ErrorType.Revert);
  });
  it("Can be sent from owner to another address", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    let owner = await instance.owner();
    let doctor = await instance.doctor();
    await truffleAssert.passes(instance.transferPres(accounts[4], 3, {from:ownerOfToken}));
  });
  it("cannot be sent to a null address", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    await truffleAssert.fails(instance.transferPres("0x0000000000000000000000000000000000000000", 3, {from:ownerOfToken}),truffleAssert.ErrorType.Revert);
  });
  it("cannot be sent to a null address", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    await truffleAssert.fails(instance.transferPres("0", 3, {from:ownerOfToken}),truffleAssert.ErrorType.Revert);
  });
  //Destroy()
  it("cannot destroy tokens you do not own", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    await truffleAssert.fails(instance.destroy(3, {from:accounts[0]}), truffleAssert.ErrorType.Revert);
  });
  it("can only destroy owned tokens", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    await truffleAssert.fails(instance.destroy(1, {from:ownerOfToken}), truffleAssert.ErrorType.Revert);
  });
  it("can only destroy owned tokens", async function(){
    let instance = await PresChain.deployed();
    let ownerOfToken = await instance.ownerOf(3);
    await truffleAssert.passes(instance.destroy(3, {from:ownerOfToken}));
  });
  it("reduces number of tokens over all", async function(){
    let instance = await PresChain.deployed();
    let totalSupply = await instance.totalSupply();
    await truffleAssert.passes(totalSupply == 2);
  });
  it("removes the token from the owners list of prescriptions", async function(){
    let instance = await PresChain.deployed();
    await truffleAssert.passes(instance.arrayOfPrescriptionsByAddress(accounts[4]) === [""])
  })

});
