## AMP integration overview

This documents the AMP integration we built to index and analyze Aave V3 Pool activity on Base. We created a dataset that captures all transactions emitting Supply and Withdraw events, and we layered a simple aggregation on top to derive user-token balances from raw movements.

### Dataset: `fernando/aave_v3_base`

**Tables**:
  - `supply`: decodes the `Supply(address reserve,address user,address onBehalfOf,uint256 amount,uint16 referralCode)` event
  - `withdraw`: decodes the `Withdraw(address reserve,address user,address to,uint256 amount)` event

Both tables are defined in `amp/amp-demo/amp.config.ts` and use the `rpc.logs` dependency (`edgeandnode/base_mainnet@0.0.1`) for raw chain data.

### Aggregation: user balances from movements

On top of the dataset, we aggregate supplies (positive) and withdraws (negative) to compute per-user, per-token balances. The following query is what we used to materialize positive balances:

```sql
WITH params AS (
  -- Set your desired snapshot block here
  SELECT 38540968 AS block_limit
)
SELECT
  user_address,
  token_address,
  SUM(amount) AS balance_raw
FROM (
  -- Supplies: positive
  SELECT
    user                     AS user_address,
    reserve                  AS token_address,
    CAST(amount AS DECIMAL(38,0))  AS amount
  FROM "fernando/aave_v3_base@0.0.1"."supply", params
  WHERE _block_num <= params.block_limit

  UNION ALL

  -- Withdraws: negative
  SELECT
    user                     AS user_address,
    reserve                  AS token_address,
    -CAST(amount AS DECIMAL(38,0)) AS amount
  FROM "fernando/aave_v3_base@0.0.1"."withdraw", params
  WHERE _block_num <= params.block_limit
) AS movements
GROUP BY
  user_address,
  token_address
HAVING SUM(amount) > 0
ORDER BY
  user_address,
  token_address;
```
Where `params.block_limit` defines the snapshot height. Using `_block_num <= block_limit` computes how many tokens a user has as-of that block (all movements up to and including the target block). This yields each `(user_address, token_address)` pair with a strictly positive `balance_raw`, representing net supplied amounts at that moment.


### Important file location

- Dataset definition: `amp/amp.config.ts` cloned from `amp/amp-demo/amp.config.ts`
- App usage (queries/UI): `amp/amp-demo/app/*`



### Feedback

- **Docs and CLI**: The docs and the `amp` CLI were helpful to get started and deploy the dataset. However, some CLI/runtime error messages were not self‑explanatory:
    - The playground sometimes failed without a descriptive error message. This was solved by running the query through the CLI, that did indeed present the error.
I think more descriptive errors and explicit examples would improve the developer experience.
- **Indexer speed & queries**: Although some of the starting tests were taking some time (tests created for the dataset with LIMIT 1) After creating and deploying the dataset, the indexer synced quickly and began serving results with minimal lag. I was impressed by the speed, as I didn't think it could be powerful enough of indexing all user balances.
- **Demo repo and CLI installation**: amp-demo repo was really helpful to go straight to the dataset creation, and the steps where straightforward. However, the installation failed and the logs were not helpufl at all.


