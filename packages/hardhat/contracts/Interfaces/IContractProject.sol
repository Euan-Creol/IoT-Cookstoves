// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

interface IContractProject {

    function isRegistryEnable(string memory _registry) external view returns(bool);
    function projectExists(string memory _projectKey) external view returns(bool);
    function isProjectEnable(string memory _projectKey) external view returns(bool);
    function isBannedVintageProject(string memory _projectKey, uint256 _vintage) external view returns(bool);

}