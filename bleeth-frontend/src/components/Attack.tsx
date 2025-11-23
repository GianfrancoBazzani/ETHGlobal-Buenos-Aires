"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { type Address } from "viem";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useInput from "../hooks/useInput";

interface AttackProps {
  onBack: () => void;
}

export default function Attack({ onBack }: AttackProps) {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedAttacker, setSelectedAttacker] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [lockPeriod, setLockPeriod] = useState("");
  const [penalizationCoefficient, setPenalizationCoefficient] = useState("");
  const [auctionDuration, setAuctionDuration] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const amountInput = useInput("", selectedToken as Address);

  const stepTimestamps = [0, 1, 2, 3, 9];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const nextStepTime = stepTimestamps[currentStep];

      if (currentTime >= nextStepTime && !video.paused) {
        video.pause();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.currentTime = stepTimestamps[currentStep - 1];
    video.play();

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Attack submitted:", {
      target: selectedTarget,
      attacker: selectedAttacker,
      token: selectedToken,
      amount: amountInput.value,
      lockPeriod,
      penalizationCoefficient,
      auctionDuration,
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTarget && selectedAttacker;
      case 2:
        return isConnected && selectedToken && amountInput.valueBN !== BigInt(0) && !amountInput.maxBalanceExceeded;
      case 3:
        return lockPeriod && penalizationCoefficient && auctionDuration;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div id="attack-container" className="w-full h-full flex flex-col items-center p-4 overflow-auto">
      <button
        onClick={onBack}
        className="text-white hover:text-red-300 mb-4 text-lg self-start"
      >
        ← Back
      </button>

      <div className="w-full max-w-md mb-4">
        <video
          ref={videoRef}
          className="w-full rounded-lg max-h-[300px]"
          muted
          playsInline
        >
          <source src="/attack.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-full max-w-md bg-gray-900/50 rounded-lg p-6 border border-red-900/30">
        

        <div className="mb-4">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? "bg-red-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-4">Select Target & Attacker</h3>

            <div>
              <label className="text-white text-sm mb-2 block">Select Target</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="">Choose a Victim...</option>
                <option value="target1">Morpho</option>
                <option value="target2">Aave</option>
                <option value="target3">Uniswap v3</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Select Attacker</label>
              <select
                value={selectedAttacker}
                onChange={(e) => setSelectedAttacker(e.target.value)}
                className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="">Choose an attacker...</option>
                <option value="attacker1">Aave</option>
                <option value="attacker2">Bleeth</option>
                <option value="attacker3">Uniswap v3</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {!isConnected ? (
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-4 text-center">
                <p className="text-yellow-300 font-semibold mb-2">Wallet Not Connected</p>
                <p className="text-yellow-200/80 text-sm">
                  Please connect your wallet to select a token and continue.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-white text-sm mb-2 block">Select Token</label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                  >
                    <option value="">Choose a token...</option>
                    <option value="0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE">1INCH</option>
                    <option value="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913">USDC</option>
                    <option value="native">ETH</option>
                    <option value="0xd403D1624DAEF243FbcBd4A80d8A6F36afFe32b2">CHAINLINK</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white text-sm">Amount</label>
                    <span className="text-gray-400 text-xs">
                      Balance: {amountInput.maxBalance}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={amountInput.value}
                    onChange={amountInput.onChange}
                    onFocus={amountInput.onFocus}
                    placeholder="0.0"
                    className={`w-full bg-gray-800 text-white border rounded px-3 py-2 focus:outline-none ${
                      amountInput.maxBalanceExceeded
                        ? "border-red-500 focus:border-red-600"
                        : "border-red-900/30 focus:border-red-500"
                    }`}
                  />
                  {amountInput.maxBalanceExceeded && (
                    <p className="text-red-400 text-xs mt-1">
                      Insufficient balance
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => amountInput.percentageInput(25)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      onClick={() => amountInput.percentageInput(50)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => amountInput.percentageInput(75)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={() => amountInput.percentageInput(100)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-4">Attack Parameters</h3>

            <div>
              <label className="text-white text-sm mb-2 block">Lock Period</label>
              <input
                type="number"
                value={lockPeriod}
                onChange={(e) => setLockPeriod(e.target.value)}
                placeholder="0"
                step="1"
                min="0"
                className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Penalization Coefficient</label>
              <input
                type="number"
                value={penalizationCoefficient}
                onChange={(e) => setPenalizationCoefficient(e.target.value)}
                placeholder="0.0"
                step="0.01"
                min="0"
                className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Auction Duration</label>
              <input
                type="number"
                value={auctionDuration}
                onChange={(e) => setAuctionDuration(e.target.value)}
                placeholder="0"
                step="1"
                min="0"
                className="w-full bg-gray-800 text-white border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">

            <div className="bg-gray-800/50 p-4 rounded border border-red-900/20">
              <h4 className="text-red-300 font-semibold mb-2">Attack Summary</h4>
              <div className="space-y-2 text-white text-sm">
                <p><span className="text-gray-400">Target:</span> {selectedTarget}</p>
                <p><span className="text-gray-400">Attacker:</span> {selectedAttacker}</p>
                <p><span className="text-gray-400">Token:</span> {selectedToken}</p>
                <p><span className="text-gray-400">Amount:</span> {amountInput.value}</p>
                <p><span className="text-gray-400">Lock Period:</span> {lockPeriod}</p>
                <p><span className="text-gray-400">Penalization Coefficient:</span> {penalizationCoefficient}</p>
                <p><span className="text-gray-400">Auction Duration:</span> {auctionDuration}</p>
              </div>
            </div>

            <p className="text-white text-sm text-center mt-4">
              Review the details above and sign the contract to proceed with the attack.
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {currentStep === 2 && !isConnected ? (
            <ConnectButton />
          ) : (
            <>
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex-1 font-semibold py-2 px-4 rounded transition-colors ${
                    canProceed()
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Sign Contract
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

