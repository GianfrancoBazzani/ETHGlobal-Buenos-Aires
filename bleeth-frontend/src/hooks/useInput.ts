import { useState } from "react";
import { parseUnits, type Address } from "viem";
import useTokenBalance from "./useTokenBalance";

const useInput = (
    initialValue: string | (() => string),
    inputTokenAddress?: Address,
) => {
    const [value, setValue] = useState<string>(initialValue);
    const [maxBalanceExceeded, setMaxBalanceExceeded] = useState(false);
    const [valueBN, setValueBN] = useState<bigint>(BigInt(0));

    const tokenBalance = useTokenBalance(inputTokenAddress);

    // validations
    const inputRegex = /^\d*\.?\d*$/;

    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input.startsWith("0") && !input.startsWith("0.")) {
            setValue("");

            return;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setMaxBalanceExceeded(false);
        if (!inputRegex.test(input)) return;

        if (Number(input) > Number(tokenBalance.tokenFormatedBalance)) {
            setMaxBalanceExceeded(true);
        }
        setValue(input);
    };

    const handlePercentage = (percentage: number): void => {
        setMaxBalanceExceeded(false);
        if (percentage === 100) {
            setValue(tokenBalance.tokenFormatedBalance);
            setValueBN(tokenBalance.tokenBalance);
            return;
        }

        const percentageBalance: string = (
            (Number.parseFloat(tokenBalance.tokenFormatedBalance) * percentage) /
            100
        ).toString();
        setValue(percentageBalance);
    };

    return {
        value,
        valueBN: valueBN === BigInt(0) ? parseUnits(value ?? "0", tokenBalance?.tokenDecimals) : valueBN,
        onChange: handleChange,
        onFocus: handleFocus,
        maxBalanceExceeded,
        maxBalance: tokenBalance?.tokenFormatedBalance,
        percentageInput: handlePercentage,
    };
};

export default useInput;
