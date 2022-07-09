import {
	useQuery,
	// DocumentNode,
	// QueryResult,
	// OperationVariables,
	ApolloError,
} from '@apollo/client'

import { GET_PARCEL_BLOCK, GET_PARCEL_BLOCKVariables } from './__generated__/GET_PARCEL_BLOCK'

import { Coordinate } from "../types/coordinate";

import getBlockDataQuery from '../queries/getBlockData';

import AppConfig from '../config/app-config'

// interface GetSomeParcelsUseQueryResult
//   extends QueryResult<GET_SOME_PARCELS, unknown> {}

interface GetSomeParcelsUseQueryResult {
	data?: GET_PARCEL_BLOCK,
	loading: boolean,
	error?: ApolloError,
}

function useParcelBlock(blockCoords: Coordinate) {

	const variables: GET_PARCEL_BLOCKVariables = {
		first: AppConfig.ParcelsPerQuery,
		xGte: blockCoords.x,
		xLt: blockCoords.x + Math.sqrt(AppConfig.ParcelsPerQuery),
		yLte: blockCoords.y,
		yGt: blockCoords.y - Math.sqrt(AppConfig.ParcelsPerQuery),
	}

	const { data: blockData, loading: isBlockDataLoading, error: blockError }: GetSomeParcelsUseQueryResult =
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
