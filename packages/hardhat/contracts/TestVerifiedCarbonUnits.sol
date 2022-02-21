// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Creol
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Interfaces/IContractNFT.sol";
import "./Definitions.sol";
import "./C3/Common.sol";

contract TestVerifiedCarbonUnits is
    IContractNFT,
    ERC721EnumerableUpgradeable,
    Common
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    event VCUSMinted(address sender, uint256 tokenID);
    event VCUSUpdated(uint256 tokenID);
    event VCUSStatusUpdated(uint256 tokenID, ConfirmationStatus status);

    mapping(uint256 => VCUSData) public list;

    address public adminAddress;

    function initialize(address _address) public virtual initializer {
        __ERC721_init_unchained(
            'Test Verified Carbon Units',
            'Test-VCUs'
        );
        adminAddress = _address;
    }

    function mintCU(address to) external virtual returns (uint256) {
        require(msg.sender == adminAddress);
        _tokenIDs.increment();
        uint256 newTokenId = _tokenIDs.current();
        _safeMint(to, newTokenId);
        list[newTokenId].status = ConfirmationStatus.Created;
        emit VCUSMinted(to, newTokenId);
        return newTokenId;
    }

    function updateCU(
        uint256 tokenID
    ) external virtual whenNotPaused {

        //Require user to be project developer


        require(
            ownerOf(tokenID) == _msgSender() || isSupervisor(),
        'The NFT can be updated only from owner or supervisor');

        require(
            list[tokenID].status != ConfirmationStatus.Pending,
            'You can\'t change info of NFT that is under approval');

        require(
            list[tokenID].status != ConfirmationStatus.Approved,
            'You can\'t change info of NFT that is already Approved');

        list[tokenID].status = ConfirmationStatus.Pending;

        emit VCUSUpdated(tokenID);
        emit VCUSStatusUpdated(tokenID, ConfirmationStatus.Pending);

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
