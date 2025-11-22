// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { IBleethMeCore } from "./interfaces/IBleethMeCore.sol";

contract BleethMeCore is IBleethMeCore {

    // Bet Structure
    struct Bet {
        BetSide side;
        IERC20 token;
        uint256 amount;
    }
 
    // Vampire Attack Pool Structure
    struct VAPool {
        IBleethMeCore attacker;
        IBleethMeCore victim;
        IERC20[] rewardTokens;
        uint256 penalizationCoefficient;
        uint256 auctionEndTimestamp;
        uint256 liquidityMigrationTimestamp;
        uint256 lockTimestamp;
        uint256 snapshotLookupTime;
        mapping(address => Bet) bets;
        uint256 totalBetFor;
        uint256 totalBetAgainst;
        address[] invalidatableBetters;
        VAPoolState state;
    } 

    // Mapping of VA Pools 
    mapping(bytes32 => VAPool) public vaPools;




}
