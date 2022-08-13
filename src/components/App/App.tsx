import React from 'react'

import { css } from '@emotion/css'

import { useEthers } from '@usedapp/core'

import Parcel from '../../types/parcel'
import ITokenMetadata from '../../types/token'

import AppConfig from '../../config/app-config'

import useScreenDimensions from '../../hooks/use-screen-dimensions'
import useMousewheelScalable from '../../hooks/use-mousewheel-scalable'
import useControlledCoordinate from '../../hooks/use-controlled-coordinate'

import TokenBalance from '../TokenBalance/TokenBalance'
import ConnectToWalletButton from '../ConnectToWalletButton/ConnectToWalletButton'

import CanvasParcelGrid from '../CanvasParcelGrid/CanvasParcelGrid'

import './App.css'

function App() {

	const screenDimensions = useScreenDimensions()

	const parcelCellSize = useMousewheelScalable(AppConfig.ParcelPixelWidth, {
		delta: 1,
		minValue: AppConfig.ParcelPixelMinWidth,
		maxValue: AppConfig.ParcelPixelMaxWidth,
	})

	const origin = useControlledCoordinate(AppConfig.Origin)

	const [selectedParcel, setSelectedParcel] = React.useState<Parcel|null>(null)

	const { account: address } = useEthers()

	// See: https://etherscan.io/token/0x0f5d2fb29fb7d3cfee444a200298f468908cc942

	const MANA: ITokenMetadata = {
		name: 'Decentraland',
		symbol: 'MANA',
		address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
		decimals: 18,
	}

	return (
		<div>

			<header
				style={{
					position: 'sticky',
					top: 0,
					zIndex: 999,
					minHeight: 64,
					backgroundColor: 'rgba(0,0,0,0.75)',
					color: 'white',
					padding: '1em',
				}}
				>

				{
					!address &&
					<ConnectToWalletButton />
				}

				{
					address &&
					<TokenBalance token={MANA} address={address} />
				}

			</header>

			<main className={css({
				color: `white`
			})}>

				<CanvasParcelGrid
					size={screenDimensions}
					origin={origin}
					parcelSize={parcelCellSize}
					selectedParcel={selectedParcel}
					setSelectedParcel={setSelectedParcel}>
				</CanvasParcelGrid>

			</main>

		</div>
	)
}

export default App
