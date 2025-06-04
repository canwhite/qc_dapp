import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import useEvent from "@/hooks/useEvent";

declare let window: any;

const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chainname, setChainName] = useState<string | undefined>();
  useEffect(() => {
    if (
      !currentAccount ||
      !ethers.isAddress(currentAccount) ||
      !window.ethereum
    )
      return;

    // new Provider by metamask
    const provider = new ethers.BrowserProvider(window.ethereum);

    // get balance
    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result));
    });

    // get chainId and chainName
    provider.getNetwork().then((result) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
  }, [currentAccount]);

  const onClickConnect = useEvent(() => {
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }
    // request account access by provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.send("eth_requestAccounts", []).then((result) => {
      setCurrentAccount(result[0]);
    });
  });

  const onClickDisconnect = useEvent(() => {
    console.log("onClickDisConnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
    setChainId(undefined);
    setChainName(undefined);
  });

  return (
    <div className="flex flex-col items-center  w-full h-full">
      <Head>
        <title>My DAPP</title>
      </Head>

      <h3 className="text-2xl font-bold my-4">Explore Web3</h3>

      <div className="flex flex-col space-y-4 w-full">
        {/* TASK 1: connect to local chain according to metamask,and get the account and balance */}

        {currentAccount ? (
          <Button
            className="w-full bg-gray-100 rounded-[4px]"
            onClick={onClickDisconnect}
          >
            Account:{currentAccount}
          </Button>
        ) : (
          <Button
            className="w-full bg-gray-100 rounded-[4px]"
            onClick={onClickConnect}
          >
            Connect MetaMask
          </Button>
        )}

        <div className="my-4 p-4 w-full border border-gray-200 rounded-lg">
          <h4 className="text-xl font-bold my-4">Task 1</h4>
          <p>local chain with hardhat</p>
        </div>

        <div className="my-4 p-4 w-full border border-gray-200 rounded-lg">
          <h4 className="text-xl font-bold my-4">Task 2</h4>
          <p>DAPP with React/NextJS/Tailwind</p>
        </div>

        <div className="my-4 p-4 w-full border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Link
            href="https://github.com/NoahZinsmeister/web3-react/tree/v6"
            passHref
          >
            <h4 className="text-xl font-bold my-4">Task 3 with link</h4>
            <p>Read docs of Web3-React V6</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
