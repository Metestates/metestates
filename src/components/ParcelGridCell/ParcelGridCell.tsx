import { GET_SOME_PARCELS_parcels } from 'src/__generated__/GET_SOME_PARCELS'

interface IParcelGridCellProps
	extends React.PropsWithChildren<React.Attributes> {
	parcels: GET_SOME_PARCELS_parcels[],
	xMin: number,
	yMax: number,
	size: number,
	columnIndex: number,
	rowIndex: number,
	style: React.CSSProperties,
}

// const ETH_DEAD_ADDRESS = `0x000000000000000000000000000000000000dEaD`
const DCL_DAO_CONTRACT = `0x9a6ebe7e2a7722f8200d0ffb63a1f6406a0d7dce`

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
	parcels,
	size: parcelCellSize,
	xMin,
	yMax,
	columnIndex,
	rowIndex,
	style,
}: IParcelGridCellProps) {

	const parcel = parcels.find(
		(p) =>
			parseInt(p.x) === columnIndex + xMin &&
			parseInt(p.y) === yMax - rowIndex
	)

	if (!parcel) {
		return (
			<div
				style={{
					opacity: 0.4,
					...ParcelGridCellDefaultStyles,
					...style
				}}
			>
				<p>
					{columnIndex + xMin},{yMax - rowIndex}
				</p>
				<p>?</p>
			</div>
		)
	}

	const address = (parcel.estate ? parcel.estate : parcel).owner.address

	const shortAddress = `${address.slice(0, 5)}…${address.slice(
		address.length - 4
	)}`

	return (
		<div
			style={{
				backgroundColor: getBackgroundColor(address),
				...ParcelGridCellDefaultStyles,
				...style,
			}}
		>
			{parcelCellSize >= MinimumSizeToShowDetails && (
				<>
					<p>
						{parcel.x},{parcel.y}
					</p>
					{address !== DCL_DAO_CONTRACT && (
						<a
							className="hyperlink"
							href={`https://etherscan.io/address/${address}`}
							rel="noopener noreferrer nofollow"
							target="_blank"
						>
							{shortAddress}
						</a>
					)}
				</>
			)}
		</div>
	)
}

export { ParcelGridCell }
