// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IBleethMeCore} from "./interfaces/IBleethMeCore.sol";
import {IBaseAdapter} from "./interfaces/IBaseAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract BleethMeCore is IBleethMeCore, Ownable {

    struct VAPool {
        IBaseAdapter attacker;
        IBaseAdapter victim;
        mapping(IERC20 => bool) rewardTokens;
        uint256 penalizationCoefficient;
        uint256 auctionEndTimestamp;
        uint256 liquidityMigrationTimestamp;
        uint256 lockTimestamp;
        uint256 snapshotLookupTimestamp;
        mapping(address => Bet) bets;
        mapping(IERC20 => uint256) totalBetFor;
        mapping(IERC20 => uint256) totalBetAgainst;
        address[] invalidatableBetters;
        VAPoolState state;
    }

    uint256 constant MINIMUM_INITIAL_BET = 0;
    uint256 constant INVALIDATION_WINDOW = 1 hours;

    mapping(uint256 => VAPool) public vaPools;
    mapping(IERC20 => bool) public whitelistedRewardTokens;
    uint256 public vaPoolCount;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createVaPool(
        IBaseAdapter attacker,
        IBaseAdapter victim,
        IERC20[] calldata rewardTokens,
        uint256 penalizationCoefficient,
        uint256 auctionDuration,
        uint256 liquidityMigrationDelay,
        uint256 lockDuration,
        uint256 snapshotLookupTimestamp,
        Bet memory initialBet
    ) external returns (bytes32 poolId) {
        // Initialize vaPool
        vaPools[++vaPoolCount].attacker = attacker;
        vaPools[vaPoolCount].victim = victim;
        vaPools[vaPoolCount].penalizationCoefficient = penalizationCoefficient;
        vaPools[vaPoolCount].auctionEndTimestamp = block.timestamp + auctionDuration;
        vaPools[vaPoolCount].liquidityMigrationTimestamp = block.timestamp + auctionDuration + liquidityMigrationDelay;
        vaPools[vaPoolCount].lockTimestamp = block.timestamp + auctionDuration + liquidityMigrationDelay + lockDuration;
        vaPools[vaPoolCount].snapshotLookupTimestamp = snapshotLookupTimestamp;
        vaPools[vaPoolCount].state = VAPoolState.BETTING;

        // Set reward tokens
        uint256 length = rewardTokens.length;
        for (uint256 i = 0; i < length; i++) {
            vaPools[vaPoolCount].rewardTokens[rewardTokens[i]] = true;
        }

        // Place initial bet
        require(initialBet.amount >= MINIMUM_INITIAL_BET, InsufficientBetAmount());
        _placeBet(vaPoolCount, initialBet);

        emit VAPoolCreated(bytes32(vaPoolCount), address(attacker), address(victim));
    }

    function placeBet(uint256 vaPoolId, Bet memory bet) external {
        _placeBet(vaPoolId, bet);
    }

    function finalizeBetting(uint256 vaPoolId) external {
        require(block.timestamp >= vaPools[vaPoolCount].auctionEndTimestamp, "not finalized");

    }
    
    // View functions
    function getBet(uint256 vaPoolId, address better) external view returns (Bet memory) {
        return vaPools[vaPoolId].bets[better];
    }

    // onlyOwner functions
    function whitelistRewardToken(IERC20 token) external onlyOwner {
        
    }

    // Private functions
    function _placeBet(uint256 vaPoolId, Bet memory bet) private {

        require(vaPools[vaPoolId].state == VAPoolState.BETTING, BettingPeriodClosed());
        require(vaPools[vaPoolId].rewardTokens[bet.token], BettingPeriodClosed());

        vaPools[vaPoolId].bets[msg.sender] = bet;
        if (bet.side == BetSide.FOR) {
            vaPools[vaPoolId].totalBetFor[bet.token] += bet.amount;
        } else {
            vaPools[vaPoolId].totalBetAgainst[bet.token] += bet.amount;
        }

        vaPools[vaPoolId].bets[msg.sender] = bet;
        
        if (block.timestamp + INVALIDATION_WINDOW >= vaPools[vaPoolId].auctionEndTimestamp) {
            vaPools[vaPoolId].invalidatableBetters.push(msg.sender);
        }

        emit BetPlaced(bytes32(vaPoolId), msg.sender);
    }
}
