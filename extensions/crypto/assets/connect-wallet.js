//TODO: on save - execute "webpack-bundle-connect-button" script
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

let provider;
const CONNECTED = "Connected";

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

/* invoke this function to prompt user and connect wallet */
async function connectWallet() {
  // store btnText to re-assign when wallet disconnects
  console.log("connect wallet CLICKED");
  const web3Modal = await getWeb3Modal();
  const connection = await web3Modal.connect();
  provider = new Web3Provider(connection);

  const accounts = await provider.listAccounts();
  // TODO:
  // ETH address = 42 hexadecimal length - need to check network is EVM
  // SOL can be 32 to 44 char length
  if (accounts[0]) {
    const currentAddress = trimAddress(accounts[0]);
    console.log("currentAddress: ", currentAddress);
    console.log("accounts: ", accounts);
    button.textContent = CONNECTED;
    localStorage.setItem("address", button.textContent);
    localStorage.setItem("fullAddr", accounts[0]);

    console.log({ accounts });
  }
  if (accounts.length === 0) return;
}

// There is not a way to disconnect via button click - only user can do from wallet
async function disconnectCBWallet() {}

function trimAddress(address) {
  return address.substring(0, 5) + "..." + address.substring(38, 42);
}

function setListeners() {
  const defaultText = button.textContent;

  window.ethereum.on("disconnect", (error) => {
    // For handling network issues or unforseen errors
    console.log("disconnected: ", error);
  });
  window.ethereum.on("chainChanged", (id) => {
    // TODO: prompt wallet to switch to chain of the campaign
    console.log("chain changed: ", id);
  });
  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("accounts Changed: ", accounts);
    if (accounts.length === 0) {
      localStorage.setItem("address", null);
      button.textContent = defaultText;
    }
  });
}

const button = document.querySelector("#connect-wallet-button");
button.addEventListener("click", connectWallet);
// TODO: remove all listener when DOM is destroyed - onunload can interfere with user experience?
// https://gtmetrix.com/avoid-unload-event-listeners.html
window.addEventListener("DOMContentLoaded", async (event) => {
  event.preventDefault();
  setListeners();

  const stored = localStorage.getItem("fullAddr").toLocaleLowerCase();
  // const btnText = localStorage.getItem("address");
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // should only execute if user is currently connected to site
  if (window.ethereum && stored !== null && accounts[0] === stored) {
    console.log("line 157");
    button.textContent = CONNECTED;
    console.log("line 159 after: ", button.textContent);
  }
});
