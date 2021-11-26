import * as React from 'react'

function useMousewheelScalable(initialValue: number = 0, delta: number = 1) {

	const [scalableValue, setScalableValue] = React.useState(initialValue)

	React.useEffect(() => {

		function onMouseWheel(event: WheelEvent) {
			setScalableValue(
				scalableValue + ((event.deltaY < 0) ? (-1 * delta) : delta)
			)
		}

		window.addEventListener(`wheel`, onMouseWheel)

		return () => {
			window.removeEventListener(`wheel`, onMouseWheel)
		}

	}, [scalableValue, setScalableValue])

	return scalableValue

}

export default useMousewheelScalable
