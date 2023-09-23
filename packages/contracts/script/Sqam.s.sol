// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script, console2 } from "forge-std/Script.sol";
import { Sqam } from "../src/Sqam.sol";

contract DeploySqamScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Sqam sqam = new Sqam{salt: bytes32(uint256(1337))}(
            // trusted forwarder is gelato erc2771
            0xb539068872230f20456CF38EC52EF2f91AF4AE49
        );

        console2.log("sqam address: ", address(sqam));

        vm.stopBroadcast();
    }
}
