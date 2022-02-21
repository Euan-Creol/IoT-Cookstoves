// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

interface IContractAddresses {

    function projectFactory() external view returns (address);
    function project() external view returns (address);
    function nft() external view returns (address);

}