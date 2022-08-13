import Parcel from '../types/parcel'

import Color from '../types/color'
import Coordinate from '../types/coordinate'

import { DAOContractAddress } from '../constants/DAOContractAddress'

import { Block } from '../hooks/use-parcel-block'

import AppConfig from '../config/app-config'

function address(parcel: Parcel) {
	return (parcel.estate ? parcel.estate : parcel).owner.address
}

function short(address: string) {
	return `${address.slice(0, 5)}…${address.slice(address.length - 4)}`
}

function getBlockCoordinate(
	parcelX: number,
	parcelY: number): Coordinate
{
	return {
		x: parcelX - (parcelX % AppConfig.ParcelBlockWidth),
		y: parcelY - (parcelY % AppConfig.ParcelBlockWidth),
	}
}

function findParcel(
	block: Block,
	x: number,
	y: number): Parcel|undefined
{
	return block?.parcels.find(
		p => parseInt(p.x) === x && parseInt(p.y) === y
	)
}

function getParcelSaturation(
	parcel: Parcel,
	selectedParcel: Parcel|null): number
{
	if(
		selectedParcel &&
		hasSameOwner(parcel, selectedParcel) === false
	)
	{
		return 0.05
	}

	return 1.00
}

function getParcelColor(
	parcel: Parcel,
	selectedParcel: Parcel|null,
	address: string): Color
{
	if (address === DAOContractAddress) {
		return [0, 0, 0, 255]
	}

	//    0            12           24           36
	// 0x 9a6ebe7e2a77 22f8200d0ffb 63a1f6406a0d 7dce

	address = address.slice(2)

	let r = parseInt(address.slice(0, 12), 16) % 256
	let g = parseInt(address.slice(12, 24), 16) % 256
	let b = parseInt(address.slice(24, 36), 16) % 256
	let a = 255

	return [r, g, b, a]
}

function hasSameOwner(
	parcel: Parcel,
	selectedParcel: Parcel): boolean
{

	if (selectedParcel.estate || parcel.estate)
	{
		if(selectedParcel.estate && parcel.estate)
		{
			if(selectedParcel.estate.owner.address === parcel.estate.owner.address)
			{
				return true
			}
		}
		else if(selectedParcel.estate)
		{
			if(selectedParcel.estate.owner.address === parcel.owner.address)
			{
				return true
			}
		}
		else if(selectedParcel.owner.address === parcel.estate?.owner.address)
		{
			return true
		}
	} else if (parcel.owner.address === selectedParcel.owner.address) {
		return true
	}

	return false

}

export {
	address,
	short,
	getParcelSaturation,
	getParcelColor,
	hasSameOwner,
	getBlockCoordinate,
	findParcel,
}
