// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import "@openzeppelin/contracts/utils/Counters.sol";
import './Interfaces/IContractAddresses.sol';
import './Interfaces/IContractProject.sol';
import './Interfaces/IContractProjectFactory.sol';
import "./Common.sol";
import 'hardhat/console.sol';
import "./Interfaces/IContractNFT.sol";
import "./C3Definitions.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";

/*
    It is the single Verified Carbon Units to check
*/
contract C3VerifiedCarbonUnits is
    IContractNFT,
    ERC721EnumerableUpgradeable,
    Common
{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event VCUSMinted(address sender, uint256 tokenId);
    event VCUSUpdated(uint256 tokenId, string registry, string serialNumber);
    event VCUSStatusUpdated(uint256 tokenId, ConfirmationStatus status);

    mapping(uint256 => VCUSData) public list;
    mapping(string => bool) public verifiedSerialNumbers;

    // Ipfs mapping for tokenUris
    mapping(uint256 => string) private _tokenURIs;

    event VCUSMetaDataUpdated(uint256 tokenId, string url);

    function initialize(address _address) public virtual initializer {
        _commonInit();
        __ERC721_init_unchained(
            'C3: Verified Carbon Units',
            'C3-VCUs'
        );
        orchestratorAddress = _address;
    }

    /*
        It is the first call made from the web app.
        It will create an empty NFT that the owner have to fill with project infos
    */
    function mintCU(address to) external virtual whenNotPaused {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);
        list[newTokenId].status = ConfirmationStatus.Created;
        emit VCUSMinted(to, newTokenId);
    }

    /*
        It is called in second step usually by user to update the NFT with all info about the certificate
    */

    function updateCU(
        uint256 tokenId,
        string memory registry,
        string memory serialNumber
    ) external virtual whenNotPaused {

        require(
            ownerOf(tokenId) == _msgSender() || isSupervisor(),
        'The NFT can be updated only from owner or supervisor');

        // check if registry key is allowed (for example VCS-GS-CDM)
        address projectAddress = IContractAddresses(orchestratorAddress).project();
        require(
            IContractProject(projectAddress).isRegistryEnable(registry),
            'Registry provider doesn\'t not exists or it is not active'
        );

        require(
            list[tokenId].status != ConfirmationStatus.Pending,
            'You can\'t change info of NFT that is under approval');

    require(
            list[tokenId].status != ConfirmationStatus.Approved,
            'You can\'t change info of NFT that is already Approved');

        require(
            verifiedSerialNumbers[serialNumber] == false,
            'This retirement has already been approved'
        );

        list[tokenId].serialNumber = serialNumber;
        list[tokenId].registry = registry;
        list[tokenId].status = ConfirmationStatus.Pending;

        emit VCUSUpdated(tokenId,registry,serialNumber);
        emit VCUSStatusUpdated(tokenId, ConfirmationStatus.Pending);

    }

    /**
        This function is to fix few if there was some problem in confirmation example wrong serialNumber
    **/

    function resetCU(
        uint256 tokenId
    ) external virtual onlySupervisor whenNotPaused {

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

    function rejectCURetirement(
        uint256 tokenId
    ) external virtual onlySupervisor whenNotPaused {

        require(
            _exists(tokenId),
            'ERC721: token not exists'
        );

        require(
            list[tokenId].status == ConfirmationStatus.Pending,
            'This VCUs must be in Pending to Reject'
        );

        verifiedSerialNumbers[list[tokenId].serialNumber] = false;
        list[tokenId].status = ConfirmationStatus.Rejected;
        emit VCUSStatusUpdated(tokenId, ConfirmationStatus.Rejected);

    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    /**
        The supervisor call this method after the approval to set information about retirement and project
    **/
    function setMetadata(
        uint256 tokenId,
        string memory uri
    ) external virtual onlySupervisor whenNotPaused {

        require(
            _exists(tokenId),
            'ERC721: token not exists'
        );

        require(
            list[tokenId].status == ConfirmationStatus.Approved,
            'This VCUs is not approved'
        );

        _setTokenURI(tokenId,uri);
        emit VCUSMetaDataUpdated(tokenId, uri);

    }

        /**
            This function it is called by our supervisor to approve the retirement for the NFT and link it to our project
        **/
    function approveCURetirement(
        uint256 tokenId,
        string memory project,
        uint256 vintageStart,
        uint256 vintageEnd,
        uint256 quantity
    ) external virtual onlySupervisor whenNotPaused {

        require(
            _exists(tokenId),
            'ERC721: token not exists'
        );

        string memory projectKey = string(abi.encodePacked(list[tokenId].registry, "-", project));

        uint256 vintage = BokkyPooBahsDateTimeLibrary.getYear(vintageStart);

        require(
            list[tokenId].status != ConfirmationStatus.Approved,
            'This VCUs is already approved'
        );

        require(
            list[tokenId].status != ConfirmationStatus.Created || list[tokenId].status != ConfirmationStatus.Rejected,
            'This VCUs is not yet filled with information'
        );

        address projectAddress = IContractAddresses(orchestratorAddress).project();

        // check if project is already created in the our registry
        require(
            IContractProject(projectAddress).isProjectEnable(projectKey),
            string(abi.encodePacked('The project doesn\'t exists or it is not enable',"-",projectKey))
        );

        // check if the vintage year for this project is banned
        require(
            !IContractProject(projectAddress).isBannedVintageProject(projectKey,vintage),
            'This vintage year for this project is not accepted'
        );

        address projectFactory = IContractAddresses(orchestratorAddress).projectFactory();

        // check if the vintage year has already the ERC20 token
        require(
            IContractProjectFactory(projectFactory).projectHasToken(list[tokenId].registry,project,vintage),
            'The token for this retirement doesn\'t yet exists'
        );

        list[tokenId].project = project;
        list[tokenId].vintage = vintage;
        list[tokenId].vintageStart = vintageStart;
        list[tokenId].vintageEnd = vintageEnd;
        list[tokenId].quantity = quantity;

        verifiedSerialNumbers[list[tokenId].serialNumber] = true;
        list[tokenId].status = ConfirmationStatus.Approved;

        emit VCUSStatusUpdated(tokenId, ConfirmationStatus.Approved);

    }

    /**
       This function will be called from the user if want transform it NFT in new ERC20 token
    **/
    function fractionalize(uint256 tokenId) external virtual {

        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            'ERC721: transfer caller is not owner nor approved'
        );

        require(
            list[tokenId].status == ConfirmationStatus.Approved,
            'This NFT it is not yet approved'
        );

        address projectFactory = IContractAddresses(orchestratorAddress).projectFactory();

        require(
            IContractProjectFactory(projectFactory).projectHasToken(list[tokenId].registry,list[tokenId].project,list[tokenId].vintage),
            'The token for this retirement doesn\'t yet exists'
        );

        address erc20 = IContractProjectFactory(projectFactory).getProjectVintageAddress(list[tokenId].registry,list[tokenId].project,list[tokenId].vintage);

        safeTransferFrom(_msgSender(), erc20, tokenId, '');

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

}