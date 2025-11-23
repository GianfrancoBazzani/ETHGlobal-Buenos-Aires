import { HermesClient } from "@pythnetwork/hermes-client";

// Hermes API endpoint
const HERMES_URL = "https://hermes.pyth.network";

// Price feed IDs for common tokens
export const PRICE_FEED_IDS = {
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  USDC: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  "1INCH": "0x63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3",
  LINK: "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
} as const;

/**
 * Fetch the latest price updates from Hermes for given price feed IDs
 * @param priceFeedIds - Array of price feed IDs to fetch updates for
 * @returns The price update data as bytes array
 */
export async function fetchPriceUpdates(
  priceFeedIds: string[]
): Promise<string[]> {
  const connection = new HermesClient(HERMES_URL, {});

  try {
    // Get latest price updates
    const priceUpdates = await connection.getLatestPriceUpdates(priceFeedIds);

    if (!priceUpdates || !priceUpdates.binary || !priceUpdates.binary.data) {
      throw new Error("No price updates available");
    }

    // Return the binary data as an array (Hermes returns it as an array already)
    return priceUpdates.binary.data;
  } catch (error) {
    console.error("Error fetching price updates from Hermes:", error);
    throw error;
  }
}

/**
 * Get the update fee for price updates
 * @param updateDataArray - Array of price update data
 * @returns The fee required in wei as bigint
 */
export function getUpdateFee(updateDataArray: string[]): bigint {
  // Pyth charges 1 wei per price update on most chains
  // For production, you should fetch this from the Pyth contract's getUpdateFee method
  return BigInt(updateDataArray.length);
}

/**
 * Fetch price updates for whitelisted reward tokens
 * This fetches updates for all common tokens used in the protocol
 */
export async function fetchRewardTokenPriceUpdates(): Promise<{
  priceUpdates: string[];
  updateFee: bigint;
}> {
  // Fetch price updates for all whitelisted tokens
  const priceFeedIds = Object.values(PRICE_FEED_IDS);
  const priceUpdates = await fetchPriceUpdates(priceFeedIds);
  const updateFee = getUpdateFee(priceUpdates);

  return {
    priceUpdates,
    updateFee,
  };
}
