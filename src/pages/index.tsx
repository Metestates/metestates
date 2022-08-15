import React from 'react'

import type { NextPage } from 'next'

import { useEthers } from '@usedapp/core'

import Parcel from '../types/parcel'
import ITokenMetadata from '../types/token'

import AppConfig from '../config/app-config'

import useScreenDimensions from '../hooks/use-screen-dimensions'
import useMousewheelScalable from '../hooks/use-mousewheel-scalable'
import useControlledCoordinate from '../hooks/use-controlled-coordinate'

import TokenBalance from '../components/TokenBalance/TokenBalance'
import ConnectToWalletButton from '../components/ConnectToWalletButton/ConnectToWalletButton'
import CanvasParcelGrid from '../components/CanvasParcelGrid/CanvasParcelGrid'

// See: https://etherscan.io/token/0x0f5d2fb29fb7d3cfee444a200298f468908cc942
const MANA: ITokenMetadata = {
	name: 'Decentraland',
	symbol: 'MANA',
	address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
	decimals: 18,
}

// import styles from './index.module.scss'

const Index: NextPage = () => {

	const { account: address } = useEthers()

	const screenDimensions = useScreenDimensions()

	const parcelCellSize = useMousewheelScalable(AppConfig.ParcelPixelWidth, {
		delta: 1,
		minValue: AppConfig.ParcelPixelMinWidth,
		maxValue: AppConfig.ParcelPixelMaxWidth,
	})

	const origin = useControlledCoordinate(AppConfig.Origin)

	const [selectedParcel, setSelectedParcel] = React.useState<Parcel|null>(null)

	return (
		<>

			<header>
				{
					!address &&
					<ConnectToWalletButton />
				}
				{
					address &&
					<TokenBalance token={MANA} address={address} />
				}
			</header>

			<main>
				<CanvasParcelGrid
					size={screenDimensions}
					origin={origin}
					parcelSize={parcelCellSize}
					selectedParcel={selectedParcel}
					setSelectedParcel={setSelectedParcel}>
				</CanvasParcelGrid>
			</main>

		</>
	)

}

export default Index