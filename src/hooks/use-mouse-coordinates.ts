import * as React from 'react'

import Coordinate from '../types/coordinate'

type UseMouseCoordinatesHookResult = Coordinate

const useMouseCoordinates = (): UseMouseCoordinatesHookResult => {

	const [mouseCoordinates, setMouseCoordinates] = React.useState<Coordinate>({
		x: 0,
		y: 0,
	})

	React.useEffect(() => {

		function onMousemove(e: MouseEvent) {
			setMouseCoordinates({
				x: e.clientX,
				y: e.clientY,
			})
		}

		window.addEventListener(`mousemove`, onMousemove)

		return () => {
			window.removeEventListener(`mousemove`, onMousemove)
		}

	}, [])

	return mouseCoordinates

}

export default useMouseCoordinates
