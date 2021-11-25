import React from 'react'

import { css } from '@emotion/css'

import {
	useQuery,
	gql,
	// DocumentNode,
	// QueryResult,
	// OperationVariables,
	ApolloError,
} from '@apollo/client'

import { GET_SOME_PARCELS } from '../../__generated__/GET_SOME_PARCELS'

import ParcelGrid from '../ParcelGrid/ParcelGrid'

import './App.css'

export type Coordinate = {
	x: number;
	y: number
}

// interface GetSomeParcelsUseQueryResult
//   extends QueryResult<GET_SOME_PARCELS, unknown> {}

interface GetSomeParcelsUseQueryResult {
	data?: GET_SOME_PARCELS,
	loading: boolean,
	error?: ApolloError,
}

function App() {

	const [parcelCellSize, setParcelCellSize] = React.useState(18)

	const [screenDimensions, setScreenDimensions] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})

	const origin: Coordinate = {
		x: 23,
		y: -7
	}

	const parcelBounds: Coordinate[] = [
		origin,
		{
			x: origin.x + 10,
			y: origin.y - 10
		},
	]

	const getSomeParcelsQuery = gql`
		query GET_SOME_PARCELS_QUERY(
			$xGte: BigInt
			$xLt: BigInt
			$yLte: BigInt
			$yGt: BigInt
		) {
			counts(first: 1) {
				id
				orderParcel
				orderEstate
				orderTotal
			}
			parcels(
				where: { x_gte: $xGte, x_lt: $xLt, y_lte: $yLte, y_gt: $yGt }
			) {
				id
				tokenId
				owner {
					address
				}
				x
				y
				data {
					name
					description
					ipns
				}
				estate {
					id
					tokenId
					owner {
						address
					}
				}
			}
		}
	`

	const {
		data: parcelsConnection,
		loading: isParcelsLoading,
		error: parcelsError,
	}: GetSomeParcelsUseQueryResult = useQuery(getSomeParcelsQuery, {
		errorPolicy: `all`,
		variables: {
			xGte: parcelBounds[0].x,
			xLt: parcelBounds[1].x,
			yLte: parcelBounds[0].y,
			yGt: parcelBounds[1].y,
		},
	})

	if (isParcelsLoading) {
		return <span>Loading parcels…</span>
	}

	if (parcelsError) {
		return (
			<span className="error">
				Error loading parcels: {JSON.stringify(parcelsError)}
			</span>
		)
	}

	return (
		<div className={css({
			backgroundColor: 'lightgray',
			width: `${screenDimensions.width}px`,
			height: `${screenDimensions.height}px`,
			overflow: `hidden`,
		})}>

			{parcelsConnection?.parcels && (
				<ParcelGrid
					parcels={parcelsConnection.parcels}
					parcelBounds={parcelBounds}
					parcelCellSize={parcelCellSize}
					screenDimensions={screenDimensions}
				>
				</ParcelGrid>
			)}

		</div>
	)
}

export default App
