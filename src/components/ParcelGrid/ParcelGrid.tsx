import React from 'react';

import memoize from 'memoize-one';

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

const buildItemData = memoize(
	(size: number, xMin: number, yMax: number) => ({ size, xMin, yMax })
)

function ParcelGrid(
	{ parcelBounds, parcelCellSize, screenDimensions }: IParcelGridProps)
{

	const parcelBoundsPadding = 0

	const xMin = parcelBounds[0].x - parcelBoundsPadding

	const yMax = parcelBounds[0].y + parcelBoundsPadding

	const columnCount = Math.ceil(screenDimensions.width / parcelCellSize)
	const rowCount = Math.ceil(screenDimensions.height / parcelCellSize)

	const itemData = buildItemData(parcelCellSize, xMin, yMax)

	return (
		<Grid
			className={css({
				width: `${screenDimensions.width}px !important`,
				height: `${screenDimensions.height}px !important`,
				overflow: `hidden !important`,
			})}
			width={screenDimensions.width}
			height={screenDimensions.height}
			columnWidth={parcelCellSize}
			rowHeight={parcelCellSize}
			columnCount={columnCount}
			rowCount={rowCount}
			itemKey={data => `(${data.columnIndex},${data.rowIndex})`}
			itemData={itemData}
		>
			{ParcelGridCell}
		</Grid>

	)
}

export default ParcelGrid
