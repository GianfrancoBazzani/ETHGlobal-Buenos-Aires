import { type Address, erc20Abi, formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";

const useTokenBalance = (inputTokenAddress?: Address) => {
    let formatedBalance = "0";
    let balance = BigInt(0);
    let decimals = 0;

    const account = useAccount();
    const tokenBalance = useReadContracts({
        allowFailure: false,
        contracts: [
            {
                address: inputTokenAddress,
                abi: erc20Abi,
                functionName: "decimals",
            },
            {
                address: inputTokenAddress,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [account?.address as Address],
            },
        ],
    });

    if (tokenBalance.data) {
        decimals = tokenBalance.data[0];
        balance = tokenBalance.data[1];
        formatedBalance = formatUnits(balance, decimals);
    }

    return {
        tokenBalance: balance,
        tokenDecimals: decimals,
        tokenFormatedBalance: formatedBalance,
    };
};

export default useTokenBalance;
