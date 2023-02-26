import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

let provider;
const CONNECTED = "Connected";
const button = document.getElementById("connect-wallet-button");
button.addEventListener("click", connectWallet);
async function getWeb3Modal() {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // for live prod: process.env.INFURA_ID
          infuraId: process.env.INFURA_ID,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "APP NAME",
          infuraId: process.env.INFURA_ID,
        },
      },
    },
  });
  return web3Modal;
}

async function connectWallet() {
  const web3Modal = await getWeb3Modal();
  const connection = await web3Modal.connect();
  provider = new Web3Provider(connection);

  const accounts = await provider.listAccounts();

  if (accounts[0]) {
    button.textContent = CONNECTED;
    localStorage.setItem("fullAddr", accounts[0]);
  }

  if (accounts.length === 0) return;
}

Window.addEventListener("DOMContentLoaded", async (event) => {
  event.preventDefault();

  const stored = localStorage.getItem("fullAddr");

  if (window.ethereum && stored) {
    button.textContent = CONNECTED;
  }
});
