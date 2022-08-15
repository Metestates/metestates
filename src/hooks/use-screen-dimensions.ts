import * as React from 'react'

import Dimensions from '../types/dimensions'

type UseScreenDimensionsHookResult = Dimensions

const useScreenDimensions = (): UseScreenDimensionsHookResult => {

	const [screenDimensions, setScreenDimensions] = React.useState<Dimensions>({
		width: window.innerWidth,
		height: window.innerHeight,
	})

	React.useEffect(() => {

		function onWindowResize() {
			setScreenDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener(`resize`, onWindowResize)

		return () => {
			window.removeEventListener(`resize`, onWindowResize)
		}

	}, [])

	return screenDimensions

}

export default useScreenDimensions
