"use client";

import { useState } from "react";

interface Protocol {
  name: string;
  icon: string;
}

interface PotsProps {
  onBack: () => void;
}

// Protocol data
const protocols: Protocol[] = [
  { name: "Aave", icon: "https://cryptologos.cc/logos/aave-aave-logo.svg" },
  { name: "Morpho", icon: "https://world.org/_next/image?url=https%3A%2F%2Fworld-id-assets.com%2Fapp_6acbab8bc5c5fe527f5ff6201934d043%2F31ac7d01-4bf4-4440-baf7-3a1e08506514.jpg&w=1920&q=75" },
  { name: "Uniswap", icon: "https://cryptologos.cc/logos/uniswap-uni-logo.svg" },
  { name: "Compound", icon: "https://cryptologos.cc/logos/compound-comp-logo.svg" },
  { name: "Curve", icon: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg" },
  { name: "Lido", icon: "https://cryptologos.cc/logos/lido-dao-ldo-logo.svg" },
];

// Generate 9 battles (3x3 matrix)
const generateBattles = (): Array<{ protocol1: Protocol; protocol2: Protocol }> => {
  const battles = [];
  const usedCombinations = new Set<string>();

  // Helper function to create a unique key for a battle combination
  const getBattleKey = (p1: Protocol, p2: Protocol): string => {
    const names = [p1.name, p2.name].sort();
    return `${names[0]}-${names[1]}`;
  };

  // First battle is always Morpho vs Aave
  const morpho = protocols.find(p => p.name === "Morpho")!;
  const aave = protocols.find(p => p.name === "Aave")!;
  battles.push({ protocol1: morpho, protocol2: aave });
  usedCombinations.add(getBattleKey(morpho, aave));

  // Generate 8 more unique random battles
  let attempts = 0;
  const maxAttempts = 100;

  while (battles.length < 9 && attempts < maxAttempts) {
    const protocol1 = protocols[Math.floor(Math.random() * protocols.length)];
    const protocol2 = protocols[Math.floor(Math.random() * protocols.length)];

    // Ensure different protocols and unique combination
    if (protocol1.name !== protocol2.name) {
      const battleKey = getBattleKey(protocol1, protocol2);
      if (!usedCombinations.has(battleKey)) {
        battles.push({ protocol1, protocol2 });
        usedCombinations.add(battleKey);
      }
    }

    attempts++;
  }

  return battles;
};

export default function Pots({ onBack }: PotsProps) {
  const battles = generateBattles();
  const [selectedBattle, setSelectedBattle] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBattleClick = (index: number) => {
    // Only allow clicking the first battle (Morpho vs Aave)
    if (index === 0) {
      setSelectedBattle(index);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    console.log("Battle submission:", {
      battle: battles[selectedBattle!],
      token: selectedToken,
      amount: amount,
    });

    // Simulate loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds and reset form
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedBattle(null);
      setSelectedToken("");
      setAmount("");
    }, 3000);
  };

  // If a battle is selected, show the detail view
  if (selectedBattle !== null) {
    const battle = battles[selectedBattle];
    return (
      <div className="w-full h-full flex flex-col items-center p-4 overflow-auto">
        <button
          onClick={() => setSelectedBattle(null)}
          className="text-white hover:text-red-300 mb-4 text-lg self-start"
        >
          ← Back to battles
        </button>

        <h1 className="text-red-900 text-2xl font-bold mb-4">
          {battle.protocol1.name} vs {battle.protocol2.name}
        </h1>

        <div className="w-full max-w-md bg-gray-900/50 rounded-lg p-6 border border-red-900/30">
          {/* Protocol Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              <img
                src={battle.protocol1.icon}
                alt={battle.protocol1.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pot.avif';
                }}
              />
            </div>
            <span className="text-red-400 text-xl font-bold">VS</span>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              <img
                src={battle.protocol2.icon}
                alt={battle.protocol2.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pot.avif';
                }}
              />
            </div>
          </div>

          {/* Token Selection */}
          <div className="space-y-4">
            {showSuccess ? (
              <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-6 text-center">
                <div className="text-green-400 text-5xl mb-3">✓</div>
                <p className="text-green-300 text-xl font-semibold mb-1">Success!</p>
                <p className="text-green-200/80 text-sm">
                  Your submission has been processed
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-white text-sm mb-2 block">Select Token</label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Choose a token...</option>
                    <option value="0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE">1INCH</option>
                    <option value="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913">USDC</option>
                    <option value="native">ETH</option>
                    <option value="0xd403D1624DAEF243FbcBd4A80d8A6F36afFe32b2">CHAINLINK</option>
                  </select>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="text-white text-sm mb-2 block">Amount</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    disabled={isLoading}
                    className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedToken || !amount || isLoading}
                  className={`w-full font-semibold py-3 px-4 rounded transition-colors ${
                    selectedToken && amount && !isLoading
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default view: show battle grid
  return (
    <div className="w-full h-full flex flex-col items-center p-4 overflow-auto">
      <button
        onClick={onBack}
        className="text-white hover:text-red-300 mb-4 text-lg self-start"
      >
        ← Back
      </button>

      <h1 className="text-red-900 text-2xl font-bold mb-4">Join the horde</h1>

      <div className="w-full px-4 h-full">
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto h-full">
          {battles.map((battle, index) => (
            <div
              key={index}
              onClick={() => handleBattleClick(index)}
              className={`bg-gray-900/50 border border-red-900/30 rounded-lg p-3 flex flex-col items-center justify-center hover:border-red-500/50 transition-colors ${
                index === 0 ? "cursor-pointer" : "cursor-default opacity-60"
              }`}
              style={{ aspectRatio: '1/1' }}
            >
              <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                {/* Protocol 1 Icon */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={battle.protocol1.icon}
                    alt={battle.protocol1.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/pot.avif';
                    }}
                  />
                </div>

                {/* VS Text */}
                <span className="text-red-400 text-xs font-bold leading-none">VS</span>

                {/* Protocol 2 Icon */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={battle.protocol2.icon}
                    alt={battle.protocol2.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/pot.avif';
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
