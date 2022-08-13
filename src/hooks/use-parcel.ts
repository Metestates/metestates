import { ApolloError } from '@apollo/client'

import Parcel from '../types/parcel'
import Coordinate from '../types/coordinate'

import { findParcel, getBlockCoordinate } from '../utils/parcel'

import useParcelBlock from './use-parcel-block'

export type UseParcelHookResult = {
	parcel?: Parcel;
	isBlockDataLoading: boolean;
	blockError?: ApolloError;
}

const useParcel = ({ x, y }: Coordinate): UseParcelHookResult => {

	const blockCoordinate = getBlockCoordinate(x, y)

	const { blockData: block, isBlockDataLoading, blockError } = useParcelBlock(blockCoordinate)

	let parcel: Parcel|undefined

	if(block)
	{
		parcel = findParcel(block, x, y)
	}

	return { parcel, isBlockDataLoading, blockError }

}

export default useParcel
