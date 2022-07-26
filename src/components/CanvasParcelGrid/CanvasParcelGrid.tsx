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

import {
  address,
  getParcelSaturation,
  getParcelColor,
  getBlockCoordinate,
  findParcel
} from '../../utils/parcel';

type BlockDataResultPromiseCache = {
  [key: string]: Promise<BlockDataResult>
}

const getBlockPromise = (
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
  selectedParcel: _selectedParcel,
  setSelectedParcel: _setSelectedParcel,
}) => {

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const originRef = React.useRef<Coordinate>(origin)
  const parcelSizeRef = React.useRef<number>(parcelSize)

  const selectedParcelRef = React.useRef<Parcel|null>(_selectedParcel)
  const setSelectedParcelRef = React.useRef<(parcel: Parcel|null) => void>(_setSelectedParcel)

  React.useEffect(() => {
    originRef.current = origin
  }, [origin])

  React.useEffect(() => {
    parcelSizeRef.current = parcelSize
  }, [parcelSize])

  React.useEffect(() => {
    selectedParcelRef.current = _selectedParcel
  }, [_selectedParcel])

  React.useEffect(() => {
    setSelectedParcelRef.current = _setSelectedParcel
  }, [_setSelectedParcel])

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

        let x = columnIndex + originRef.current.x
        let y = originRef.current.y - rowIndex

        let capturedOrigin = originRef.current
        let capturedParcelSize = parcelSizeRef.current

        getBlockPromise(x, y, apolloClient, cache)

          .then(({ data: block, error, loading }: BlockDataResult) => {

              if(JSON.stringify(capturedOrigin) !== JSON.stringify(originRef.current)) {
                return;
              }

              if(capturedParcelSize !== parcelSizeRef.current) {
                return;
              }

              let parcel: Parcel|undefined;

              let color: Color = [0, 0, 0, 255];

              if(loading) {

                color = [248, 248, 255, 0.4]

              } else if(error) {

                color = [240, 128, 128, 0.4]

              } else {

                parcel = findParcel(block || { parcels: []}, x, y)

                if(parcel)
                {
                  let [r, g, b, a] = getParcelColor(
                    parcel,
                    selectedParcelRef.current,
                    address(parcel)
                  )

                  r = r / 256
                  g = g / 256
                  b = b / 256

                  let desaturation = 1.0 - getParcelSaturation(parcel, selectedParcelRef.current)

                  let luma = 0.3 * r + 0.6 * g + 0.1 * b;

                  color = [
                    (r + desaturation * (luma - r)) * 256,
                    (g + desaturation * (luma - g)) * 256,
                    (b + desaturation * (luma - b)) * 256,
                    a,
                  ]

                }

              }

              let size = parcelSizeRef.current
              let pixelX = columnIndex * size
              let pixelY = rowIndex * size

              context.fillStyle = `rgba(${color.join(`,`)})`
              context.fillRect(pixelX, pixelY, size, size)

            })

      }
    }

  }, [
    context,
    size,
    parcelSizeRef.current,
    originRef.current,
    selectedParcelRef.current
  ])

  const drawParcelsRef = React.useRef(drawParcels)

  React.useEffect(() => {
    drawParcelsRef.current = drawParcels
  }, [drawParcels])

  const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {

    let canvasX = event.pageX - event.currentTarget.offsetLeft;
    let canvasY = event.pageY - event.currentTarget.offsetTop;

    let atlasX = Math.floor(canvasX / parcelSize)
    let atlasY = Math.floor(canvasY / parcelSize)

    let x = atlasX + originRef.current.x
    let y = originRef.current.y - atlasY

    let capturedOrigin = originRef.current
    let capturedParcelSize = parcelSizeRef.current

    getBlockPromise(x, y, apolloClient, cache)

      .then((result: BlockDataResult) => {

          if(JSON.stringify(capturedOrigin) !== JSON.stringify(originRef.current)) {
            return;
          }

          if(capturedParcelSize !== parcelSizeRef.current) {
            return;
          }

          const { data: block, error, loading } = result

          const parcel = findParcel(block || { parcels: []}, x, y)

          if(parcel)
          {
            setSelectedParcelRef.current(parcel)
          }
          else
          {
            setSelectedParcelRef.current(null)
          }

          window.setTimeout(() => {
            drawParcelsRef.current()
          })

        })

  }, [
    canvasRef.current,
    originRef.current,
    parcelSizeRef.current,
    selectedParcelRef.current,
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
      parcelSizeRef.current,
      originRef.current,
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
