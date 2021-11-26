import React from 'react'

import { css } from '@emotion/css'

import { Coordinate } from '../../types/coordinate'

import useScreenDimensions from '../../hooks/use-screen-dimensions'
import useMousewheelScalable from '../../hooks/use-mousewheel-scalable'
import useControlledCoordinate from '../../hooks/use-controlled-coordinate'

import ParcelGrid from '../ParcelGrid/ParcelGrid'

import './App.css'

function App() {
	const screenDimensions = useScreenDimensions()
	const parcelCellSize = useMousewheelScalable(64, {
		delta: 4,
		minValue: 20,
		maxValue: 80,
	})
	const origin = useControlledCoordinate({ x: 23, y: -7 })

	const parcelBounds: Coordinate[] = [
		origin,
		{
			x: origin.x + 10,
			y: origin.y - 10,
		},
	]

	const [selectedParcel, setSelectedParcel] = React.useState(null)

	return (
		<div
			className={css({
				backgroundColor: 'lightgray',
				width: `${screenDimensions.width}px`,
				height: `${screenDimensions.height}px`,
				overflow: `hidden`,
			})}
		>
			<ParcelGrid
				parcelBounds={parcelBounds}
				parcelCellSize={parcelCellSize}
				screenDimensions={screenDimensions}
				selectedParcel={selectedParcel}
				setSelectedParcel={setSelectedParcel}
			></ParcelGrid>
		</div>
	)
}

export default App
