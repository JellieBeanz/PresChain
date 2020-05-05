// File: contracts\PresChain.sol

pragma solidity ^0.5.12;

pragma experimental ABIEncoderV2;

import "./ERC721Full.sol";
import "./Ownable.sol";

contract CryptoPres is  ERC721Full("CryptoPres","PRES"), Ownable {





    // Token name "CryptoPres";


    // Token symbol "PRES";

    // Mapping from token ID to owner
    mapping (uint256 => address) private tokenOwner;

    // Mapping from owner to list of owned token IDs

    mapping(address => uint256[]) internal ownedPrescriptions;


    // Mapping from token ID to index of the owner tokens list

    mapping(uint256 => uint256) internal ownedPrescriptionsIndex;

    // Mapping from owner to number of owned token
    mapping (address => Counters.Counter) private ownedTokensCount;

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

        _mint(_to, _presId);

        uint256 length = ownedPrescriptions[_to].length;

        ownedPrescriptions[_to].push(_presId);

        ownedPrescriptionsIndex[_presId] = length;

    }

    event PrescriptionData(Data[] _array);


    function destroy(uint256 _id) public {
        Data[] memory _array = getprescriptionData(_id);
        address owner = msg.sender;

        require(ownerOf(_id) == owner, "CryptoPres: burn of token that is not own");

        ownedTokensCount[owner].decrement();
        tokenOwner[_id] = address(0);

        _removeTokenFromOwnerEnumeration(owner, _id);
        // Since tokenId will be deleted, we can clear its slot in _ownedTokensIndex to trigger a gas refund
        ownedPrescriptionsIndex[_id] = 0;

        _removeTokenFromAllTokensEnumeration(_id);

        emit PrescriptionData(_array);
    }

    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = allPrescriptions.length.sub(1);
        uint256 tokenIndex = allPrescriptionsIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = allPrescriptions[lastTokenIndex];

        allPrescriptions[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        allPrescriptionsIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        allPrescriptions.length--;
        allPrescriptionsIndex[tokenId] = 0;

    }



    function transferPres(address _to, uint256 _tokenId) public{
        address from = msg.sender;

        require(ownerOf(_tokenId) == from, "CryptoPres: transfer of token that is not own");
        require(_to != address(0), "CryptoPres: transfer to the zero address");

        ownedTokensCount[from].decrement();
        ownedTokensCount[_to].increment();

        tokenOwner[_tokenId] = _to;

        _removeTokenFromOwnerEnumeration(from, _tokenId);
        _addTokenToOwnerEnumeration(_to, _tokenId);

    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = tokenOwner[tokenId];
        return owner != address(0);
    }

     function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = tokenOwner[tokenId];
        require(owner != address(0), "CryptoPres: owner query for nonexistent token");

        return owner;
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        ownedPrescriptionsIndex[tokenId] = ownedPrescriptions[to].length;
        ownedPrescriptions[to].push(tokenId);
    }

     /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        allPrescriptionsIndex[tokenId] = allPrescriptions.length;
        allPrescriptions.push(tokenId);
    }

    /**

     * @dev Internal function to mint a new token

     * @dev Reverts if the given token ID already exists

     * @param _to address the beneficiary that will own the minted token

     */

    function _mint(address _to, uint256 _id) internal {

        _addTokenToAllTokensEnumeration(_id);

        _addTokenToOwnerEnumeration(_to, _id);

        require(_to != address(0), "CryptoPres: mint to the zero address");
        require(!_exists(_id), "CryptoPres: token already minted");

        tokenOwner[_id] = _to;
        ownedTokensCount[_to].increment();


    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = ownedPrescriptions[from].length.sub(1);
        uint256 tokenIndex = ownedPrescriptionsIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = ownedPrescriptions[from][lastTokenIndex];

            ownedPrescriptions[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            ownedPrescriptionsIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        ownedPrescriptions[from].length--;

        // Note that _ownedTokensIndex[tokenId] hasn't been cleared: it still points to the old slot (now occupied by
        // lastTokenId, or just over the end of the array if the token was the last one).
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
