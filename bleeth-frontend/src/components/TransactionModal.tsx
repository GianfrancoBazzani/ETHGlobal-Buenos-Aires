"use client";

import { useState } from "react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "idle" | "pending" | "success" | "error";
  txHash?: string;
  errorMessage?: string;
}

export default function TransactionModal({
  isOpen,
  onClose,
  status,
  txHash,
  errorMessage,
}: TransactionModalProps) {
  const [showMockup, setShowMockup] = useState(false);

  if (!isOpen) return null;

  const getBaseScanUrl = (hash: string) => {
    return `https://basescan.org/tx/${hash}`;
  };

  // Example transaction hash for mockup
  const mockTxHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-red-900/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Status Icon and Message */}
        <div className="flex flex-col items-center mb-6">
          {status === "pending" && (
            <>
              <div className="w-16 h-16 mb-4 relative">
                <div className="absolute inset-0 border-4 border-red-200/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Confirming Transaction
              </h3>
              <p className="text-gray-400 text-sm text-center">
                Please confirm the transaction in your wallet
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Transaction Successful!
              </h3>
              <p className="text-gray-400 text-sm text-center mb-4">
                Your transaction has been confirmed on the blockchain
              </p>

              {txHash && (
                <div className="w-full bg-gray-800 rounded p-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">Transaction Hash:</p>
                  <p className="text-white text-xs font-mono break-all">
                    {txHash}
                  </p>
                </div>
              )}

              {txHash && (
                <a
                  href={getBaseScanUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  View on BaseScan
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </>
          )}

          {status === "error" && !showMockup && (
            <>
              <div className="w-16 h-16 mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Transaction Failed
              </h3>
              <p className="text-gray-400 text-sm text-center mb-4">
                {errorMessage || "The transaction was rejected or failed"}
              </p>
            </>
          )}

          {status === "error" && showMockup && (
            <>
              <div className="w-16 h-16 mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1 mb-2">
                <p className="text-blue-400 text-xs font-semibold">MOCKUP EXAMPLE</p>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Transaction Successful!
              </h3>
              <p className="text-gray-400 text-sm text-center mb-4">
                Your transaction has been confirmed on the blockchain
              </p>

              <div className="w-full bg-gray-800 rounded p-3 mb-4">
                <p className="text-gray-400 text-xs mb-1">Transaction Hash:</p>
                <p className="text-white text-xs font-mono break-all">
                  {mockTxHash}
                </p>
              </div>

              <a
                href={getBaseScanUrl(mockTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors mb-4"
              >
                View on BaseScan
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>

              <p className="text-gray-500 text-xs text-center italic">
                This is a preview of what a successful transaction would look like
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {status !== "pending" && (
          <div className="space-y-2">
            {status === "error" && (
              <button
                onClick={() => setShowMockup(!showMockup)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                {showMockup ? "Show Error" : "View Success Example"}
              </button>
            )}
            <button
              onClick={() => {
                setShowMockup(false);
                onClose();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
