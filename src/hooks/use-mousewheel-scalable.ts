import * as React from 'react'

interface IUseMousewheelScalableOptions {
	delta: number,
	minValue?: number,
	maxValue?: number,
}

function clamp(
	value: number,
	min: number = -Infinity,
	max: number = Infinity): number
{
	return Math.max(
		min || -Infinity,
		Math.min(value, max || Infinity)
	)
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

			const clampedValue = clamp(newValue, options.minValue, options.maxValue)

			setScalableValue(clampedValue)

		}

		window.addEventListener(`wheel`, onMouseWheel)

		return () => {
			window.removeEventListener(`wheel`, onMouseWheel)
		}

	}, [
		options.delta,
		options.maxValue,
		options.minValue,
		scalableValue,
		setScalableValue,
	])

	return scalableValue

}

export default useMousewheelScalable
