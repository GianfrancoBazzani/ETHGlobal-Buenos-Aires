#!/usr/bin/env bash

pnpm amp query \
  --flight-url "https://gateway.amp.staging.thegraph.com/" \
  --format json \
  --bearer-token 'your-token' \
  -- \
"SELECT
  user_address,
  token_address,
  SUM(amount) AS balance_raw
FROM (
  -- Supplies: positive
  SELECT
    user                      AS user_address,
    reserve                   AS token_address,
    CAST(amount AS DECIMAL(38,0))   AS amount
  FROM \"fernando/aave_v3_base@0.0.1\".\"supply\"
  WHERE _block_num <= 38540968

  UNION ALL

  -- Withdraws: negative
  SELECT
    user                      AS user_address,
    reserve                   AS token_address,
    -CAST(amount AS DECIMAL(38,0)) AS amount
  FROM \"fernando/aave_v3_base@0.0.1\".\"withdraw\"
  WHERE _block_num <= 38540968
) AS movements
GROUP BY
  user_address,
  token_address
HAVING SUM(amount) > 0
ORDER BY
  user_address,
  token_address;" \
  > balances_raw3.txt
