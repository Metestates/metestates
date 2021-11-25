import {
	useQuery,
	gql,
	DocumentNode,
	// QueryResult,
	// OperationVariables,
	ApolloError,
  } from '@apollo/client';

  import { GET_SOME_PARCELS } from '../../__generated__/GET_SOME_PARCELS'

  import CountsList from '../CountsList'
  import ParcelsList from '../ParcelsList'

  import './App.css';

  type Coordinate = { x: number; y: number }

  function buildGetSomeParcelsQuery(
	viewBoundary: Coordinate[]): DocumentNode
  {
	return gql`
	  query GET_SOME_PARCELS_QUERY {
		counts(first: 1) {
		  id
		  orderParcel
		  orderEstate
		  orderTotal
		}
		parcels(where: {
		  x_gte: ${viewBoundary[0].x},
		  x_lt: ${viewBoundary[1].x},
		  y_gte: ${viewBoundary[0].y},
		  y_lt: ${viewBoundary[1].y}
		})
		{
		  id
		  tokenId
		  owner {
			address
		  }
		  x
		  y
		  data {
			name
			description
			ipns
		  }
		  estate {
			id
			tokenId
			owner {
			  address
			}
		  }
		}
	  }
	`
  }

  // interface GetSomeParcelsUseQueryResult
  //   extends QueryResult<GET_SOME_PARCELS, unknown> {}

  interface GetSomeParcelsUseQueryResult {
	data?: GET_SOME_PARCELS,
	loading: boolean,
	error?: ApolloError
  }

  function App() {

	const parcelViewBoundary: Coordinate[] = [
		  { x: 0, y: 0 },
		  { x: 5, y: 5 },
	]

	const getSomeParcelsQuery = buildGetSomeParcelsQuery(parcelViewBoundary)

	const {
	  data: parcelsConnection,
	  loading: isParcelsLoading,
	  error: parcelsError
	}: GetSomeParcelsUseQueryResult = useQuery(getSomeParcelsQuery)

	if(isParcelsLoading)
	{
	  return (
		<span>Loading parcels…</span>
	  )
	}

	if(parcelsError)
	{
	  return (
		<span className="error">
		  Error loading parcels: {JSON.stringify(parcelsError)}
		</span>
	  )
	}

	return (
	  <div className="app">
		{parcelsConnection?.counts && <CountsList counts={parcelsConnection.counts}></CountsList>}
		{parcelsConnection?.parcels && <ParcelsList parcels={parcelsConnection.parcels}></ParcelsList>}
	  </div>
	);

  }

  export default App;
