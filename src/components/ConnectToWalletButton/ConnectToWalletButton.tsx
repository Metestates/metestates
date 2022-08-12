import React from 'react'

import {
	useEthers,
	useNotifications,
} from '@usedapp/core'

import { formatUnits } from '@ethersproject/units'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import useTokenBalance from '../../hooks/use-token-balance'

// See: https://etherscan.io/token/0x0f5d2fb29fb7d3cfee444a200298f468908cc942
const ManaErc20TokenAddress = `0x0f5d2fb29fb7d3cfee444a200298f468908cc942`

const TokenBalance = () => {

	const [connectedAddress, setConnectedAddress] = React.useState<string|undefined>()

	const { activateBrowserWallet, error } = useEthers()

	const { notifications } = useNotifications()

	React.useEffect(
		() => {
			(activateBrowserWallet() as any).then(() => {
				console.log(`Connected to a new browser wallet…`)
			})
		},
		[]
	)

	React.useEffect(
		() => {
			notifications.map(n => {
				switch(n.type) {
					case `walletConnected`:

						let addr = n.address

						console.log(`Connected to wallet with address ${addr}.`)

						setConnectedAddress(addr)

						break;

					default:

						console.log(n)

						break;
				}

			})
		},
		[notifications]
	)

	const [
		tokenBalance,
		tokenBalanceError,
		tokenBalanceLoading,
	] = useTokenBalance(ManaErc20TokenAddress, connectedAddress)

	if(
		tokenBalanceLoading ||
		(
			!tokenBalance &&
			!tokenBalanceError
		)
	) {
		return (
			<div>
				<p>Loading…</p>
			</div>
		)
	}

	if(tokenBalanceError) {
		return (
			<div>
				<p>Error retreiving token balance: {tokenBalanceError}</p>
			</div>
		)
	}

	let formattedTokenBalance = formatUnits(tokenBalance!, 18)

	return (
		<div>
			{
				connectedAddress &&
				<>
					<p>Address: {connectedAddress}</p>
					<Jazzicon diameter={48} seed={jsNumberForAddress(connectedAddress)} />
				</>
			}
			{
				tokenBalance &&
				<p>Balance: {formattedTokenBalance} MANA</p>
			}
		</div>
	)

}

const ConnectToWalletButton = () => (
	<TokenBalance />
)

export default ConnectToWalletButton
