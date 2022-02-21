// SPDX-FileType: SOURCE
// SPDX-FileCopyrightText: 2022 Crypto Carbon Company
// SPDX-License-Identifier:  UNLICENSED

pragma solidity ^0.8.0;

struct VCUSData {
    string Methodology;
    address projectDeveloper;
    address verifier;
    uint256 quantity;
    uint256 vintageStart; // date of start vintage
    uint256 vintageEnd; // date of end vintage
    string dataLink;
    string verifierSignature;
    ConfirmationStatus status; // it is the status , it will be in approved after it was verified on the registry.
}

enum ConfirmationStatus {
    Created,
    Pending,
    Approved,
    Rejected
}
