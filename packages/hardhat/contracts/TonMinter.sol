/*
  @title TonMinter v0.0.1
 ________  ________  _______   ________  ___
|\   ____\|\   __  \|\  ___ \ |\   __  \|\  \
\ \  \___|\ \  \|\  \ \   __/|\ \  \|\  \ \  \
 \ \  \    \ \   _  _\ \  \_|/_\ \  \\\  \ \  \
  \ \  \____\ \  \\  \\ \  \_|\ \ \  \\\  \ \  \____
   \ \_______\ \__\\ _\\ \_______\ \_______\ \_______\
    \|_______|\|__|\|__|\|_______|\|_______|\|_______|
  _______          __  __ _       _
 |__   __|        |  \/  (_)     | |
    | | ___  _ __ | \  / |_ _ __ | |_ ___ _ __
    | |/ _ \| '_ \| |\/| | | '_ \| __/ _ \ '__|
    | | (_) | | | | |  | | | | | | ||  __/ |
    |_|\___/|_| |_|_|  |_|_|_| |_|\__\___|_|
Author:      Joshua Bijak
Date:        April 09, 2021
Title:       TonMinter Prototype
Description: Contract that accepts signed proofs of a IoT Cookstove and mints an NFT ton when it hits 1000kg
  ___                            _
|_ _|_ __ ___  _ __   ___  _ __| |_ ___
 | || '_ ` _ \| '_ \ / _ \| '__| __/ __|
 | || | | | | | |_) | (_) | |  | |_\__ \
|___|_| |_| |_| .__/ \___/|_|   \__|___/
              |_|
*/
pragma solidity ^0.8.0;
pragma abicoder v2;



import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Interfaces/IContractNFT.sol";
import "./Definitions.sol";
import "./Interfaces/CarbonVCUInterface.sol";
import "hardhat/console.sol";

/*
  _____            _                  _
 / ____|          | |                | |
| |     ___  _ __ | |_ _ __ __ _  ___| |_
| |    / _ \| '_ \| __| '__/ _` |/ __| __|
| |___| (_) | | | | |_| | | (_| | (__| |_
 \_____\___/|_| |_|\__|_|  \__,_|\___|\__|
*/
/**
 * @author Joshua Bijak
 * @title TonMinter
 * @dev  Contract that accepts signed proofs of a IoT Cookstove and mints an NFT ton when it hits 1000kg
 * @notice Prototype Contract that accepts signed proofs of a IoT Cookstove and mints an NFT ton when it hits 1000kg
 *
 */
