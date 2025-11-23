# bleeth.me - ETHGlobal Buenos Aires 2025


![Bleeth Logo](./bleeth-frontend/public/bleeth-02.gif)

Bleeth.me is a cornerstone protocol that systematizes the DeFi liquidity wars while enabling DeFi protocols to reduce their mercenary liquidity providers. Its core mechanic is built around Vampire Attack (VA) Pools. A VA Pool can be created permissionlessly by anyone to initiate a deliberately targeted liquidity-stealing attack against a competitor protocol. Additionally, to protect against mercenary liquidity, a configurable lockup period can be specified to ensure that the funds remain deposited as liquidity in the destination protocol for a predetermined amount of time.


## Protocol Specification

### Vampire Attack Steps and Time Windows

Protocol steps:
 1. **VA Pool creation**: Anyone can create a vampire attack pool specifying the VA Pool configuration parameters.
 2. **Betting period**: Once the attack is created, a betting period starts where third parties can bet 'for' or 'against' the attack.
 3. **Liquidity migration period**: Once the betting period is finished the direction of the attack is known and a liquidity stream channel is open to easily allow the users to dissolve their liquidity positions on the origin protocol and migrate the funds to the destination protocol adapter contract.
 4. **Liquidity locking period**: Utilization of migrated liquidity is incentivized in the destination protocol by distributing rewards.
 5. **Funds unlock and rewards withdrawal**: Once the locking period has passed the migrated users can unlock their funds and obtain the extra rewards.
 
### Vampire Attack Pool Parameters

The configuration parameters of a VA Pool are specified by the `VAPool` struct.

```solidity
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
```

### Incentives

Liquidity searchers: Actors that see value on migrate and lock liquidity (Protocols Ecosystems or Fandom community).

Liquidity Pro: Actors that held liquidity (Victim protocol users).

### Betting

When an attack is created the direction is not yet specified, meaning that attacker and victim protocols are specified but origin and destination of the funds (direction of the liquidity stream) are still pending do be defined. The resolution of the bet defines the direction of the attack. The bet allows to the users to bet 'for' or 'against' depositing reward token, the bet outcome is determined by the direction with higher value deposited.

Possible outcomes:
 - 'for':
    - attacker becomes destination
    - victim becomes origin
 - 'against':
    - attacker becomes origin
    - victim becomes destination

The funds on the winning side will be used to be payed as rewards to the users that participate in the liquidity migration.
The funds on the losing side will be returned to the loser betters minus a penalization that will be accounted to the winning side. 

In order to prevent **sniping** (Last-minute bidding), the betting period finalization time is randomized using Pyth Entropy in a time window close to the finalization time specified by the user.

![Pyth random finalization](./schemas/random-betting-finalization-time.png)

### Liquidity Migration

Users can migrate the liquidity to the migration protocol once the betting period has been finalized. In order to allow only users that where actually providing liquidity to the original protocol the average liquidity during a certain period previous to the initialization of the VAPool of the users is snapshooted and calculated using The Graph Amp datasets. The amp used amp queries can be found on [amp](./amp/) folder.
 
A merkle three is computed off chain with all positions and the root of this is submitted to the contracts by a trusted relayer, in order to be able to migrate the liquidity the users have to prove that they had liquidity in the origin protocol, by submitting a merkle inclusion proof to the core contract.


### Rewards Distribution

Rewards are distributed during liquidity locking period only to users that use the migrated liquidity in the destination protocol using a rewards Synthetix like rewards distribution algorithm.

## Contracts

Contracts arch

![Pyth random finalization](./schemas/rcontracts.png)



### bleeth.me core

Singleton contract that handles the VA Pools and the betting and rewards distribution logic.

### bleeth.me Adapters

Adapters with protocols, held the locked liquidity and allows the users to manage the liquidity.


## Project commands

### Run tests

`pnpm hardhat test contracts/tests/BleethMeCore.t.sol`

## Deployments

BleethMeCore: `0x32E3337321578c7ecE3AF13ba98aa70581a15203`