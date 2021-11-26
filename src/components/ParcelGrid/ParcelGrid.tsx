import React from 'react';

import { css } from '@emotion/css';

import {FixedSizeGrid as Grid} from 'react-window'

import { Coordinate } from '../../types/coordinate'

import { GET_SOME_PARCELS_parcels } from '../../__generated__/GET_SOME_PARCELS'

import { ParcelGridCell } from '../ParcelGridCell/ParcelGridCell'

interface IParcelGridProps extends React.PropsWithChildren<React.Attributes> {
	parcels: GET_SOME_PARCELS_parcels[],
	parcelBounds: Coordinate[],
	parcelCellSize: number,
	screenDimensions: {
		width: number,
		height: number,
	},
}

function ParcelGrid(
	{ parcels, parcelBounds, parcelCellSize, screenDimensions }: IParcelGridProps)
{

	const xMin = parcelBounds[0].x - 4
	const yMin = parcelBounds[1].y - 4

	const xMax = parcelBounds[1].x + 4
	const yMax = parcelBounds[0].y + 4

	const columnCount = xMax - xMin
	const rowCount = yMax - yMin

	return (
		<Grid
			width={screenDimensions.width}
			height={screenDimensions.height}
			columnWidth={parcelCellSize}
			rowHeight={parcelCellSize}
			columnCount={columnCount}
			rowCount={rowCount}
			itemKey={data => `(${data.columnIndex},${data.rowIndex})`}
			className={css({
				width: `${screenDimensions.width}px !important`,
				height: `${screenDimensions.height}px !important`,
				overflow: `hidden !important`,
			})}
		>
			{(props) => ParcelGridCell({
				parcels,
				size: parcelCellSize,
				xMin,
				yMax,
				...props
			})}

		</Grid>

	)
}

export default ParcelGrid
