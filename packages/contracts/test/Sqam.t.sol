// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console2 } from "forge-std/Test.sol";
import { Sqam } from "../src/Sqam.sol";
import { SqamEvents } from "../src/SqamEvents.sol";

contract SqamTest is Test, SqamEvents {
    Sqam public sqam;

    function setUp() public {
        sqam = new Sqam(address(0));
    }

    function testReportAddress(address reported) public {
        vm.expectEmit(true, true, true, true);
        emit ReportedAddress(reported, address(this));
        sqam.reportAddress(reported);
    }

    function testReportDomain(bytes32 domainHash, bool good) public {
        vm.expectEmit(true, true, true, true);
        emit ReportedDomain(domainHash, good, address(this));
        sqam.reportDomain(domainHash, good);
    }
}