contract TonMinter is
AccessControlUpgradeable,
IContractNFT,
ERC721EnumerableUpgradeable
{

    /**
     *
          ______               _
         |  ____|             | |
         | |____   _____ _ __ | |_ ___
         |  __\ \ / / _ \ '_ \| __/ __|
         | |___\ V /  __/ | | | |_\__ \
         |______\_/ \___|_| |_|\__|___/
     *
     *
     */
    event newStoveID(uint256 stoveID);
    event stoveIDRemoved(uint256 stoveID);
    event newTonMinterCVCU(address newCVCU);
    event VCUSMinted(address sender, uint256 tokenID);
    event VCUSUpdated(uint256 tokenID, ConfirmationStatus status);
    event VCUSStatusUpdated(uint256 tokenID);


    /**
     *
     *    _____ _        _   _
         / ____| |      | | (_)
        | (___ | |_ __ _| |_ _  ___ ___
         \___ \| __/ _` | __| |/ __/ __|
         ____) | || (_| | |_| | (__\__ \
        |_____/ \__\__,_|\__|_|\___|___/
     *
     *
     */



    using SafeMathUpgradeable for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    bytes32 public constant PROJECT_DEVELOPER_ROLE = keccak256("PROJECT_DEVELOPER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    address public creolSuper;
    address public CVCUAddress;

    string public cookstoveIPFSURI;

    string public data = "Stove data";

    CarbonVCUInterface public CVCUInterface;

    uint256 public pendingCO2eTons;


    struct projectDeveloperInfo {
        uint256 pendingCO2eTons;
        mapping (uint256 => stoveProofs) stoveUUIDtoStoveProof;
        mapping (uint256 => bool) isValidStoveID;
    }

    struct stoveProof {
        uint256 burnTime;
        uint256 emissionFactor;
        uint256 tonsCO2e;
    }


    struct stoveProofs {
        stoveProof[] proofCollection;
    }

    mapping (address => projectDeveloperInfo) public addressToProjectDevInfo;
    mapping (address => bool) public isValidVerifier;
    mapping (bytes => bool) public isSubmittedBatch;

    mapping(uint256 => VCUSData) public list;


    /**
     *   __  __           _ _  __ _
        |  \/  |         | (_)/ _(_)
        | \  / | ___   __| |_| |_ _  ___ _ __ ___
        | |\/| |/ _ \ / _` | |  _| |/ _ \ '__/ __|
        | |  | | (_) | (_| | | | | |  __/ |  \__ \
        |_|  |_|\___/ \__,_|_|_| |_|\___|_|  |___/
    */
    modifier onlyAdmin() {
    require(isAdmin(msg.sender), "Restricted to admins.");
    _;
    }

    modifier onlyProjectDeveloper() {
        require(isProjectDeveloper(msg.sender), "Restricted to project developers");
        _;
    }

    modifier onlyVerifier() {
        require(isVerifier(msg.sender), "Restricted to project developers");
        _;
    }



     /**
      *   ______                _   _
         |  ____|              | | (_)
         | |__ _   _ _ __   ___| |_ _  ___  _ __  ___
         |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
         | |  | |_| | | | | (__| |_| | (_) | | | \__ \
         |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
     */



    function initialize(address _address) public virtual initializer {
        __ERC721_init_unchained(
            'Test Verified Carbon Units',
            'Test-VCUs'
        );
        _setupRole(DEFAULT_ADMIN_ROLE, _address
        );
        creolSuper = _address;
        _setRoleAdmin(PROJECT_DEVELOPER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(VERIFIER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    /**
      * @dev check whether an account has admin role
      * @param account Address to check
      */
     function isAdmin(address account) public virtual view returns (bool) {
         return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

     function isProjectDeveloper(address account) public view returns(bool) {
        return hasRole(PROJECT_DEVELOPER_ROLE, account);
    }

    function isVerifier(address account) public view returns(bool) {
        return hasRole(VERIFIER_ROLE, account);
    }

    function addProjectDeveloper(address account) public onlyAdmin {
        grantRole(PROJECT_DEVELOPER_ROLE, account);
        addressToProjectDevInfo[account];
    }

    function removeProjectDeveloper(address account) public onlyAdmin {
        revokeRole(PROJECT_DEVELOPER_ROLE, account);
    }

    function addVerifier(address account) public onlyAdmin {
        grantRole(VERIFIER_ROLE, account);
    }

    function removeVerifier(address account) public onlyAdmin {
        revokeRole(VERIFIER_ROLE, account);
    }


         /**
      * @dev add an approved stoveID to the contract
      * @param stoveID Unique stoveID number
      */
     function addStoveID (uint256 stoveID) public onlyProjectDeveloper {
         require(addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID] == false, "Stove ID is already registered");
         addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID] = true;
         emit newStoveID(stoveID);
     }
     /**
      * @dev remove an approved stoveID to the contract
      * @param stoveID Unique stoveID number
      */
     function removeStoveID(uint256 stoveID) public onlyProjectDeveloper {
         require(addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID] == true, "Stove ID is not currently registered");
         addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID] = false;
         emit newStoveID(stoveID);
     }

    /**
      * @dev check whether a stove ID has been registered
      * @param stoveID Unique stoveID number
      */
    function getStoveID(uint256 stoveID) public view returns (bool _isStoveID) {
        return addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID];
    }

     /**
      * @dev Returns the stove proofs for a given stoveID
      * @param stoveID Stove ID to query
      */
     function getProofs(address projectDeveloperAddress, uint256 stoveID) public view returns (stoveProof[] memory _stoveProofs) {
         return addressToProjectDevInfo[projectDeveloperAddress].stoveUUIDtoStoveProof[stoveID].proofCollection;

     }
    /**
      * @dev Returns the pending CO2e grams for a given address
      * @param projectDeveloperAddress Address belonging to a project developer
      */
     function getDeveloperPendingTons(address projectDeveloperAddress) public view returns (uint256 _pendingC02eTons) {
         return addressToProjectDevInfo[projectDeveloperAddress].pendingCO2eTons;
     }

    /**
      * @dev Returns a Keccack256 hash
      * @param _to Project developer address
      * @param _tonsCO2e Tons of CO2e to be approved
      * @param _message Message to be signed
      * @param _nonce MessageHash Nonce
      */
    function getMessageHash(
        address _to,
        uint256 _tonsCO2e,
        string memory _message,
        uint _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _tonsCO2e, _message, _nonce));
       //emit dataHashed(_to, _amount, _message, _nonce);
    }

    /**
      * @dev Returns a keccack256 hash
      * @param _messageHash Hash to be singed
      */

    function getEthSignedMessageHash(bytes32 _messageHash)
    public
    pure
    returns (bytes32)
    {
        return
        keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    /**
      * @dev Checks whether the input parameters and signature match and returns bool
      * @param _signer Address of verifier
      * @param _to Address of project developer
      * @param _tonsCO2e Number of tons
      * @param _message Hashed supporting data
      * @param _nonce Transaction nonce
      * @param signature Signature to be verified
      */

    function verify(
        address _signer,
        address _to,
        uint256 _tonsCO2e,
        string memory _message,
        uint _nonce,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_to, _tonsCO2e, _message, _nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
    public
    pure
    returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
    public
    pure
    returns (
        bytes32 r,
        bytes32 s,
        uint8 v
    )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {

        // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
        // second 32 bytes
            s := mload(add(sig, 64))
        // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }


     /**
      * @dev submits a new proof to be tracked by the smart contract on chain, if it hits 1000kg, it triggers a minting on the CVCU contract
      * @param stoveID The IoT Cookstove UUID
      * @param _signer Address of verifier
      * @param _to Address of project developer
      * @param _tonsCO2e Total Grams calculated for emission reduction
      * @param _message Hashed supporting data
      * @param signature Signature to be verified
      */

     function submitCarbonProof(
         uint256  stoveID,
         address _signer,
         address _to,
         uint256 _tonsCO2e,
         string memory _message,
         uint _nonce,
         bytes memory signature) public onlyProjectDeveloper {

         require(isSubmittedBatch[signature] == false, "This batch has already been submitted");
         require(isValidVerifier[_signer] == true, "Not a valid verifier");
         require(addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID] == true, "Not a valid stoveID");
         require( _tonsCO2e > 0, "gramsCO2e cannot be 0");

         bool verifyState = verify(_signer, _to, _tonsCO2e, _message, _nonce, signature);
         require(verifyState == true, "Not verified to mint");

         stoveProof memory _toBeAddedProof;
         _toBeAddedProof.tonsCO2e = _tonsCO2e;

         addressToProjectDevInfo[msg.sender].stoveUUIDtoStoveProof[stoveID].proofCollection.push(_toBeAddedProof);

         isSubmittedBatch[signature] = true;

         addressToProjectDevInfo[msg.sender].pendingCO2eTons = addressToProjectDevInfo[msg.sender].pendingCO2eTons.add(_tonsCO2e);


     }

    /**
      * @dev Allows caller to mint CVCUs when there is a threshold amount of CO2e in the contract, they are minted to the defined creolSuper address
      */
     function mintCVCU(uint256 tonsToMint) public onlyProjectDeveloper {
        require(tonsToMint > 0, "Tons to mint cannot be 0");

         for (uint i=0; i < tonsToMint; i++){
            require(addressToProjectDevInfo[msg.sender].pendingCO2eTons > 1, "Not enough pendingCO2eTons to mint");
            require(address(CVCUAddress) != address(0x0), "CarbonVCUInterface needs to be set");

            CVCUInterface.mintCU(creolSuper);

            addressToProjectDevInfo[msg.sender].pendingCO2eTons = addressToProjectDevInfo[msg.sender].pendingCO2eTons.sub(1);

         }
     }

    function mintEmptyVCU() public onlyProjectDeveloper returns (uint256 tokenID) {
        _tokenIDs.increment();
        uint256 newTokenId = _tokenIDs.current();
        _safeMint(msg.sender, newTokenId);
        list[newTokenId].status = ConfirmationStatus.Created;
        emit VCUSMinted(msg.sender, newTokenId);
        return newTokenId;
    }

    function testReturn() public view onlyProjectDeveloper returns (uint256) {
        uint256 testInt = 3;
        return testInt;
    }

    function verifyAndUpdate(
        uint256  stoveID,
        address _signer,
        address _to,
        uint256 _tonsCO2e,
        string memory _message,
        uint _nonce,
        uint256 tokenID,
        bytes memory signature) public onlyProjectDeveloper {

        require(isSubmittedBatch[signature] == false, "This batch has already been submitted");
        require(isValidVerifier[_signer] == true, "Not a valid verifier");
        require(addressToProjectDevInfo[msg.sender].isValidStoveID[stoveID] == true, "Not a valid stoveID");
        require( _tonsCO2e > 0, "gramsCO2e cannot be 0");

        bool verifyState = verify(_signer, _to, _tonsCO2e, _message, _nonce, signature);
        require(verifyState == true, "Not verified to mint");

        stoveProof memory _toBeAddedProof;
        _toBeAddedProof.tonsCO2e = _tonsCO2e;

        addressToProjectDevInfo[msg.sender].stoveUUIDtoStoveProof[stoveID].proofCollection.push(_toBeAddedProof);

        isSubmittedBatch[signature] = true;

        CVCUInterface.updateCU(msg.sender, tokenID);

    }

     function setStoveURI(string memory _stoveURI) public onlyProjectDeveloper {
         cookstoveIPFSURI = _stoveURI;
     }

      function setTonMinterCVCU(address _CVCU) public onlyAdmin {

         CVCUAddress = _CVCU;
         CVCUInterface = CarbonVCUInterface(_CVCU);
         emit newTonMinterCVCU(_CVCU);
     }

    // Interface function

    function getData(
        uint256 tokenId
    ) external view override returns(VCUSData memory) {
        return list[tokenId];
    }

    // Contract stuff

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlUpgradeable, ERC721EnumerableUpgradeable)
    returns (bool)
    {
        return interfaceId == type(IAccessControlUpgradeable).interfaceId || ERC721Upgradeable.supportsInterface(interfaceId);
    }




/**
 *
 *
 *   _                      _
    | |                    | |
    | |     ___  __ _  __ _| |
    | |    / _ \/ _` |/ _` | |
    | |___|  __/ (_| | (_| | |
    |______\___|\__, |\__,_|_|
                 __/ |
                |___/
 *
 * They come with no warranty and are not for use in a production setting. For production usage, please contact joshua.bijak@creol.io
 *
 */
 }
