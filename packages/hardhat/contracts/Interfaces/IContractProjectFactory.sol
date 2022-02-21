// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

interface IContractProjectFactory {

    function symbolFactory(string memory _registry, string memory _project, uint256 _vintage) external pure returns (string memory);
    function projectHasToken(string memory _registry, string memory _project, uint256 _vintage) external view returns (bool);
    function getProjectVintageAddress(string memory _registry, string memory _project, uint256 _vintage) external view returns (address);

}