import { css } from '@emotion/css'

import { GET_SOME_PARCELS_counts } from '../../__generated__/GET_SOME_PARCELS'

interface CountsListProps {
	counts: GET_SOME_PARCELS_counts[]
}

function CountsList({ counts }: CountsListProps) {
	let first = counts[0]
	return (
		<ul
			className={css({
				backgroundColor: 'none'
			})}
		>
			<li className="counts-list-item">Parcels: {first.orderParcel}</li>
			<li className="counts-list-item">Estates: {first.orderEstate}</li>
			{/* <li className="counts-list-item">Totals: {first.orderTotal}</li> */}
		</ul>
	)
}

export default CountsList
