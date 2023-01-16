import Router from "next/router";
import { delay, genRanHex, getRandomInt } from "./MiscTools";
import { isDocked } from "./WindowMethods";
import { ethers } from "ethers";

const Web3 = require("web3");
let web3: any;
if (isDocked()) {
  web3 = new Web3(window.ethereum);
}

declare var window: any;

export const GetAddress = () => {
  if (isDocked()) {
    return window.ethereum.selectedAddress;
  }
};

export const AbreviateAddress = () => {
  try {
    const address = GetAddress();
    return (
      address[0] +
      address[1] +
      address[2] +
      address[3] +
      "..." +
      address[address.length - 4] +
      address[address.length - 3] +
      address[address.length - 2] +
      address[address.length - 1]
    );
  } catch (e) {}
};

export const MetaMaskConnect = async () => {
  if (isDocked()) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
};

export const WalletListener = async () => {
  if (isDocked()) {
    while (true) {
      await delay(1000);
      if (GetAddress() === null) {
        await Router.push("http://app.localhost:3000/login");
        await window.location.reload();
      }
    }
  }
};

export const GetSignature = async (data: string) => {
  return await web3.eth.personal.sign(data, GetAddress());
};
