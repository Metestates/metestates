import { Parcel } from '../types/parcel'
import { Coordinate } from '../types/coordinate'

import { getBlockCoordinate } from '../utils/parcel'

import useParcelBlock from './use-parcel-block'

const useParcel = ({ x, y }: Coordinate) => {

	const blockCoordinate = getBlockCoordinate(x, y)

	const { blockData, isBlockDataLoading, blockError } = useParcelBlock(blockCoordinate)

	let parcel: Parcel|undefined

	if(!isBlockDataLoading && !blockError)
	{
		parcel = blockData?.parcels.find(
			p => parseInt(p.x) === x && parseInt(p.y) === y
		)
	}

	return { parcel, isBlockDataLoading, blockError }

}

export default useParcel
