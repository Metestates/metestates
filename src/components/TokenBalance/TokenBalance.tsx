import React, { FC } from 'react';

import './TokenBalance.css';

import { formatUnits } from '@ethersproject/units'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import useTokenBalance from '../../hooks/use-token-balance'

// See: https://etherscan.io/token/0x0f5d2fb29fb7d3cfee444a200298f468908cc942
const ManaErc20TokenAddress = `0x0f5d2fb29fb7d3cfee444a200298f468908cc942`
const ManaErc20TokenDigits = 18


type TokenBalanceProps = {
	address: string,
}

const TokenBalance: FC<TokenBalanceProps> = ({ address }) => {

	const [
		tokenBalance,
		tokenBalanceError,
		tokenBalanceLoading,
	] = useTokenBalance(ManaErc20TokenAddress, address)

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

	let formattedTokenBalance = formatUnits(tokenBalance!, ManaErc20TokenDigits)

	return (
		<div>
			{
				address &&
				<>
					<p>Address: {address}</p>
					<Jazzicon diameter={48} seed={jsNumberForAddress(address)} />
				</>
			}
			{
				tokenBalance &&
				<p>Balance: {formattedTokenBalance} MANA</p>
			}
		</div>
	)

}

export default TokenBalance;
