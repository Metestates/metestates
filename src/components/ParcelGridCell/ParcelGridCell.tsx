import * as React from 'react'

import { areEqual } from 'react-window'

import { Parcel } from '../../types/parcel'

import useParcel from '../../hooks/use-parcel'

import {
	address,
	getParcelColor,
	getGrayscaleFilterValue
} from '../../utils/parcel'

interface IParcelGridCellItemData {
	xMin: number,
	yMax: number,
	size: number,
	selectedParcel: Parcel|null,
	setSelectedParcel: Function
}

interface IParcelGridCellProps extends React.PropsWithChildren<React.Attributes> {
	data: IParcelGridCellItemData;
	columnIndex: number,
	rowIndex: number,
	style: React.CSSProperties,
}

const ParcelGridCellDefaultStyles = {
	padding: `4px`,
	fontSize: '9px',
	filter: `grayscale(0.0)`,
	transition: `filter 0.35s ease-in-out`,
}

const ParcelGridCell = React.memo(({
	data,
	columnIndex,
	rowIndex,
	style,
}: IParcelGridCellProps) => {
	const { parcel, isBlockDataLoading, blockError } =
		useParcel({ x: columnIndex + data.xMin, y: data.yMax - rowIndex })

	if(parcel)
	{
		const addr = address(parcel)

		const backgroundColor = getParcelColor(
			parcel,
			data.selectedParcel,
			addr)

		const grayscaleFilterValue =
			`${getGrayscaleFilterValue(parcel, data.selectedParcel)}`

		return (
			<div
				onMouseEnter={() => data.setSelectedParcel(parcel)}
				style={{
					backgroundColor,
					...ParcelGridCellDefaultStyles,
					filter: `grayscale(${grayscaleFilterValue})`,
					...style,
				}}
			>
				{/*
				{
					data.size >= MinimumSizeToShowDetails &&
					addr !== DAOContractAddress && (
						`${parcel.x},${parcel.y}`
						// <p>
						// 	<a
						// 		className="hyperlink"
						// 		href={`https://etherscan.io/address/${addr}`}
						// 		rel="noopener noreferrer nofollow"
						// 		target="_blank"
						// 	>
						// 		{shortAddr}
						// 	</a>
						// </p>
					)
				}
				*/}
			</div>
		)
	}

	if (isBlockDataLoading || blockError || !parcel) {
		return (
			<div
				style={{
					opacity: isBlockDataLoading ? 0.4 : 0.8,
					backgroundColor: blockError ? 'red' : 'grey',
					...ParcelGridCellDefaultStyles,
					...style
				}}
			>
				<p>
					({columnIndex + data.xMin},{data.yMax - rowIndex})
					{ isBlockDataLoading && `Loading…` }
					{ blockError && `Error!` }
				</p>

			</div>
		)
	}

	console.warn(`This should be impossible!`)

	return null


}, areEqual)

export { ParcelGridCell }
