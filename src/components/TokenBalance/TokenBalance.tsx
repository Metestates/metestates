import React, { FC } from 'react';

import './TokenBalance.css';

import { formatUnits } from '@ethersproject/units'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import ITokenMetadata from '../../types/token';

import useTokenBalance from '../../hooks/use-token-balance'

import { shortenAddress } from '../../utils/address';

import './TokenBalance.css'

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
		<div className='TokenBalance'>
			<div className="wrapper">
				<div className='left'>
					<Jazzicon diameter={40} seed={jsNumberForAddress(address)} />
				</div>
				<div className='right'>
					<span>{shortenAddress(address)}</span>
					{
						balance &&
						<span>{formattedTokenBalance} {token.symbol}</span>
					}
				</div>
			</div>
		</div>
	)

}

export default TokenBalance;
