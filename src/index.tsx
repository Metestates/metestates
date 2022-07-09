import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App/App'
import reportWebVitals from './reportWebVitals'

import localForage from 'localforage'

import {
	persistCache,
	LocalForageWrapper
} from 'apollo3-cache-persist'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client'

async function getClient() {
	const cache = new InMemoryCache({
		typePolicies: {
			Parcel: {
				keyFields: ['x', 'y']
			},
		}
	})

	localForage.config({
		name: 'metestates',
		storeName: 'keyvaluepairs',
		description: 'Local storage for the Metestates web app.'
	})

	// await persistCache({
	// 	cache: cache,
	// 	storage: new LocalForageWrapper(localForage),
	// })

	const client = new ApolloClient({
		// https://api.decentraland.org/v1/tiles
		uri: `https://api.thegraph.com/subgraphs/name/decentraland/marketplace`,
		cache: cache,
		// name: `Metestates`,
		// version: `0.1.0`,
	})

	return client
}

async function init() {

	const client = await getClient()

	ReactDOM.render(

		(
			<React.StrictMode>
				<ApolloProvider client={client}>
					<App />
				</ApolloProvider>
			</React.StrictMode>
		),

		document.getElementById('root')

	)

	// If you want to start measuring performance in your app, pass a function
	// to log results (for example: reportWebVitals(console.log))
	// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
	reportWebVitals()

}

init()
