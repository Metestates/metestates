import React, { FC } from 'react';

import { formatUnits } from '@ethersproject/units'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import ITokenMetadata from '../../types/token';

import useTokenBalance from '../../hooks/use-token-balance'

import { shortenAddress } from '../../utils/address';

import styles from './TokenBalance.module.scss'

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
		<div className={styles.TokenBalance}>
			<div className={styles.TokenBalanceWrapper}>
				<div className={styles.TokenBalanceLeft}>
					<div className={styles.TokenBalanceJazziconWrapper}>
						<Jazzicon diameter={40} seed={jsNumberForAddress(address)} />
					</div>
				</div>
				<div className={styles.TokenBalanceRight}>
					<span className={styles.TokenBalanceSpan}>{shortenAddress(address)}</span>
					{
						balance &&
						<span className={styles.TokenBalanceSpan}>{formattedTokenBalance} {token.symbol}</span>
					}
				</div>
			</div>
		</div>
	)

}

export default TokenBalance;
