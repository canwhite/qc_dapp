import React, { useState } from "react";
import { ethers } from "ethers";
import { ERC20ABI as abi } from "@/abi/ERC20ABI";
import { toast } from "sonner";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

export default function TransferERC20({
  addressContract,
  currentAccount,
}: Props) {
  const [amount, setAmount] = useState("100");
  const [toAddress, setToAddress] = useState("");

  const handleTransfer = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!window.ethereum || !ethers.isAddress(toAddress)) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      //get signer from provider
      const signer = await provider.getSigner();
      //create contract instance with signer
      const erc20 = new ethers.Contract(addressContract, abi, signer);
      //transfer token with amount, parseEther convert amount to wei
      const tx = await erc20.transfer(toAddress, ethers.parseEther(amount));
      // wait for tx to be mined
      const receipt = await tx.wait();
      toast.success(`转账成功！txHash: ${receipt}`);
    } catch (err: any) {
      toast.error(`转账失败: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleTransfer} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          amount:
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="10"
          max="1000"
          className="p-2 border rounded-md"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="toaddress" className="text-sm font-medium">
          toAddress:
        </label>
        <input
          type="text"
          id="toaddress"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
      </div>

      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

      <button
        type="submit"
        disabled={!currentAccount}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        transfer
      </button>
    </form>
  );
}
