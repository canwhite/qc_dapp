import React, { useEffect, useState } from "react";
import Text from "./ui/text";
import { ERC20ABI as abi } from "@/abi/ERC20ABI";
import { ethers } from "ethers";
import useEvent from "@/hooks/useEvent";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

declare let window: any;

export default function ReadERC20({ addressContract, currentAccount }) {
  const [totalSupply, setTotalSupply] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!window.ethereum) {
      setError("Ethereum provider not found");
      return;
    }

    if (!ethers.isAddress(addressContract)) {
      setError("Invalid contract address");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);

    erc20
      .symbol()
      .then((symbol: string) => setSymbol(symbol))
      .catch((err: any) => setError(`Failed to get symbol: ${err.message}`));

    erc20
      .totalSupply()
      .then((totalSupply: string) =>
        setTotalSupply(ethers.formatEther(totalSupply))
      )
      .catch((err: any) =>
        setError(`Failed to get totalSupply: ${err.message}`)
      );
  }, [addressContract]);

  const queryTokenBalance = useEvent(async (window: any) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);
    erc20
      .balanceOf(currentAccount)
      .then((balance: string) => {
        setBalance(ethers.formatEther(balance));
      })
      .catch((err: any) =>
        setError(`Failed to get totalSupply: ${err.message}`)
      );
  });

  useEffect(() => {
    if (!window.ethereum || !currentAccount) return;

    queryTokenBalance(window);
  }, [currentAccount]);

  return (
    <div className="space-y-4">
      {/* space-y-2 是 Tailwind CSS 的一个实用类，用于在子元素之间添加垂直间距 */}
      {/* 它会在每个子元素的顶部添加 margin-top，除了第一个子元素 */}
      <div className="flex flex-col space-y-2">
        <Text className="w-full">ERC20 Contract: {addressContract}</Text>
        <Text className="w-full">
          token totalSupply:{totalSupply} {symbol}
        </Text>
        <Text className="w-full my-1">
          ClassToken in current account:{balance} {symbol}
        </Text>
      </div>
    </div>
  );
}
