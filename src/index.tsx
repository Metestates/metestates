import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App/App'
import reportWebVitals from './reportWebVitals'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client'

import * as apolloConfig from '@apollo/config'

const client = new ApolloClient({
	uri: apolloConfig.client.service.url,
	cache: new InMemoryCache(),
})

ReactDOM.render(

	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,

	document.getElementById('root')

)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
