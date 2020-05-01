// File: contracts\PresChain.sol

pragma solidity ^0.5.12;

pragma experimental ABIEncoderV2;

import "./ERC721Full.sol";
import "./Ownable.sol";

contract CryptoPres is  ERC721Full("CryptoPres","PRES"), Ownable {





    // Token name "CryptoPres";


    // Token symbol "PRES";


    // Mapping from owner to list of owned token IDs

    mapping(address => uint256[]) internal ownedPrescriptions;


    // Mapping from token ID to index of the owner tokens list

    mapping(uint256 => uint256) internal ownedPrescriptionsIndex;


    // Array with all token ids, used for enumeration

    uint256[] internal allPrescriptions;


    // Mapping from token id to position in the allPrescriptions array

    mapping(uint256 => uint256) internal allPrescriptionsIndex;


    // Optional mapping for token URIs

    mapping(uint256 => string) internal PrescriptionURIs;


    struct Data{

        string drugName;

        string drugCode;

        string dosage;

    }

    Data[] dataArray;



    mapping(uint256 => Data[]) internal prescriptionData;




    function mint(address _to, uint256 _id) external onlyDoctor {

        _mint(_to, _id);

    }


    function arrayOfPrescriptionsByAddress(address _holder) public view returns(uint256[] memory) {

        return ownedPrescriptions[_holder];

    }


    /**

     * @dev Returns an URI for a given token ID

     * @dev Throws if the token ID does not exist. May return an empty string.

     * @param _presId uint256 ID of the token to query

     */

    function prescriptionsURI(uint256 _presId) public view returns (string memory) {

        require(_exists(_presId),"prescriptionsURI");

        return PrescriptionURIs[_presId];

    }


    /**

     * @dev Gets the token ID at a given index of the tokens list of the requested owner

     * @param _owner address owning the tokens list to be accessed

     * @param _index uint256 representing the index to be accessed of the requested tokens list

     * @return uint256 token ID at the given index of the tokens list owned by the requested address

     */

    function prescriptionOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256) {

        require(_index < balanceOf(_owner), "tokenOfOwnerByIndex");

        return ownedPrescriptions[_owner][_index];

    }


    /**

     * @dev Gets the total amount of tokens stored by the contract

     * @return uint256 representing the total amount of tokens

     */

    function totalSupply() public view returns (uint256) {

        return allPrescriptions.length;

    }


    /**

     * @dev Gets the token ID at a given index of all the tokens in this contract

     * @dev Reverts if the index is greater or equal to the total number of tokens

     * @param _index uint256 representing the index to be accessed of the tokens list

     * @return uint256 token ID at the given index of the tokens list

     */

    function prescriptionByIndex(uint256 _index) public view returns (uint256) {

        require(_index < totalSupply(),"prescriptionByIndex");

        return allPrescriptions[_index];

    }


    /**

     * @dev Internal function to set the token URI for a given token

     * @dev Reverts if the token ID does not exist

     * @param _presId uint256 ID of the token to set its URI

     * @param _uri string URI to assign

     */

    function _setprescriptionsURI(uint256 _presId, string memory _uri) internal {

        require(_exists(_presId),"_setprescriptionsURI");

        PrescriptionURIs[_presId] = _uri;

    }




    /**

     * @dev Internal function to add a token ID to the list of a given address

     * @param _to address representing the new owner of the given token ID

     * @param _presId uint256 ID of the token to be added to the tokens list of the given address

     */

    function addPrescriptionTo(address _to, uint256 _presId) internal {

        super._mint(_to, _presId);

        uint256 length = ownedPrescriptions[_to].length;

        ownedPrescriptions[_to].push(_presId);

        ownedPrescriptionsIndex[_presId] = length;

    }

    function destroy( uint256 _id) public {
        address _owner = msg.sender;
        require(msg.sender == _owner);
        _burn(_owner,_id);
    }

    function transferPres(address _to, uint256 _tokenId) public{
     address from = msg.sender;
     require(from == msg.sender);

    _transferFrom(from, _to, _tokenId);
    }

    /**

     * @dev Internal function to mint a new token

     * @dev Reverts if the given token ID already exists

     * @param _to address the beneficiary that will own the minted token

     */

    function _mint(address _to, uint256 _id) internal {

        allPrescriptions.push(_id);

        allPrescriptionsIndex[_id] = _id;

        super._mint(_to, _id);

        ownedPrescriptions[_to].push(_id);

    }
    function addprescriptionDatatoArrayBatch(address _to, uint _presId, string[] memory _drugName, string[] memory _drugCode, string[] memory _dosage) public onlyDoctor{
        require(_drugName.length == _drugCode.length && _drugCode.length == _dosage.length, "all arrays must be same length");
        _mint(_to, _presId);
       for (uint i=0; i<_drugName.length; i++) {
           addprescriptionDatatoArray(_drugName[i], _drugCode[i], _dosage[i]);
        }
        addprescriptionData(_presId);
    }

    function addprescriptionDatatoArray(string memory _drugName, string memory _drugCode, string memory _dosage) internal onlyDoctor{
        Data memory d = Data(_drugName,_drugCode,_dosage);
        dataArray.push(d);
    }


    function addprescriptionData(uint _presId) internal onlyDoctor{

            require(doctor == msg.sender,"addprescriptionData");

            prescriptionData[_presId] = dataArray;
            delete dataArray;

    }

    function getprescriptionData(uint _presId) public view returns(Data[] memory _array){
        require(_exists(_presId),"getprescriptionData");
        _array = prescriptionData[_presId];
    }

}
