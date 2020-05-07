// File: contracts\Ownable.sol
pragma solidity ^0.5.12;

contract Ownable {
     address public owner;
     address public pendingOwner;
     address public doctor;


     event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


     /**
     * @dev Throws if called by any account other than the owner.
     */
     modifier onlyOwner() {
         require(msg.sender == owner);
         _;
     }


     /**
      * @dev Modifier throws if called by any account other than the doctor.
      */
     modifier onlyDoctor() {
         require(msg.sender == doctor);
         _;
     }


     /**
      * @dev Modifier throws if called by any account other than the pendingOwner.
      */
     modifier onlyPendingOwner() {
         require(msg.sender == pendingOwner);
         _;
     }


     constructor() public {
         owner = msg.sender;
     }


     /**
      * @dev Allows the current owner to set the pendingOwner address.
      * @param newOwner The address to transfer ownership to.
      */
     function transferOwnership(address newOwner) public onlyOwner {
         pendingOwner = newOwner;
     }


     /**
      * @dev Allows the pendingOwner address to finalize the transfer.
      */
     function claimOwnership() public onlyPendingOwner {
         emit OwnershipTransferred(owner, pendingOwner);
         owner = pendingOwner;
         pendingOwner = address(0);
     }


     /**
      * @dev Sets the doctor address.
      * @param _doctor The doctor address.
      */
     function setDoctor(address _doctor) public onlyOwner {
         require(_doctor != owner, "Ownable: Owner cannot set themselves as doctor");
         require(_doctor != address(0));
         doctor = _doctor;
     }


 }
