import axios from "axios";
import { GetAddress } from "../tools/Web3Tools";

export const BASE_ENDPOINT = "http://localhost:8000";

export const GetUser = async () => {
  return await axios.get(BASE_ENDPOINT + `/account/${GetAddress()}`);
};

export const GetAPI = async (directory: string) => {
  return await axios.get(BASE_ENDPOINT + directory);
};

export const GetItems = async (address: string) => {
  return await axios.get(BASE_ENDPOINT + `/account/${address}/items`);
};
