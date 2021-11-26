import * as React from 'react'

import { areEqual } from 'react-window'

import { GET_SOME_PARCELS_parcels } from 'src/__generated__/GET_SOME_PARCELS'

import useParcel from '../../hooks/use-parcel'

interface IParcelGridCellItemData {
	xMin: number,
	yMax: number,
	size: number,
	selectedParcel: GET_SOME_PARCELS_parcels|null,
	setSelectedParcel: Function
}

interface IParcelGridCellProps extends React.PropsWithChildren<React.Attributes> {
	data: IParcelGridCellItemData;
	columnIndex: number,
	rowIndex: number,
	style: React.CSSProperties,
}

// const ETH_DEAD_ADDRESS = `0x000000000000000000000000000000000000dEaD`
const DCL_DAO_CONTRACT = `0x9a6ebe7e2a7722f8200d0ffb63a1f6406a0d7dce`

function address(parcel: GET_SOME_PARCELS_parcels) {
	return (parcel.estate ? parcel.estate : parcel).owner.address
}

function short(address: string) {
	return `${address.slice(0, 5)}…${address.slice(address.length - 4)}`
}

function hasSameOwner(
	parcel: GET_SOME_PARCELS_parcels,
	selectedParcel: GET_SOME_PARCELS_parcels): boolean
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

function getBackgroundColor(
	parcel: GET_SOME_PARCELS_parcels,
	selectedParcel: GET_SOME_PARCELS_parcels|null,
	address: string): string
{

	if (address === DCL_DAO_CONTRACT) {
		return '#000'
	}

	if (selectedParcel && hasSameOwner(parcel, selectedParcel))
	{
		return `white`
	}

	return `#${address.substr(2, 8)}`
}

const MinimumSizeToShowDetails = 64

const ParcelGridCellDefaultStyles = {
	padding: `4px`,
	fontSize: '9px',
	filter: `brightness(0.7)`,
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
		const shortAddr = short(addr)

		const backgroundColor = getBackgroundColor(
			parcel, data.selectedParcel, addr)

		return (
			<div
				onMouseEnter={() => data.setSelectedParcel(parcel)}
				style={{
					backgroundColor,
					...ParcelGridCellDefaultStyles,
					...style,
				}}
			>
				{data.size >= MinimumSizeToShowDetails && (
					<>
						<p>
							{parcel.x},{parcel.y}
						</p>
						{addr !== DCL_DAO_CONTRACT && (
							<a
								className="hyperlink"
								href={`https://etherscan.io/address/${addr}`}
								rel="noopener noreferrer nofollow"
								target="_blank"
							>
								{shortAddr}
							</a>
						)}
					</>
				)}
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
