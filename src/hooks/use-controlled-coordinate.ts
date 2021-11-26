import * as React from 'react'

import { Coordinate } from '../types/coordinate'

function useControlledCoordinate(coord: Coordinate = { x: 0, y: 0 }) {

	const [coordinate, setCoordiante] = React.useState(coord)

	React.useEffect(() => {

		function onKeydown(event: KeyboardEvent) {
			const delta: Coordinate = { x: 0, y: 0 }

			switch (event.key) {
				case `ArrowUp`:
					delta.y = -1
					break;
				case `ArrowDown`:
					delta.y = 1
					break;
				case `ArrowLeft`:
					delta.x = 1
					break;
				case `ArrowRight`:
					delta.x = -1
					break;
			}

			setCoordiante({
				x: coordinate.x + delta.x,
				y: coordinate.y + delta.y,
			})
		}

		window.addEventListener(`keydown`, onKeydown)

		return () => {
			window.removeEventListener(`keydown`, onKeydown)
		}

	}, [coordinate, setCoordiante])

	return coordinate

}

export default useControlledCoordinate
