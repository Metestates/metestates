import React, { FC } from 'react'

import {
	useEthers,
	useNotifications,
} from '@usedapp/core'

import { Button } from '@chakra-ui/react'

import styles from './ConnectToWalletButton.module.scss'

type ConnectToWalletButtonProps = {}

const ConnectToWalletButton: FC<ConnectToWalletButtonProps> = () => {

	const { activateBrowserWallet } = useEthers()

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
		<Button className={styles.ConnectToWalletButton}
			colorScheme='green'
			onClick={connectWallet}>
			Connect Wallet
		</Button>
	)

}

export default ConnectToWalletButton
