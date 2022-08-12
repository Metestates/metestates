import React from 'react'

import {
	ChainId,
	Config,
	DAppProvider,
	ERC20Interface,
	useCall,
	useEthers,
	useNotifications,
} from '@usedapp/core'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { formatUnits } from '@ethersproject/units'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

// See: https://etherscan.io/token/0x0f5d2fb29fb7d3cfee444a200298f468908cc942
const ManaErc20TokenAddress = `0x0f5d2fb29fb7d3cfee444a200298f468908cc942`

const config: Config = {
	readOnlyChainId: ChainId.Mainnet,
	readOnlyUrls: {
		[ChainId.Mainnet]: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
	},
}

type UseTokenBalanceHookResult = [
	BigNumber|undefined,
	Error|undefined,
	boolean,
]

const useTokenBalance = (
	tokenAddress: string,
	address?: string): UseTokenBalanceHookResult =>
{

	let result;

	result = useCall(
		address &&
		{
			contract: new Contract(tokenAddress, ERC20Interface),
			method: 'balanceOf',
			args: [address],
		}
	)

	if(!address)
	{
		return [undefined, undefined, true]
	}

	if(!result)
	{
		return [undefined, undefined, false]
	}

	let { value, error } = result

	if(error) {
		return [undefined, error, false]
	}

	const { balance } = value

	return [balance, undefined, false]

}

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
	<DAppProvider config={config}>
		<TokenBalance />
	</DAppProvider>
)

export default ConnectToWalletButton
