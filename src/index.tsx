import React from 'react'

import { createRoot } from 'react-dom/client';

import localForage from 'localforage'

import {
	persistCache,
	LocalForageWrapper
} from 'apollo3-cache-persist'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	NormalizedCacheObject,
} from '@apollo/client'

import {
	ChainId,
	Config,
	DAppProvider,
} from '@usedapp/core'

import './index.css'

import reportWebVitals from './reportWebVitals'

import App from './components/App/App'

const getApolloClient = async (): Promise<ApolloClient<NormalizedCacheObject>> => {

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

	await persistCache({
		cache: cache,
		maxSize: false,
		storage: new LocalForageWrapper(localForage),
	})

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

	const client = await getApolloClient()

	const dappProviderConfig: Config = {
		readOnlyChainId: ChainId.Mainnet,
		readOnlyUrls: {
			[ChainId.Mainnet]: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
		},
	}

	const container = document.getElementById('root');

	const root = createRoot(container as Element);

	root.render(
		<React.StrictMode>
			<ApolloProvider client={client}>
				<DAppProvider config={dappProviderConfig}>
					<App />
				</DAppProvider>
			</ApolloProvider>
		</React.StrictMode>
	)

	// If you want to start measuring performance in your app, pass a function
	// to log results (for example: reportWebVitals(console.log))
	// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
	reportWebVitals()

}

init()
