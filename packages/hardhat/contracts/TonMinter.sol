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
import "./BokkyPooBahsDateTimeLibrary.sol";


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
    event VCUSUpdated(uint256 tokenID, string methodology, uint256 _tonsCO2e, uint256 vintageStart, uint256 vintageEnd, string dataLink);
    event VCUSStatusUpdated(uint256 tokenID, ConfirmationStatus status);
    event VCUSMetaDataUpdated(uint256 tokenId, string url);



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
        uint256[] tokenIDs;
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

    mapping (address => projectDeveloperInfo) private addressToProjectDevInfo;
    mapping (address => bool) public isValidVerifier;
    mapping (bytes => bool) public isSubmittedBatch;

    mapping(uint256 => VCUSData) public list;

    mapping(uint256 => string) private _tokenURIs;


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
      * @param _address Address to check
      */
     function isAdmin(address _address) public virtual view returns (bool) {
         return hasRole(DEFAULT_ADMIN_ROLE, _address);
    }

     function isProjectDeveloper(address _address) public view returns(bool) {
        return hasRole(PROJECT_DEVELOPER_ROLE, _address);
    }

    function isVerifier(address _address) public view returns(bool) {
        return hasRole(VERIFIER_ROLE, _address);
    }

    function changeAdmin(address _address) public onlyAdmin {
        grantRole(DEFAULT_ADMIN_ROLE, _address);
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addProjectDeveloper(address _address) public onlyAdmin {
        grantRole(PROJECT_DEVELOPER_ROLE, _address);
        addressToProjectDevInfo[_address];
    }

    function removeProjectDeveloper(address _address) public onlyAdmin {
        revokeRole(PROJECT_DEVELOPER_ROLE, _address);
    }

    function addVerifier(address _address) public onlyAdmin {
        grantRole(VERIFIER_ROLE, _address);
    }

    function removeVerifier(address _address) public onlyAdmin {
        revokeRole(VERIFIER_ROLE, _address);
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
         //return addressToProjectDevInfo[projectDeveloperAddress].pendingCO2eTons;
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


    function mintEmptyVCU() public onlyProjectDeveloper returns (uint256 tokenID) {
        _tokenIDs.increment();
        uint256 newTokenID = _tokenIDs.current();
        _safeMint(msg.sender, newTokenID);
        list[newTokenID].status = ConfirmationStatus.Created;
        addressToProjectDevInfo[msg.sender].tokenIDs.push(newTokenID);
        emit VCUSMinted(msg.sender, newTokenID);
        return newTokenID;
    }

    function getTokenIDs(address _address) public view returns (uint256[] memory) {
        return addressToProjectDevInfo[_address].tokenIDs;
    }

    function updateCU(
        uint256 tokenID,
        string memory methodology,
        uint256 _tonsCO2e,
        uint256 vintageStart,
        uint256 vintageEnd,
        string memory dataLink
) public onlyProjectDeveloper {

        require(
            ownerOf(tokenID) == _msgSender() || isAdmin(msg.sender),
            'The NFT can be updated only from owner or admin');
        require(
            list[tokenID].status != ConfirmationStatus.Pending,
            'You can\'t change info of NFT that is under approval');
        require(
            list[tokenID].status != ConfirmationStatus.Approved,
            'You can\'t change info of NFT that is already Approved');
        require( _tonsCO2e > 0, "tonsCO2e cannot be 0");

        uint256 vintage = BokkyPooBahsDateTimeLibrary.getYear(vintageStart);

        list[tokenID].methodology = methodology;
        list[tokenID].projectDeveloper = msg.sender;
        list[tokenID].quantity = _tonsCO2e;
        list[tokenID].vintage = vintage;
        list[tokenID].vintageStart = vintageStart;
        list[tokenID].vintageEnd = vintageEnd;
        list[tokenID].dataLink = dataLink;

        list[tokenID].status = ConfirmationStatus.Pending;

        emit VCUSUpdated(tokenID, methodology, _tonsCO2e, vintageStart, vintageEnd, dataLink);
        emit VCUSStatusUpdated(tokenID, ConfirmationStatus.Pending);
    }

     function setStoveURI(string memory _stoveURI) public onlyProjectDeveloper {
         cookstoveIPFSURI = _stoveURI;
     }

    function resetCU(
        uint256 tokenId
    ) external virtual onlyAdmin {

        require(
            _exists(tokenId),
            'ERC721: token not exists'
        );

        require(
            list[tokenId].status != ConfirmationStatus.Approved,
            'This VCUs is already approved'
        );

        _setTokenURI(tokenId,'');
        list[tokenId].status = ConfirmationStatus.Created;
        emit VCUSStatusUpdated(tokenId, ConfirmationStatus.Created);

    }

    function approveCU(
        uint256 tokenID,
        address projectDeveloper,
        uint256 _tonsCO2e,
        string memory tokenMetadata,
        uint _nonce,
        bytes memory signature
    ) external virtual onlyVerifier {

        require(
            _exists(tokenID),
            'ERC721: token not exists'
        );

        require(_tonsCO2e > 0, 'Amount of carbon must be greater than zero');


        require(
            list[tokenID].status != ConfirmationStatus.Approved,
            'This VCU is already approved'
        );

        require(
            list[tokenID].status != ConfirmationStatus.Created || list[tokenID].status != ConfirmationStatus.Rejected,
            'This VCU is not yet filled with information'
        );

        require(isSubmittedBatch[signature] == false, "This batch has already been submitted");

        bool verifyState = verify(msg.sender, projectDeveloper, _tonsCO2e, tokenMetadata, _nonce, signature);
        require(verifyState == true, "Not verified to mint");

        list[tokenID].verifier = msg.sender;
        list[tokenID].verifierSignature = signature;

        list[tokenID].status = ConfirmationStatus.Approved;

        isSubmittedBatch[signature] = true;

        emit VCUSStatusUpdated(tokenID, ConfirmationStatus.Approved);
    }

    function rejectCU(
        uint256 tokenID
    ) external virtual onlyVerifier {

        require(
            _exists(tokenID),
            'ERC721: token not exists'
        );

        require(
            list[tokenID].status == ConfirmationStatus.Pending,
            'This VCUs must be in Pending to Reject'
        );

        list[tokenID].status = ConfirmationStatus.Rejected;
        emit VCUSStatusUpdated(tokenID, ConfirmationStatus.Rejected);

    }

    function _setTokenURI(uint256 tokenID, string memory _tokenURI) internal virtual {
        require(_exists(tokenID), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenID] = _tokenURI;
    }

    function setMetadata(
        uint256 tokenID,
        string memory uri
    ) external virtual onlyProjectDeveloper {

        require(
            _exists(tokenID),
            'ERC721: token not exists'
        );

        require(
            list[tokenID].status == ConfirmationStatus.Approved,
            'This VCUs is not approved'
        );

        require(
            _isApprovedOrOwner(_msgSender(), tokenID),
            'ERC721: metadata caller is not owner nor approved'
        );

        _setTokenURI(tokenID,uri);
        emit VCUSMetaDataUpdated(tokenID, uri);
    }


    function getTokenURI(uint256 tokenID) public view virtual returns (string memory) {
        require(_exists(tokenID), "ERC721URIStorage: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenID];
        return _tokenURI;
    }

    // Interface function

    function getData(
        uint256 tokenID
    ) external view override returns(VCUSData memory) {
        return list[tokenID];
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
