import { Coordinate } from '../types/coordinate'

import { GET_SOME_PARCELS_parcels } from '../__generated__/GET_SOME_PARCELS'

import useParcelBlock from './use-parcel-block'

function useParcel(parcelCoords: Coordinate) {

	// Maps parcel coordinate to block (anchor) coordiante

	const blockCoords: Coordinate = {
		x: parcelCoords.x - (parcelCoords.x % 10),
		y: parcelCoords.y - (parcelCoords.y % 10),
	}

	const { blockData, isBlockDataLoading, blockError } = useParcelBlock(blockCoords)

	let parcel: GET_SOME_PARCELS_parcels|undefined

	if(!isBlockDataLoading && !blockError)
	{
		parcel = blockData?.parcels.find(
			p => parseInt(p.x) === parcelCoords.x && parseInt(p.y) === parcelCoords.y
		)
	}

	return { parcel, isBlockDataLoading, blockError }


}

export default useParcel
