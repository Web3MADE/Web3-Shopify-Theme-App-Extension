//TODO: on save - execute "webpack-bundle-connect-button" script
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

let provider;
const CONNECTED = "Connected";
const button = document.querySelector("#connect-wallet-button");
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

function setListeners() {
  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("accounts Changed: ", accounts);
    console.log(accounts);
    if (accounts.length === 0) {
      localStorage.setItem("address", null);
      button.textContent = defaultText;
    }
  });
}

/* invoke this function to prompt user and connect wallet */
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

// TODO: remove all listener when DOM is destroyed - onunload can interfere with user experience?
// https://gtmetrix.com/avoid-unload-event-listeners.html
window.addEventListener("DOMContentLoaded", async (event) => {
  event.preventDefault();
  setListeners();

  const stored = localStorage.getItem("fullAddr").toLocaleLowerCase();

  // should only execute if user is currently connected to site
  if (window.ethereum && stored) {
    console.log("line 157");
    button.textContent = CONNECTED;
    console.log("line 159 after: ", button.textContent);
  }
});
