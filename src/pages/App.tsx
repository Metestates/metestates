import React from 'react'

import Head from 'next/head'
import { AppPropsType } from 'next/dist/shared/lib/utils'

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

	// @NOTE(mzalla) See:
	// https://github.com/apollographql/apollo-cache-persist/blob/HEAD/docs/advanced-usage.md#additional-options

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

const SafeHydrate = ({ children }: React.PropsWithChildren<any>) => (
	<div suppressHydrationWarning={true}>
		{typeof window === 'undefined' ? null : children}
	</div>
)

const SiteTitle = 'Metestates'
const SiteDescription = 'Become the next land-baron!'

const client = await getApolloClient()

const dappProviderConfig: Config = {
	readOnlyChainId: ChainId.Mainnet,
	readOnlyUrls: {
		// [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
		[ChainId.Mainnet]: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
		// [ChainId.Mainnet]: 'https://eth-mainnet.gateway.pokt.network/v1/lb/6004bcd10040261633ade990',
		// [ChainId.Mainnet]: 'https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
	},
}

// import './App.scss'

const App = ({ Component, pageProps }: AppPropsType) => {

	return (
		<SafeHydrate>
			<ApolloProvider client={client}>
				<DAppProvider config={dappProviderConfig}>
					<div className='App'>

						<Head>

							<meta charSet="utf-8" />
							<meta name="Author" content="" />
							<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
							<link rel="shortcut icon" href="/favicon.ico" />
							<link rel="icon" href="/favicon.ico" />

							<title>{`${SiteDescription} - ${SiteTitle}`}</title>

							<meta name="Description" content="" />

							<meta property="og:type" content="website" />
							<meta property="og:title" content={SiteDescription} />
							<meta property="og:description" content={SiteDescription} />
							<meta property="og:site_name" content={SiteTitle} />
							<meta property="twitter:card" content="summary" />
							<meta property="twitter:creator" content='@Metestates' />
							<meta property="twitter:title" content={SiteTitle} />
							<meta property="twitter:description" content={SiteDescription} />

						</Head>

						<Component {...pageProps} />

					</div>
				</DAppProvider>
			</ApolloProvider>
		</SafeHydrate>
	)
}

export default App
