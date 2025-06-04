import React, { useEffect, useState } from "react";
import Text from "./ui/text";
import { ERC20ABI as abi } from "@/abi/ERC20ABI";
import { ethers } from "ethers";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

export default function ReadERC20({ addressContract, currentAccount }) {
  //TODO,获取token info

  return (
    <div className="space-y-4">
      {/* space-y-2 是 Tailwind CSS 的一个实用类，用于在子元素之间添加垂直间距 */}
      {/* 它会在每个子元素的顶部添加 margin-top，除了第一个子元素 */}
      <div className="flex flex-col space-y-2">
        <Text className="w-full">ERC20 Contract: {addressContract}</Text>
        <Text className="w-full">token totalSupply:</Text>
        <Text className="w-full my-1">ClassToken in current account:</Text>
      </div>
    </div>
  );
}
