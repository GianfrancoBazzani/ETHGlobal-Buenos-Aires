// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { IBleethMeCore } from "./IBleethMeCore.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBleethMeCore {
    
    enum VAPoolState {
        UNINITIALIZED,
        BETTING,
        MIGRATION,
        LOCKING,
        WITHDRAWAL 
    }

    enum BetSide {
        FOR,
        AGAINST
    }

    function createVaPool(
        IBleethMeCore attacker,
        IBleethMeCore victim,
        IERC20[] calldata rewardTokens,
        uint256 penalizationCoefficient,
        uint256 auctionDuration,
        uint256 liquidityMigrationDelay,
        uint256 lockDuration,
        uint256 snapshotLookupTime
    ) external returns (bytes32 poolId);
    
    function placeBet(
        bytes32 poolId,
        BetSide side,
        IERC20 token,
        uint256 amount
    ) external;


    // TODO Enumerated mapping

    // Admin Functions
    function whitelistRewardToken(IERC20 token) external;
}
