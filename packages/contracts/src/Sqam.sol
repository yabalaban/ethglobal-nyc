// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC2771Context } from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import { SqamEvents } from "./SqamEvents.sol";

contract Sqam is SqamEvents, ERC2771Context {
    /// @dev there's no state to make it as cheap as possible

    constructor(address trustredForwarder)
        ERC2771Context(trustredForwarder)
    {}

    function reportAddress(address reported) external {
        emit ReportedAddress(reported, _msgSender());
    }

    function reportDomain(string calldata domain, bool good) external {
        bytes32 domainHash = keccak256(bytes(domain));
        emit ReportedDomain(domainHash, good, _msgSender(), domain);
    }
}
