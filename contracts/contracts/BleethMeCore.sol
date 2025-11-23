// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IBleethMeCore} from "./interfaces/IBleethMeCore.sol";
import {IBaseAdapter} from "./interfaces/IBaseAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEntropyV2} from "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract BleethMeCore is IBleethMeCore, IEntropyConsumer, Ownable {

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
    mapping(uint64 sequenceNumber => uint256 vaPoolId) public randomnessMapping;
    uint256 public vaPoolCount;
    IEntropyV2 public entropy;

    constructor(address initialOwner, address _entropy) Ownable(initialOwner) {
        entropy = IEntropyV2(_entropy);
    }

    function createVaPool(
        IBaseAdapter attacker,
        IBaseAdapter victim,
        IERC20[] calldata rewardTokens,
        uint256 penalizationCoefficient,
        uint256 auctionDuration,
        uint256 liquidityMigrationDelay,
        uint256 lockDuration,
        uint256 snapshotLookupTimestamp,
        IERC20 initialBetToken,
        uint256 initialBetAmount
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
            require(whitelistedRewardTokens[rewardTokens[i]], RewardTokenNotWhitelisted());
            vaPools[vaPoolCount].rewardTokens[rewardTokens[i]] = true;
        }

        // Place initial bet
        require(initialBetAmount >= MINIMUM_INITIAL_BET, InsufficientBetAmount());
        require(whitelistedRewardTokens[initialBetToken], RewardTokenNotWhitelisted());
        _placeBet(vaPoolCount, BetSide.FOR, initialBetToken, initialBetAmount);

        emit VAPoolCreated(bytes32(vaPoolCount), address(attacker), address(victim));
    }

    function placeBet(uint256 vaPoolId, BetSide side, IERC20 token, uint256 amount) external {
        _placeBet(vaPoolId, side, token, amount);
    }

    function finalizeBetting(uint256 vaPoolId) external payable {
        require(block.timestamp >= vaPools[vaPoolId].auctionEndTimestamp, "not finalized");
        uint128 requestFee = entropy.getFeeV2();
        if (msg.value < requestFee) revert("not enough fees");
        randomnessMapping[entropy.requestV2{ value: requestFee }()] = vaPoolId;
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address,
        bytes32 randomNumber
    ) internal override {
        uint256 vaPoolId = randomnessMapping[sequenceNumber];
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
    
    // onlyOwner functions
    function setWhitelistRewardToken(IERC20 token, bool status) external onlyOwner {

        whitelistedRewardTokens[token] = status;

        emit RewardTokenWhitelisted(address(token), status);
    }
    
    // View functions
    function getBet(uint256 vaPoolId, address better) external view returns (Bet memory) {
        return vaPools[vaPoolId].bets[better];
    }

    function computeTotalBets(uint256 vaPoolId) public view returns (uint256 totalFor, uint256 totalAgainst) {}


    // Private functions
    function _placeBet(uint256 vaPoolId, BetSide side, IERC20 token, uint256 amount) private {

        require(vaPools[vaPoolId].state == VAPoolState.BETTING, BettingPeriodClosed());
        require(vaPools[vaPoolId].rewardTokens[token], BettingPeriodClosed());

        vaPools[vaPoolId].bets[msg.sender] = Bet({
            side: side,
            token: token,
            amount: amount,
            timestamp: block.timestamp
        });
        if (side == BetSide.FOR) {
            vaPools[vaPoolId].totalBetFor[token] += amount;
        } else {
            vaPools[vaPoolId].totalBetAgainst[token] += amount;
        }

      if (block.timestamp + INVALIDATION_WINDOW >= vaPools[vaPoolId].auctionEndTimestamp) {
            vaPools[vaPoolId].invalidatableBetters.push(msg.sender);
        }

        emit BetPlaced(bytes32(vaPoolId), msg.sender);
    }

}
