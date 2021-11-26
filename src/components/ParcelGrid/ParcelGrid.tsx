import React from 'react';

import { css } from '@emotion/css';

import {FixedSizeGrid as Grid} from 'react-window'

import { Coordinate } from '../../types/coordinate'

import { ParcelGridCell } from '../ParcelGridCell/ParcelGridCell'

interface IParcelGridProps extends React.PropsWithChildren<React.Attributes> {
	parcelBounds: Coordinate[],
	parcelCellSize: number,
	screenDimensions: {
		width: number,
		height: number,
	},
}

function ParcelGrid(
	{ parcelBounds, parcelCellSize, screenDimensions }: IParcelGridProps)
{

	const parcelBoundsPadding = 0

	const xMin = parcelBounds[0].x - parcelBoundsPadding
	const yMin = parcelBounds[1].y - parcelBoundsPadding

	const xMax = parcelBounds[1].x + parcelBoundsPadding
	const yMax = parcelBounds[0].y + parcelBoundsPadding

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
				size: parcelCellSize,
				xMin,
				yMax,
				...props
			})}

		</Grid>

	)
}

export default ParcelGrid
