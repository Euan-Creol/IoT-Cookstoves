// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import './Interfaces/IContractAddresses.sol';
import './Interfaces/IContractProject.sol';
import "./Common.sol";
import 'hardhat/console.sol';
import "./Interfaces/IContractProjectFactory.sol";
import '@openzeppelin/contracts/utils/Strings.sol';

contract C3ProjectTokenFactory is
    IContractProjectFactory,
    Common
{

    event NewTokenProject(string projectName, address tokenAddress);

    address public projectProxyToken;
    address[] public projectsDeployedAddresses;

    // registry -> mapping
    mapping(string => address) infoProjects;

    function initialize(address _address) public virtual initializer {
        _commonInit();
        orchestratorAddress = _address;
    }

    function setProjectProxyToken(address _address) external virtual onlyOwner {
        projectProxyToken = _address;
    }

    function nameFactory(string memory _registry, string memory _project, uint256 _vintage) internal pure returns (string memory) {
        return string(abi.encodePacked("C3 Tokens: C3T-", _registry, "-", _project, "-", Strings.toString(_vintage)));
    }

    function symbolFactory(string memory _registry, string memory _project, uint256 _vintage) external pure override returns (string memory) {
        return _symbolFactory(_registry,_project,_vintage);
    }

    // symbol factory it will works also like internal mapping id

    function _symbolFactory(string memory _registry, string memory _project, uint256 _vintage) internal pure returns (string memory) {
        return string(abi.encodePacked(_registry, "-", _project, "-", Strings.toString(_vintage)));
    }

    function projectHasToken(
        string memory _registry,
        string memory _project,
        uint256 _vintage
    ) external view override virtual returns (bool)
    {
        string memory symbol = _symbolFactory(_registry, _project, _vintage);
        if (infoProjects[symbol] == address(0)) {
            return false;
        } else {
            return true;
        }
    }

    function getProjectVintageAddress(
        string memory _registry,
        string memory _project,
        uint256 _vintage
    ) external view override virtual returns (address) {
        string memory symbol = _symbolFactory(_registry, _project, _vintage);
        return infoProjects[symbol];
    }

    function newToken(string memory _registry, string memory _project, uint256 _vintage) external virtual onlyOwner whenNotPaused {

        // check if registry key is allowed (for example VCS-GS-CDM)

        address projectAddress = IContractAddresses(orchestratorAddress).project();

        require(
            IContractProject(projectAddress).isRegistryEnable(_registry),
            'Registry provider doesn\'t not exists or it is not active'
        );

        string memory projectKey = string(abi.encodePacked(_registry, "-", _project));

        require(
            !IContractProject(projectAddress).isBannedVintageProject(projectKey, _vintage),
            'This vintage for this project is banned'
        );

        string memory symbol = _symbolFactory(_registry, _project, _vintage);
        string memory name = nameFactory(_registry, _project, _vintage);

        // check if the projects already exists with the project and year
        require(
            infoProjects[symbol] == address(0),
            'This project for this vintage already have the token'
        );

        string memory signature = 'initialize(string,string,string,address)';
        bytes memory payload = abi.encodeWithSignature(
            signature,
            name,
            "C3T",
            symbol,
            orchestratorAddress
        );

        BeaconProxy token = new BeaconProxy(projectProxyToken, payload);
        address tokenAddress = address(token);
        projectsDeployedAddresses.push(tokenAddress);
        infoProjects[symbol] = tokenAddress;
        emit NewTokenProject(name, tokenAddress);

    }

    function getProjectsDeployedAddresses() public view virtual returns (address[] memory) {
        return projectsDeployedAddresses;
    }

}