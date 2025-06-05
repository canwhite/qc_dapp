import React, { useEffect, useState } from "react";
import Text from "./ui/text";
import { ERC20ABI as abi } from "@/abi/ERC20ABI";
import { ethers } from "ethers";
import { toast } from "sonner";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

declare let window: any;

export default function ReadERC20({ addressContract, currentAccount }: Props) {
  const [totalSupply, setTotalSupply] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const queryTokenBalance = async () => {
    if (!window.ethereum || !ethers.isAddress(currentAccount)) {
      toast.error("Invalid account or MetaMask not connected");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const erc20 = new ethers.Contract(addressContract, abi, provider);
      const balance = await erc20.balanceOf(currentAccount);
      const formattedBalance = ethers.formatEther(balance);
      console.log("Balance updated:", formattedBalance);
      setBalance(formattedBalance);
    } catch (err) {
      toast.error(`Failed to get balance: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!window.ethereum || !ethers.isAddress(addressContract)) {
      toast.error("Invalid contract address or MetaMask not connected");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);

    // Fetch symbol and totalSupply
    erc20
      .symbol()
      .then((symbol: string) => setSymbol(symbol))
      .catch((err: any) => toast.error(`Failed to get symbol: ${err.message}`));

    erc20
      .totalSupply()
      .then((totalSupply: string) =>
        setTotalSupply(ethers.formatEther(totalSupply))
      )
      .catch((err: any) =>
        toast.error(`Failed to get totalSupply: ${err.message}`)
      );

    // Fetch initial balance
    queryTokenBalance();
  }, [addressContract]);

  useEffect(() => {
    if (
      !window.ethereum ||
      !currentAccount ||
      !ethers.isAddress(addressContract)
    )
      return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);

    console.log(`Listening for Transfer events on ${addressContract}...`);

    const transferHandler = (
      from: string,
      to: string,
      amount: bigint,
      event: any
    ) => {
      console.log("Transfer event:", {
        from,
        to,
        amount: ethers.formatEther(amount),
        event,
      });
      if (
        from.toLowerCase() === currentAccount?.toLowerCase() ||
        to.toLowerCase() === currentAccount?.toLowerCase()
      ) {
        console.log(
          `Transfer ${from === currentAccount ? "sent" : "received"}`,
          {
            from,
            to,
            amount: ethers.formatEther(amount),
          }
        );
        queryTokenBalance();
      }
    };

    erc20.on("Transfer", transferHandler);

    return () => {
      console.log("Cleaning up Transfer listener");
      erc20.off("Transfer", transferHandler);
    };
  }, [currentAccount]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Text className="w-full">ERC20 Contract: {addressContract}</Text>
        <Text className="w-full">
          Token Total Supply: {totalSupply} {symbol}
        </Text>
        <Text className="w-full my-1">
          ClassToken in Current Account: {balance} {symbol}
        </Text>
      </div>
    </div>
  );
}
