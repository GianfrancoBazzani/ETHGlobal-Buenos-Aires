import { defineDataset } from "@edgeandnode/amp"

export default defineDataset(() => ({
  namespace: "fernando", // replace this with a namespace of your choosing that will be a grouping of your datasets
  name: "aave_v3_base",
  // readme: `
  // # eth_global/counter.
  //
  // provide additional, helpful details about your dataset, its purpose and usage.
  // `,
  description: "Aave V3 Pool on Base",
  keywords: ["Base, AaveV3, Pool"], // Add other keywords that help define/explain your dataset
  sources: ["0xA238Dd80C259a72e81d7e4664a9801593F98d1c5"],
  network: process.env.VITE_AMP_NETWORK || "base-mainnet",
  dependencies: {
    rpc: process.env.VITE_AMP_RPC_DATASET || "edgeandnode/base_mainnet@0.0.1",
  },
  tables: {
    withdraw: {
      sql: `
        SELECT
          block_num,
          timestamp,
          tx_hash,
          log_index,
          pool_address,
          event['reserve'] AS reserve,
          event['user']    AS user,
          event['to']      AS to_address,
          event['amount']  AS amount
        FROM (
          SELECT
            l.block_num,
            l.timestamp,
            l.tx_hash,
            l.log_index,
            l.address AS pool_address,
            evm_decode(
              l.topic1, l.topic2, l.topic3, l.data,
              'Withdraw(address indexed reserve,address indexed user,address indexed to,uint256 amount)'
            ) AS event
          FROM rpc.logs l
          WHERE l.address = x'A238Dd80C259a72e81d7e4664a9801593F98d1c5'
            AND l.topic0 = evm_topic('Withdraw(address,address,address,uint256)')
        )
      `
    },
    supply: {
      sql: `
        SELECT
          block_num,
          timestamp,
          tx_hash,
          log_index,
          pool_address,
          event['reserve']       AS reserve,
          event['user']         AS user,
          event['onBehalfOf']   AS on_behalf_of,
          event['amount']       AS amount,
          event['referralCode'] AS referral_code
        FROM (
          SELECT
            l.block_num,
            l.timestamp,
            l.tx_hash,
            l.log_index,
            l.address AS pool_address,
            evm_decode(
              l.topic1, l.topic2, l.topic3, l.data,
              'Supply(address indexed reserve,address user,address indexed onBehalfOf,uint256 amount,uint16 indexed referralCode)'
            ) AS event
          FROM rpc.logs l
          WHERE l.address = x'A238Dd80C259a72e81d7e4664a9801593F98d1c5'
            AND l.topic0 = evm_topic('Supply(address,address,address,uint256,uint16)')
        )
      `
    }
  }
}))
