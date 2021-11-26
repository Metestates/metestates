import * as React from 'react'

interface IUseMousewheelScalableOptions {
	delta: number,
}

function useMousewheelScalable(
	initialValue: number = 0,
	options: IUseMousewheelScalableOptions = { delta: 1 })
{

	const [scalableValue, setScalableValue] = React.useState(initialValue)

	React.useEffect(() => {

		function onMouseWheel(event: WheelEvent) {

			const newValue = scalableValue + (event.deltaY < 0 ?
				-1 * options.delta :
				options.delta)

			setScalableValue(newValue)

		}

		window.addEventListener(`wheel`, onMouseWheel)

		return () => {
			window.removeEventListener(`wheel`, onMouseWheel)
		}

	}, [scalableValue, setScalableValue])

	return scalableValue

}

export default useMousewheelScalable
