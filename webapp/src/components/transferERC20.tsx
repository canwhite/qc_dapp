import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [circuitBreakerOpen, setCircuitBreakerOpen] = useState(false);

  useEffect(() => {
    if (errorCount > 3) {
      setCircuitBreakerOpen(true);
      const timer = setTimeout(() => {
        setCircuitBreakerOpen(false);
        setErrorCount(0);
      }, 30000); // 30秒后自动恢复
      return () => clearTimeout(timer);
    }
  }, [errorCount]);

  const handleTransfer = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("用户输入转账地址:", toAddress);

    if (
      !window.ethereum ||
      !ethers.isAddress(toAddress) ||
      circuitBreakerOpen
    ) {
      if (circuitBreakerOpen) {
        toast.error("系统繁忙，请30秒后再试");
      }
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(addressContract, abi, signer);
      console.log("实际合约调用参数:", {
        toAddress,
        amount: ethers.parseEther(amount).toString(),
      });
      const tx = await erc20.transfer(toAddress, ethers.parseEther(amount));
      const receipt = await tx.wait();
      toast.success(`转账成功！txHash: ${receipt.hash}`);
      setErrorCount(0);
    } catch (err: any) {
      const newErrorCount = errorCount + 1;
      setErrorCount(newErrorCount);
      toast.error(`转账失败(${newErrorCount}/3): ${err.message}`);
    } finally {
      setLoading(false);
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

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium">合约地址:</span>
          <span className="text-sm break-all">{addressContract}</span>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="toaddress" className="text-sm font-medium">
            接收地址:
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
      </div>

      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

      <button
        type="submit"
        disabled={!currentAccount || loading || circuitBreakerOpen}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex justify-center items-center"
      >
        {loading ? (
          <span className="animate-spin">↻</span>
        ) : circuitBreakerOpen ? (
          "系统维护中(30s)"
        ) : (
          "transfer"
        )}
      </button>
      {circuitBreakerOpen && (
        <p className="text-red-500 text-sm mt-2">
          系统暂时不可用，请30秒后再试
        </p>
      )}
    </form>
  );
}
