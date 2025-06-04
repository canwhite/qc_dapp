import { expect } from "chai";
import { ethers } from "hardhat";

describe("ClassToken", function () {
  // it 是 Mocha 测试框架中的一个测试用例定义函数
  // 通常包含以下部分：
  // 1. 描述字符串：说明测试的具体内容
  // 2. 异步函数：包含实际的测试逻辑

  it("Should have the correct initial supply", async function () {
    const initialSupply = ethers.parseEther("10000.0"); //convert to wei
    const ClassToken = await ethers.getContractFactory("ClassToken");
    const token = await ClassToken.deploy(initialSupply);
    await token.deployed();

    expect(await token.totalSupply()).to.equal(initialSupply);
  });
});
