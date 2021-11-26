import * as React from 'react'

function useScreenDimensions() {

	const [screenDimensions, setScreenDimensions] = React.useState({
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

	}, [window.innerWidth, window.innerHeight])

	return screenDimensions

}

export default useScreenDimensions
