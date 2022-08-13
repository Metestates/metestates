import React, { FC } from 'react';

import './TokenBalance.css';

import { formatUnits } from '@ethersproject/units'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import ITokenMetadata from '../../types/token';

import useTokenBalance from '../../hooks/use-token-balance'

import { shortenAddress } from '../../utils/address';

type TokenBalanceProps = {
	token: ITokenMetadata,
	address: string,
}

const TokenBalance: FC<TokenBalanceProps> = ({ token, address }) => {

	const [balance, error, isLoading] = useTokenBalance(token.address, address)

	if(
		isLoading ||
		(
			!balance &&
			!error
		)
	) {
		return (
			<div>
				<p>Loading…</p>
			</div>
		)
	}

	if(error) {
		return (
			<div>
				<p>Error retreiving token balance: {error}</p>
			</div>
		)
	}

	let formattedTokenBalance = formatUnits(balance!, token.decimals)

	return (
		<div>

			<p>{shortenAddress(address)}</p>

			<Jazzicon diameter={48} seed={jsNumberForAddress(address)} />

			{
				balance &&
				<p>{formattedTokenBalance} {token.symbol}</p>
			}

		</div>
	)

}

export default TokenBalance;
