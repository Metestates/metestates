import { css } from '@emotion/css'

import { Parcel, ParcelData } from '../../types/parcel'

interface ParcelsListProps {
	parcels: Parcel[],
}

function ParcelDataInfo({ data }: { data: ParcelData }) {
	return (
		<ul className="parcel-metadata-list">
			{/* Name */}
			{data.name && (
				<li className="parcel-metadata-list-item">
					<strong>{data.name}</strong>
				</li>
			)}
			{/* Description */}
			{data.description && (
				<li className="parcel-metadata-list-item">
					<i>{data.description}</i>
				</li>
			)}
			{/* IPNS URL */}
			{data.ipns && (
				<li className="parcel-metadata-list-item">
					<a href={data.ipns} rel="noopener noreferrer nofollow">
						{data.ipns}
					</a>
				</li>
			)}
		</ul>
	)
}

function ParcelInfo({ parcel }: { parcel: Parcel }) {
	return (
		<div
			className={css({
				backgroundColor: 'limegreen'
			})}>
			{/* Parcel coordinates */}
			<p>
				({parcel.x}, {parcel.y})
			</p>
			{/* Parcel (or estate) owner address */}
			<p>
				Owner: {(parcel.estate ? parcel.estate : parcel).owner.address}
			</p>
			{/* Parcel token ID */}
			<p>Token ID: {parcel.tokenId}</p>
			{/* Parcel metadata */}
			{parcel.data && (
				<ParcelDataInfo data={parcel.data}></ParcelDataInfo>
			)}
		</div>
	)
}

function ParcelsList({ parcels }: ParcelsListProps) {
	return (
		<ul className="parcels-list">
			{parcels.map((parcel) => (
				<li key={parcel.id}>
					<ParcelInfo parcel={parcel}></ParcelInfo>
				</li>
			))}
		</ul>
	)
}

export default ParcelsList
