import * as React from 'react'

import { Coordinate } from '../types/coordinate'

import AppConfig from '../config/app-config'

function useControlledCoordinate(coord: Coordinate = { x: 0, y: 0 }) {

	const [coordinate, setCoordiante] = React.useState(coord)

	React.useEffect(() => {

		function onKeydown(event: KeyboardEvent) {
			const step = AppConfig.PanningStep;
			const delta: Coordinate = { x: 0, y: 0 }

			switch (event.key) {
				case `ArrowUp`:
					delta.y = step
					break;
				case `ArrowDown`:
					delta.y = -step
					break;
				case `ArrowLeft`:
					delta.x = -step
					break;
				case `ArrowRight`:
					delta.x = step
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
