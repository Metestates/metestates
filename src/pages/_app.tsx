import dynamic from 'next/dynamic'

import './_app.scss'

const App = dynamic(() => import('./App'), {
	ssr: false,
})

export default App
