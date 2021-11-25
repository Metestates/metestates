import React from 'react';

import { css } from '@emotion/css';

import {FixedSizeGrid as Grid} from 'react-window'

import { GET_SOME_PARCELS_parcels } from '../../__generated__/GET_SOME_PARCELS'

import { Coordinate } from '../App/App'

interface IParcelCellProps extends React.PropsWithChildren<React.Attributes> {
	parcels: GET_SOME_PARCELS_parcels[];
	xMin: number,
	yMax: number,
	size: number,
	columnIndex: number,
	rowIndex: number,
	style: React.CSSProperties,
}

const DCL_DAO_CONTRACT = `0x9a6ebe7e2a7722f8200d0ffb63a1f6406a0d7dce`

function getBackgroundColor(
	address: string): string
{
	if(address === DCL_DAO_CONTRACT)
	{
		return '#000';
	}

	return `#${address.substr(2,8)}`
}

function ParcelGridCell(
	{ parcels, size: parcelCellSize, xMin, yMax, columnIndex, rowIndex, style }: IParcelCellProps)
{

	const MinimumSizeToShowDetails = 64;

	const parcel = parcels.find(p => (
		parseInt(p.x) === columnIndex + xMin &&
		parseInt(p.y) === yMax - rowIndex
	))

	const styleWithDefaults = {
		padding: `4px`,
		fontSize: '11px',
		filter: `brightness(0.7)`,
		...style
	}

	if(!parcel)
	{
		return (
			<div
				style={{
					opacity: 0.4,
					...styleWithDefaults
				}}
			>
				<p>{columnIndex + xMin}, {yMax - rowIndex}</p>
				<p>?</p>
			</div>
		)
	}

	const address = (parcel.estate ? parcel.estate : parcel).owner.address

	const shortAddress = `${address.slice(0,5)}…${address.slice(address.length - 4)}`

	return (
		<div
			style={{
				backgroundColor: getBackgroundColor(address),
				...styleWithDefaults
			}}
		>
			{
				parcelCellSize >= MinimumSizeToShowDetails &&
				<>
					<p>{parcel.x},{parcel.y}</p>
					{
						address !== DCL_DAO_CONTRACT &&
						(
							<a className="hyperlink"
								href={`https://etherscan.io/address/${address}`}
								rel="noopener noreferrer nofollow"
								target="_blank">
								{shortAddress}
							</a>
						)
					}
				</>
			}
		</div>
	)

}

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
