import {
	useQuery,
	ApolloError,
} from '@apollo/client'

import { GET_PARCEL_BLOCK, GET_PARCEL_BLOCKVariables } from './__generated__/GET_PARCEL_BLOCK'

import { Coordinate } from "../types/coordinate";

import getBlockDataQuery from '../queries/getBlockData';

import AppConfig from '../config/app-config'

export type BlockDataQueryVariables = GET_PARCEL_BLOCKVariables

export type Block = GET_PARCEL_BLOCK

export type BlockDataResult = {
	data?: Block,
	loading: boolean,
	error?: ApolloError,
}

export type UseParcelBlockHookResult = {
	blockData?: GET_PARCEL_BLOCK;
	isBlockDataLoading: boolean;
	blockError?: ApolloError;
}

const useParcelBlock = (blockCoords: Coordinate): UseParcelBlockHookResult => {

	const variables: BlockDataQueryVariables = {
		first: AppConfig.ParcelsPerQuery,
		xGte: blockCoords.x,
		xLt: blockCoords.x + Math.sqrt(AppConfig.ParcelsPerQuery),
		yLte: blockCoords.y,
		yGt: blockCoords.y - Math.sqrt(AppConfig.ParcelsPerQuery),
	}

	const { data: blockData, loading: isBlockDataLoading, error: blockError }: BlockDataResult =
		useQuery(getBlockDataQuery, {
			errorPolicy: `all`,
			variables,
		})

	if(blockError)
	{
		console.warn(`Failed to fetch block at (${blockCoords.x}, ${blockCoords.y}): ${JSON.stringify(blockError)}`)
	}

	return { blockData, isBlockDataLoading, blockError }

}

export default useParcelBlock
