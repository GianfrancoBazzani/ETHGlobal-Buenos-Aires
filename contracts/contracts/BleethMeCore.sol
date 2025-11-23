// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IBleethMeCore} from "./interfaces/IBleethMeCore.sol";
import {IBaseAdapter} from "./interfaces/IBaseAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {EnumerableMap} from "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEntropyV2} from "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract BleethMeCore is IBleethMeCore, IEntropyConsumer, Ownable {
    using EnumerableMap for EnumerableMap.AddressToBytes32Map;

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

    struct VAStream {
        bytes32 balancesMerkleRoot;
        IBaseAdapter liquidityOrigin;
        IBaseAdapter liquidityDestination;
        uint256 totalRewards;
    }

    uint256 constant MINIMUM_INITIAL_BET = 0;
    uint256 constant INVALIDATION_WINDOW = 1 hours;
    uint256 constant PENALIZATION_BPS = 100_00;
    uint256 constant MAX_PRICE_AGE = 1 minutes;

    mapping(uint256 => VAPool) public vaPools;
    mapping(uint256 => VAStream) public vaStreams;
    EnumerableMap.AddressToBytes32Map private whitelistedRewardTokens;
    mapping(uint64 sequenceNumber => uint256 vaPoolId) public randomnessMapping;
    uint256 public vaPoolCount;
    IEntropyV2 public entropy;
    IPyth public pyth;

    constructor(address initialOwner, address _entropy, address _pyth) Ownable(initialOwner) {
        entropy = IEntropyV2(_entropy);
        pyth = IPyth(_pyth);
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
            require(whitelistedRewardTokens.get(address(rewardTokens[i])) != bytes32(0), RewardTokenNotWhitelisted());
            vaPools[vaPoolCount].rewardTokens[rewardTokens[i]] = true;
        }

        // Place initial bet
        require(initialBetAmount >= MINIMUM_INITIAL_BET, InsufficientBetAmount());
        require(whitelistedRewardTokens.get(address(initialBetToken)) != bytes32(0), RewardTokenNotWhitelisted());
        _placeBet(vaPoolCount, BetSide.FOR, initialBetToken, initialBetAmount);

        emit VAPoolCreated(bytes32(vaPoolCount), address(attacker), address(victim));
    }

    function placeBet(uint256 vaPoolId, BetSide side, IERC20 token, uint256 amount) external {
        _placeBet(vaPoolId, side, token, amount);
    }

    function withdrawFailedBet(uint256 vaPoolId) external {
        // TODO
    }

    function finalizeBetting(uint256 vaPoolId, bytes[] calldata priceUpdate) external payable {
        require(vaPools[vaPoolId].state == VAPoolState.BETTING, BettingPeriodClosed());
        require(block.timestamp >= vaPools[vaPoolId].auctionEndTimestamp, "not finalized");

        // Update the price feed
        uint256 fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{value: fee}(priceUpdate);

        if (vaPools[vaPoolId].invalidatableBetters.length != 0) {
            uint128 requestFee = entropy.getFeeV2();
            if (msg.value < requestFee) revert("not enough fees");
            randomnessMapping[entropy.requestV2{value: requestFee}()] = vaPoolId;
        } else {
            uint256 rewards = _computeRewards(vaPoolId);
            _processWinningSide(vaPoolId, rewards);
            vaPools[vaPoolId].state = VAPoolState.MIGRATION;
        }
    }

    function entropyCallback(uint64 sequenceNumber, address, bytes32 randomNumber) internal override {
        uint256 vaPoolId = randomnessMapping[sequenceNumber];

        uint256 finalAuctionEndTimestamp =
            vaPools[vaPoolId].auctionEndTimestamp - (uint256(randomNumber) % INVALIDATION_WINDOW);
        Bet memory winnerBet;
        for (uint256 i = vaPools[vaPoolId].invalidatableBetters.length; i >= 0; i--) {
            Bet storage bet = vaPools[vaPoolId].bets[vaPools[vaPoolId].invalidatableBetters[i]];
            if (bet.timestamp < finalAuctionEndTimestamp) {
                break;
            } else if (bet.side == BetSide.FOR) {
                vaPools[vaPoolId].totalBetFor[bet.token] -= bet.amount;
            } else {
                vaPools[vaPoolId].totalBetAgainst[bet.token] -= bet.amount;
            }
        }
        // TODO
        uint256 rewards = _computeRewards(vaPoolId);
        _processWinningSide(vaPoolId, rewards);
        vaPools[vaPoolId].state = VAPoolState.MIGRATION;
    }

    // onlyOwner functions
    function setWhitelistRewardToken(IERC20 token, bytes32 priceFeedId) external onlyOwner {
        // TODO check oracle

        whitelistedRewardTokens.set(address(token), priceFeedId);

        emit RewardTokenWhitelisted(address(token), priceFeedId);
    }

    function finalizeBettingPeriod(uint256 vaPoolId) external onlyOwner {
        require(vaPools[vaPoolId].state == VAPoolState.BETTING, BettingPeriodClosed());
        vaPools[vaPoolId].state = VAPoolState.MIGRATION;
    }

    // View functions
    function getBet(uint256 vaPoolId, address better) external view returns (Bet memory) {
        return vaPools[vaPoolId].bets[better];
    }

    function computeTotalBets(uint256 vaPoolId) public view returns (uint256 totalFor, uint256 totalAgainst) {
        // TODO
    }

    function getWhitelistedRewardTokens() public view returns (address[] memory) {
        return whitelistedRewardTokens.keys();
    }

    function getWhitelistedRewardTokenPriceFeedId(IERC20 token) external view returns (bytes32) {
        return whitelistedRewardTokens.get(address(token));
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    // Private functions
    function _placeBet(uint256 vaPoolId, BetSide side, IERC20 token, uint256 amount) private {
        require(vaPools[vaPoolId].state == VAPoolState.BETTING, BettingPeriodClosed());
        require(vaPools[vaPoolId].rewardTokens[token], RewardTokenNotWhitelisted());
        require(vaPools[vaPoolId].bets[msg.sender].amount == 0, BetAlreadyPlaced());

        vaPools[vaPoolId].bets[msg.sender] = Bet({side: side, token: token, amount: amount, timestamp: block.timestamp});
        if (side == BetSide.FOR) {
            vaPools[vaPoolId].totalBetFor[token] += amount;
        } else {
            vaPools[vaPoolId].totalBetAgainst[token] += amount;
        }

        if (block.timestamp + INVALIDATION_WINDOW >= vaPools[vaPoolId].auctionEndTimestamp) {
            vaPools[vaPoolId].invalidatableBetters.push(msg.sender);
        }

        token.transferFrom(msg.sender, address(this), amount);

        emit BetPlaced(bytes32(vaPoolId), msg.sender);
    }

    function _processWinningSide(uint256 vaPoolId, uint256 rewards) internal {
        // TODO
    }

    function _computeRewards(uint256 vaPoolId) internal view returns (uint256) {
        address[] memory rewardTokens = getWhitelistedRewardTokens();
        
        uint256 totalValueFor = 0;
        uint256 totalValueAgainst = 0;

        uint256 length = rewardTokens.length;
        for (uint256 i = 0; i < length; i++) {
            if (vaPools[vaPoolId].rewardTokens[IERC20(rewardTokens[i])]) {
                bytes32 priceFeedId = whitelistedRewardTokens.get(rewardTokens[i]); 
                PythStructs.Price memory price = pyth.getPriceNoOlderThan(priceFeedId, MAX_PRICE_AGE);

            }
        }

        // TODO
    }
}
