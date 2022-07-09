import * as React from 'react'

import { areEqual } from 'react-window'

import { Parcel } from '../../types/parcel'

import { DAOContractAddress } from '../../constants/DAOContractAddress'

import useParcel from '../../hooks/use-parcel'

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

function address(parcel: Parcel) {
	return (parcel.estate ? parcel.estate : parcel).owner.address
}

function short(address: string) {
	return `${address.slice(0, 5)}…${address.slice(address.length - 4)}`
}

function hasSameOwner(
	parcel: Parcel,
	selectedParcel: Parcel): boolean
{

	if (selectedParcel.estate || parcel.estate)
	{
		if(selectedParcel.estate && parcel.estate)
		{
			if(selectedParcel.estate.owner.address === parcel.estate.owner.address)
			{
				return true
			}
		}
		else if(selectedParcel.estate)
		{
			if(selectedParcel.estate.owner.address === parcel.owner.address)
			{
				return true
			}
		}
		else if(selectedParcel.owner.address === parcel.estate?.owner.address)
		{
			return true
		}
	} else if (parcel.owner.address === selectedParcel.owner.address) {
		return true
	}

	return false

}

function getParcelColor(
	parcel: Parcel,
	selectedParcel: Parcel|null,
	address: string): string
{

	if (address === DAOContractAddress) {
		return '#000'
	}

	return `#${address.substr(2, 8)}`
}

function getGrayscaleFilterValue(
	parcel: Parcel,
	selectedParcel: Parcel|null): number
{
	if (selectedParcel&& !hasSameOwner(parcel, selectedParcel))
	{
		return 0.95
	}

	return 0
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
