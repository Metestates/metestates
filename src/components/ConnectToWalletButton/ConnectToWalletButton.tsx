import React from 'react'

import {
	useEthers,
	useNotifications,
} from '@usedapp/core'

import TokenBalance from '../TokenBalance/TokenBalance'

const ConnectToWalletButton = () => {

	const { account: address, activateBrowserWallet } = useEthers()

	const { notifications } = useNotifications()

	const connectWallet = React.useCallback(
		() => {

			(activateBrowserWallet() as any).then(() => {
				console.log(`Connected to a new browser wallet…`)
			})

		},
		[activateBrowserWallet]
	)

	React.useEffect(
		() => {
			notifications.map(n => {
				switch(n.type) {
					case `walletConnected`:

						let addr = n.address

						console.log(`Connected to wallet with address ${addr}.`)

						break;

					default:

						console.log(n)

						break;
				}

			})
		},
		[notifications]
	)

	return (
		<div>

			{
				!address &&
				<button onClick={e => connectWallet()}>
					Connect Wallet
				</button>
			}

			{
				address &&
				<TokenBalance address={address} />
			}

		</div>
	)

}

export default ConnectToWalletButton
