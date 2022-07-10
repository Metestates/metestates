import React from 'react'

import { css } from '@emotion/css'

import { Parcel } from '../../types/parcel'
import { Coordinate } from '../../types/coordinate'

import AppConfig from '../../config/app-config'

import useScreenDimensions from '../../hooks/use-screen-dimensions'
import useMousewheelScalable from '../../hooks/use-mousewheel-scalable'
import useControlledCoordinate from '../../hooks/use-controlled-coordinate'

import CanvasParcelGrid from '../CanvasParcelGrid/CanvasParcelGrid'

import './App.css'

function App() {
	const screenDimensions = useScreenDimensions()
	const parcelCellSize = useMousewheelScalable(AppConfig.ParcelPixelWidth, {
		delta: 4,
		minValue: AppConfig.ParcelPixelMinWidth,
		maxValue: AppConfig.ParcelPixelMaxWidth,
	})
	const origin = useControlledCoordinate(AppConfig.Origin)

	const parcelBounds: Coordinate[] = [
		origin,
		{
			x: origin.x + Math.sqrt(AppConfig.ParcelsPerQuery),
			y: origin.y - Math.sqrt(AppConfig.ParcelsPerQuery),
		},
	]

	const [selectedParcel, setSelectedParcel] = React.useState<Parcel|null>(null)

	return (
		<main className={css({
			color: `white`
		})}>

			<CanvasParcelGrid
				size={screenDimensions}
				parcelBounds={parcelBounds}
				parcelSize={parcelCellSize}
				selectedParcel={selectedParcel}
				setSelectedParcel={setSelectedParcel}>
			</CanvasParcelGrid>

		</main>
	)
}

export default App
