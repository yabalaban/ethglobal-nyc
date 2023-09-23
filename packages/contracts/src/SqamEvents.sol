// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface SqamEvents {
    event ReportedDomain(bytes32 indexed domainHash, bool indexed good, address indexed reporter, string domain);
    event ReportedAddress(address indexed reported, address indexed reporter);
}
