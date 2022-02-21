// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import "./Common.sol";
import "./Interfaces/IContractProject.sol";

contract C3Projects is
    IContractProject,
    Common
{

    struct ProjectData {
        string name;
        string project_id; // id internal of each registry
        string project_type; // Co2 ecc
        string registry; // type of registry (VERRA etc)
        string country;
        string region;
        string methodology; // it is the methodology like ACM0002 ecc
        uint64 period_start; // timestamp of start credit period
        uint64 period_end; // timestamp of end credit period
        bool active; //
        string uri; // link of project on registry site
        string ac; // additional certifications
    }

    uint128 public counter;

    mapping(string => uint128) public registryCounter;

    mapping(string => bool) public supportedRegistries;

    // {registry}-{id}
    mapping(string => ProjectData) public projectData;

    // {registry}-{id}-{vintage}
    mapping(string => bool) public bannedProjectVintage;

    // array with all projects id
    string[] public projectsId;

    // {registry}-{id}
    mapping(string => bool) private _projectExists;

    event ProjectCreated(string projectName);
    event ProjectUpdate(string projectName);

    function initialize(address _address) public virtual initializer {
        _commonInit();
        orchestratorAddress = _address;
    }

    /**
        This function will create or update the project
        It will called from the team after their have checked that projcect exists
    **/
    function addProject(
        string memory project_name,
        string memory project_id,
        string memory project_type,
        string memory registry,
        uint64 period_start,
        uint64 period_end,
        string memory region,
        string memory country,
        string memory methodology,
        string memory ac,
        string memory url
    ) external virtual onlySupervisor {

        require(supportedRegistries[registry],
            'The registry is not supported'
        );

        require(
            period_end >= period_start,
            'The info about start credit period must be high than end'
        );

        string memory projectKey = string(abi.encodePacked(registry, "-", project_id));

        bool isUpdating = _projectExists[projectKey];

        projectData[projectKey].name = project_name;
        projectData[projectKey].project_id = project_id;
        projectData[projectKey].project_type = project_type;
        projectData[projectKey].registry = registry;
        projectData[projectKey].region = region;
        projectData[projectKey].country = country;
        projectData[projectKey].methodology = methodology;
        projectData[projectKey].period_start = period_start;
        projectData[projectKey].period_end = period_end;
        projectData[projectKey].ac = ac;
        projectData[projectKey].uri = url;

        if(isUpdating) {
            emit ProjectUpdate(projectKey);
        } else {
            _projectExists[projectKey] = true;
            projectData[projectKey].active = true; // default it is active
            projectsId.push(projectKey);
            counter++;
            registryCounter[registry]++;
            emit ProjectCreated(projectKey);
        }

        //console.log("Current project counter " , counter);

    }

    function setBannedVintageProject(string memory _projectKey, uint256 _vintage , bool _enable) external onlySupervisor {

        bool exists = projectData[_projectKey].period_start != 0;

        require(exists, 'This project doesn\'t exists');

        string memory vintageKey = string(abi.encodePacked(_projectKey, "-", _vintage));

        bannedProjectVintage[vintageKey] = _enable;

    }

    function isBannedVintageProject(string memory _projectKey, uint256 _vintage) external view override returns(bool) {

        string memory vintageKey = string(abi.encodePacked(_projectKey, "-", _vintage));

        return bannedProjectVintage[vintageKey];

    }

    function enableRegistry(string memory _registry, bool _enable) external onlySupervisor {
        supportedRegistries[_registry] = _enable;
    }

    function isRegistryEnable(string memory _registry) external view override returns(bool) {
        return supportedRegistries[_registry];
    }

    function projectExists(string memory _projectKey) external view override returns(bool) {
        return _projectExists[_projectKey];
    }

    function enableProject(string memory _projectKey, bool _enable) external onlySupervisor {
        projectData[_projectKey].active = _enable;
    }

    function isProjectEnable(string memory _projectKey) external view override returns(bool) {
        return projectData[_projectKey].active;
    }

}