// Importing modules
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function ConnectToWallet() {

useEffect(()=>{
	if(window.ethereum){
		alert("ETHEREUM")
	}
	alert("PLEASE ATTACH METAMASK WALLET")
}, [])

// usetstate for storing and retrieving wallet details
const [data, setdata] = useState<WalletData>({ address: "", Balance: ""})

// Button handler button for handling a
// request event for metamask
const btnhandler = () => {

	// Asking if metamask is already present or not
	if (window.ethereum) {

	// res[0] for fetching a first wallet
	window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((res: any) => accountChangeHandler(res[0]));
	} else {
		alert("install metamask extension!!");
	}
};

// getbalance function for getting a balance in
// a right format with help of ethers
const getbalance = (address: any) => {
	// Requesting balance method
	window.ethereum
	.request({
		method: "eth_getBalance",
		params: [address, "latest"]
	})
	.then((balance: number) => {
		// Setting balance
		alert(balance)
		setdata({
			address: address,
			Balance: ethers.utils.formatEther(balance)
		});
	});
};

// Function for getting handling all events
const accountChangeHandler = (account: string) => {
	// Setting an address data
	setdata({
		address: account,
		Balance: ""
	});

	// Setting a balance
	getbalance(account);
};

return (
	<div className="App">
	{/* Calling all values which we
	have stored in usestate */}

	<div>
		<div>
		<strong>Address: </strong>
		{data.address}
		</div>
		<div>
		<div >
			<strong>Balance: </strong>
			{data.Balance}
		</div>
		<button onClick={btnhandler} >
			Connect to wallet
		</button>
		</div>
	</div>
	</div>
);
}

export default ConnectToWallet;