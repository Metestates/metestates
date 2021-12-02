import { Coordinate } from '../types/coordinate'
import { Parcel } from '../types/parcel'

import AppConfig from '../config/app-config'

import useParcelBlock from './use-parcel-block'

function useParcel(parcelCoords: Coordinate) {

	// Maps parcel coordinate to block (anchor) coordiante

	const blockCoords: Coordinate = {
		x: parcelCoords.x - (parcelCoords.x % Math.sqrt(AppConfig.ParcelsPerQuery)),
		y: parcelCoords.y - (parcelCoords.y % Math.sqrt(AppConfig.ParcelsPerQuery)),
	}

	const { blockData, isBlockDataLoading, blockError } = useParcelBlock(blockCoords)

	let parcel: Parcel|undefined

	if(!isBlockDataLoading && !blockError)
	{
		parcel = blockData?.parcels.find(
			p => parseInt(p.x) === parcelCoords.x && parseInt(p.y) === parcelCoords.y
		)
	}

	return { parcel, isBlockDataLoading, blockError }


}

export default useParcel
