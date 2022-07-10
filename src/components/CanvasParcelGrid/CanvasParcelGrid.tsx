import React, { FC } from 'react';

import { ApolloClient, useApolloClient } from '@apollo/client';

import { css } from '@emotion/css';

import { Color } from '../../types/color';
import { Parcel } from '../../types/parcel';
import { Coordinate } from '../../types/coordinate';
import { Dimensions } from '../../types/dimensions';

import AppConfig from '../../config/app-config';

import getBlockDataQuery from '../../queries/getBlockData';

import { BlockDataQueryVariables, BlockDataResult } from '../../hooks/use-parcel-block';

import { address, getParcelSaturation, getParcelColor, getBlockCoordinate } from '../../utils/parcel';

type BlockDataResultPromiseCache = {
  [key: string]: Promise<BlockDataResult>
}

const getParcelPromise = (
  x: number,
  y: number,
  apolloClient: ApolloClient<object>,
  cache: BlockDataResultPromiseCache): Promise<BlockDataResult> =>
{

  const blockCoordinate = getBlockCoordinate(x, y)

  const variables: BlockDataQueryVariables = {
    first: AppConfig.ParcelsPerQuery,
    xGte: blockCoordinate.x,
    xLt: blockCoordinate.x + AppConfig.ParcelBlockWidth,
    yLte: blockCoordinate.y,
    yGt: blockCoordinate.y - AppConfig.ParcelBlockWidth,
  }

  let promise: Promise<BlockDataResult>;

  let blockKey = `${blockCoordinate.x},${blockCoordinate.y}`

  if(blockKey in cache)
  {
    promise = cache[blockKey]
  }
  else
  {
    promise = apolloClient.query({
          query: getBlockDataQuery,
          errorPolicy: `all`,
          variables,
      })

    cache[blockKey] = promise
  }

  return promise

}

type CanvasParcelGridProps = React.PropsWithChildren<{
  size: Dimensions;
  parcelBounds: Coordinate[];
  parcelSize: number;
  selectedParcel: Parcel|null;
  setSelectedParcel: (value: Parcel|null) => void;
}>

const CanvasParcelGrid: FC<CanvasParcelGridProps> = ({
  size,
  parcelBounds: [origin],
  parcelSize,
  selectedParcel,
  setSelectedParcel
}) => {

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const [context, setContext] = React.useState<CanvasRenderingContext2D|null>(null)

  const apolloClient = useApolloClient()

  const cache: BlockDataResultPromiseCache  = {}

  const drawParcels = React.useCallback(() => {

    if(canvasRef.current === null || context === null)
    {
      return
    }

    const canvas = canvasRef.current

    const { width, height } = canvas

    context.clearRect(0, 0, width, height)

    const rowCount = Math.ceil(size.height / parcelSize)
    const columnCount = Math.ceil(size.width / parcelSize)

    for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for(let columnIndex = 0; columnIndex < columnCount; columnIndex++) {

        let parcelRect: [number, number, number, number] = [
          columnIndex * parcelSize,
          rowIndex * parcelSize,
          parcelSize,
          parcelSize,
        ]

        let x = columnIndex + origin.x
        let y = origin.y - rowIndex

        getParcelPromise(x, y, apolloClient, cache)
          .then(({ data: blockData, error, loading }: BlockDataResult) => {

              let parcel: Parcel|undefined;

              let color: Color = [0, 0, 0, 255];

              if(loading) {

                color = [248, 248, 255, 0.4]

              } else if(error) {

                color = [240, 128, 128, 0.4]

              } else {

                parcel = blockData?.parcels.find(
                  p => !!(
                    parseInt(p.x) === x &&
                    parseInt(p.y) === y
                  )
                )

                if(parcel)
                {
                  let [r, g, b, a] = getParcelColor(
                    parcel,
                    selectedParcel,
                    address(parcel)
                  )

                  r = r / 256
                  g = g / 256
                  b = b / 256

                  let desaturation = 1.0 - getParcelSaturation(parcel, selectedParcel)

                  let luma = 0.3 * r + 0.6 * g + 0.1 * b;

                  color = [
                    (r + desaturation * (luma - r)) * 256,
                    (g + desaturation * (luma - g)) * 256,
                    (b + desaturation * (luma - b)) * 256,
                    a,
                  ]

                }

              }

              context.fillStyle = `rgba(${color.join(`,`)})`

              context.fillRect.apply(context, parcelRect)

            })

      }
    }

  }, [
    context,
    size,
    parcelSize,
    origin,
    selectedParcel
  ])

  const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {

    let canvasX = event.pageX - event.currentTarget.offsetLeft;
    let canvasY = event.pageY - event.currentTarget.offsetTop;

    let atlasX = Math.floor(canvasX / parcelSize)
    let atlasY = Math.floor(canvasY / parcelSize)

    let x = atlasX + origin.x
    let y = origin.y - atlasY

    const parcelPromise = getParcelPromise(x, y, apolloClient, cache)

    parcelPromise
      .then((result: BlockDataResult) => {

        const { data: blockData, error, loading } = result

        const parcel = blockData?.parcels.find(
          p => !!(
            parseInt(p.x) === x &&
            parseInt(p.y) === y
          )
        )

        if(parcel)
        {
          setSelectedParcel(parcel)
        }
        else
        {
          setSelectedParcel(null)
        }

        drawParcels()

      })

  }, [
    canvasRef.current,
    origin,
    parcelSize,
    setSelectedParcel,
  ])

  React.useEffect(function setCanvasContext() {

    const canvas = canvasRef.current;

    const contextSettings: CanvasRenderingContext2DSettings = {
      // alpha: false,
      // colorSpace: PredefinedColorSpace,
      desynchronized: false,
      willReadFrequently: false,
    }

    let context: CanvasRenderingContext2D|null;

    if(canvas === null) {

      setContext(null)

    } else {

      context = canvas.getContext(
        '2d',
        contextSettings
      ) as CanvasRenderingContext2D

      setContext(context)
    }

  }, [
    canvasRef.current,
    setContext,
  ])

  React.useEffect(
    drawParcels,
    [
      context,
      size,
      parcelSize,
      origin,
    ]
  )

  return (
    <nav className="CanvasParcelGrid" data-testid="CanvasParcelGrid">

      <canvas ref={canvasRef}
        width={size.width} height={size.height}
        onMouseMove={(e) => handleMouseMove(e)}
        className={css({
          position: `fixed`,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          backgroundColor: `black`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          '&:hover': {
            cursor: `pointer`,
          },
        })} />

	  </nav>
  )

}

export default CanvasParcelGrid;
