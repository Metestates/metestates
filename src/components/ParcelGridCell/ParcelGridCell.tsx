import { GET_SOME_PARCELS_parcels } from 'src/__generated__/GET_SOME_PARCELS'

import useParcel from '../../hooks/use-parcel'

interface IParcelGridCellProps
	extends React.PropsWithChildren<React.Attributes> {
	xMin: number,
	yMax: number,
	size: number,
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

function getBackgroundColor(address: string): string {
	if (address === DCL_DAO_CONTRACT) {
		return '#000'
	}

	return `#${address.substr(2, 8)}`
}

const MinimumSizeToShowDetails = 64

const ParcelGridCellDefaultStyles = {
	padding: `4px`,
	fontSize: '9px',
	filter: `brightness(0.7)`,
}

function ParcelGridCell({
	size: parcelCellSize,
	xMin,
	yMax,
	columnIndex,
	rowIndex,
	style,
}: IParcelGridCellProps) {
	const { parcel, isBlockDataLoading, blockError } =
		useParcel({ x: columnIndex + xMin, y: yMax - rowIndex })

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
					({columnIndex + xMin},{yMax - rowIndex})
					{ isBlockDataLoading && `Loading…` }
					{ blockError && `Error!` }
				</p>

			</div>
		)
	}

	const addr = address(parcel)
	const shortAddr = short(addr)

	return (
		<div
			style={{
				backgroundColor: getBackgroundColor(addr),
				...ParcelGridCellDefaultStyles,
				...style,
			}}
		>
			{parcelCellSize >= MinimumSizeToShowDetails && (
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

export { ParcelGridCell }
