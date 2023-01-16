import { getRandomInt } from "./MiscTools";
import { GetAddress, GetSignature } from "./Web3Tools";
import { isDocked } from "./WindowMethods";

declare var window: any;
const Web3 = require("web3");
const axios = require("axios");
let web3: any;
if (isDocked()) {
  web3 = new Web3(window.ethereum);
}

export const AccountCreation = async (data: any) => {
  const nonce = getRandomInt(100000000000).toString();
  const formData = new FormData();
  formData.append("avatar", data.image);
  formData.append("username", data.username);
  formData.append("address", GetAddress());
  formData.append("avatar", data.image);
  formData.append("signature", await GetSignature(nonce));
  formData.append("message", nonce);
  await axios.post("http://localhost:8000/create-account", formData);
};
