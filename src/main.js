// Loads nearlib and this contract into window scope.
import "babel-polyfill";
import Alchemy from "./frontend/corgi.jsx";
import React from "react";
import ReactDOM from "react-dom";
import "./frontend/corgi.css";
import "./config.js"

export class AppConfig {
  constructor(ops) {
    const {
      contract,
      wallet,
      accountId
    } = ops;
    this.contract = contract;
    this.wallet = wallet;
    this.accountId = accountId;
  }
}

async function doInitContract() {
  // window.near = await nearlib.dev.connect(nearConfig);

  nearConfig.nodeUrl = 'https://studio.nearprotocol.com/devnet';
  nearConfig.helperUrl = 'https://studio.nearprotocol.com/contract-api';
  const walletBaseUrl = 'https://wallet.nearprotocol.com';

  
  const _wallet = new nearlib.WalletAccount(nearConfig.contractName, walletBaseUrl);
  // Getting the Account ID. If unauthorized yet, it's just empty string.
  const _accountId = _wallet.getAccountId();
 
  // Initializing near and near client from the nearlib.
  window.near = new nearlib.Near(new nearlib.NearClient(
    _wallet,
    // We need to provide a connection to the blockchain node which we're going to use
    new nearlib.LocalNodeConnection(nearConfig.nodeUrl),
  ));

  const _contract = await window.near.loadContract(nearConfig.contractName, {
    viewMethods: [
      "getItem",
      "getItems",
      "listUserItems"],
    changeMethods: [
      "craft",
      "invent"],
    sender: _accountId
  });
  let appConfig = new AppConfig({contract:_contract, wallet:_wallet, accountId:_accountId});
  return appConfig;
}

function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time);
  });
}

window.nearInitPromise = doInitContract().then((config)=>{
  console.log(config);
  ReactDOM.render( <Alchemy contract={config.contract} wallet={config.wallet} /> ,
    document.getElementById('alchemy')
  );
}).catch(console.error)
