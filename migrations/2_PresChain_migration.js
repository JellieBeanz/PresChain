const PresChain = artifacts.require("CryptoPres");

module.exports = function(deployer) {
  deployer.deploy(PresChain);
};
