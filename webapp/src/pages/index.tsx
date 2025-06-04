import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center  w-full h-full">
      <Head>
        <title>My DAPP</title>
      </Head>

      <h3 className="text-2xl font-bold my-4">Explore Web3</h3>

      <div className="flex flex-col space-y-4 w-full">
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
