// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

struct VCUSData {
    string project; // it is a project key of project, it will be set after the new project was created
    string registry; // the registry where it is retired the certificate (VCS etc)
    uint256 vintage; // the vintage of retirement
    uint256 vintageStart; // date of start vintage
    uint256 vintageEnd; // date of end vintage
    string serialNumber; // it is a unique serial number on the registry that are you using
    uint256 quantity;
    ConfirmationStatus status; // it is the status , it will be in approved after it was verified on the registry.
}

enum ConfirmationStatus {
    Created,
    Pending,
    Approved,
    Rejected
}