import React from 'react'

import type { NextPage } from 'next'

import Parcel from '../types/parcel'

import AppConfig from '../config/app-config'

import useScreenDimensions from '../hooks/use-screen-dimensions'
import useMousewheelScalable from '../hooks/use-mousewheel-scalable'
import useControlledCoordinate from '../hooks/use-controlled-coordinate'

import CanvasParcelGrid from '../components/CanvasParcelGrid/CanvasParcelGrid'

// import styles from './index.module.scss'

const Index: NextPage = () => {

	const screenDimensions = useScreenDimensions()

	const parcelCellSize = useMousewheelScalable(AppConfig.ParcelPixelWidth, {
		delta: 1,
		minValue: AppConfig.ParcelPixelMinWidth,
		maxValue: AppConfig.ParcelPixelMaxWidth,
	})

	const origin = useControlledCoordinate(AppConfig.Origin)

	const [selectedParcel, setSelectedParcel] = React.useState<Parcel|null>(null)

  return (
	<CanvasParcelGrid
		size={screenDimensions}
		origin={origin}
		parcelSize={parcelCellSize}
		selectedParcel={selectedParcel}
		setSelectedParcel={setSelectedParcel}>
	</CanvasParcelGrid>
  )

}

export default Index
