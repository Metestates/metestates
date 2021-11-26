import {
	useQuery,
	gql,
	// DocumentNode,
	// QueryResult,
	// OperationVariables,
	ApolloError,
} from '@apollo/client'

import { GET_SOME_PARCELS } from '../__generated__/GET_SOME_PARCELS'

import { Coordinate } from "../types/coordinate";

// interface GetSomeParcelsUseQueryResult
//   extends QueryResult<GET_SOME_PARCELS, unknown> {}

interface GetSomeParcelsUseQueryResult {
	data?: GET_SOME_PARCELS,
	loading: boolean,
	error?: ApolloError,
}

const getSomeParcelsQuery = gql`
	query GET_SOME_PARCELS_QUERY(
		$xGte: BigInt
		$xLt: BigInt
		$yLte: BigInt
		$yGt: BigInt
	) {
		parcels(
			where: { x_gte: $xGte, x_lt: $xLt, y_lte: $yLte, y_gt: $yGt }
		) {
			id
			# tokenId
			owner {
				address
			}
			x
			y
			# data {
			# 	name
			# 	description
			# 	ipns
			# }
			estate {
				# id
				# tokenId
				owner {
					address
				}
			}
		}
	}
`

function useParcelBlock(blockCoords: Coordinate) {

	const variables = {
		xGte: blockCoords.x,
		xLt: blockCoords.x + 10,
		yLte: blockCoords.y,
		yGt: blockCoords.y - 10,
	}

	const { data: blockData, loading: isBlockDataLoading, error: blockError }: GetSomeParcelsUseQueryResult =
		useQuery(getSomeParcelsQuery, {
			errorPolicy: `all`,
			variables,
		})

	if(blockError)
	{
		console.warn(`Failed to fetch block at (${blockCoords.x, blockCoords.y}): ${JSON.stringify(blockError)}`)
	}

	return { blockData, isBlockDataLoading, blockError }

}

export default useParcelBlock
