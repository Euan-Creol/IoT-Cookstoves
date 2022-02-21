// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "../Definitions.sol";

interface IContractNFT {

    function getData(uint256 tokenId) external view returns(VCUSData memory);

}