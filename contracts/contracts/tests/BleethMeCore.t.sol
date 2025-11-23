// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {BleethMeCore} from "../BleethMeCore.sol";
import {Test, console} from "forge-std/Test.sol";
import {MockEntropy} from "./mocks/MockEntropy.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockAdapter} from "./mocks/MockAdapter.sol";


contract BleethMeCoreTest is Test {
    // Contracts
    BleethMeCore bleethMeCore;
    
    // Mocks
    MockERC20 rewardTokenA;
    MockERC20 rewardTokenB;
    MockERC20 liquidityTokenA;
    MockERC20 liquidityTokenB;
    MockAdapter attackerAdapter;
    MockAdapter victimAdapter;
    MockEntropy mockEntropy;

    address constant OWNER = address(0xABCD);
    address constant USER1 = address(0x1111);

    function setUp() public {
        
        // Deploy mock ERC20 token for testing
        rewardTokenA = new MockERC20("Reward Token A", "RTA", OWNER);
        rewardTokenB = new MockERC20("Reward Token B", "RTB", OWNER);
        liquidityTokenA = new MockERC20("Liquidity Token A", "LTA", OWNER);
        liquidityTokenB = new MockERC20("Liquidity Token B", "LTB", OWNER);  
        
        // Deploy mock adapters
        attackerAdapter = new MockAdapter(address(bleethMeCore));
        victimAdapter = new MockAdapter(address(bleethMeCore));
        mockEntropy = new MockEntropy();

        // Deploy BleethMeCore contract
        bleethMeCore = new BleethMeCore(OWNER, address(mockEntropy));

        // Whitelist reward tokens
        vm.startPrank(OWNER);
        bleethMeCore.setWhitelistRewardToken(rewardTokenA, true);
        bleethMeCore.setWhitelistRewardToken(rewardTokenB, true);
        vm.stopPrank();

    }
    

    function test_VaPoolCreation() public {
        vm.startPrank(USER1);
        
       
    }
}
