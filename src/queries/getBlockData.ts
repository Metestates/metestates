import { gql } from "@apollo/client";

// See:
//
// https://thegraph.com/docs/developer/developer-faq#22-is-there-a-limit-\
//  to-how-many-objects-the-graph-can-return-per-query

const getBlockDataQuery = gql`
	query GET_PARCEL_BLOCK(
		$first: Int,
		$xGte: BigInt
		$xLt: BigInt
		$yLte: BigInt
		$yGt: BigInt
	) {
		parcels(
			first: $first,
			where: { x_gte: $xGte, x_lt: $xLt, y_lte: $yLte, y_gt: $yGt }
		) {
			id
			# tokenId
			owner {
				address
			}
			x
			y
			# data {
			# 	name
			# 	description
			# 	ipns
			# }
			estate {
				# id
				# tokenId
				owner {
					address
				}
			}
		}
	}
`

export default getBlockDataQuery
