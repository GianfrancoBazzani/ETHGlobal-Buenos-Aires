import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OWNER_ADDRESS = "0xb3f6D14F835233cDeD732418F6861e8a2c0a0F2e";
const BASE_ENTROPY = "0x6e7d74fa7d5c90fef9f0512987605a6d546181bb"
const PYTH_ORACLE = "0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a";


export default buildModule("Deploy", (m) => {
  const apollo = m.contract("BleethMeCore", [OWNER_ADDRESS, BASE_ENTROPY, PYTH_ORACLE]);

  // whitelist tokens m.call(apollo, "launch", []);

  return { apollo };
});