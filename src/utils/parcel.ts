import { Parcel } from '../types/parcel'

import { DAOContractAddress } from '../constants/DAOContractAddress'

function address(parcel: Parcel) {
	return (parcel.estate ? parcel.estate : parcel).owner.address
}

function short(address: string) {
	return `${address.slice(0, 5)}…${address.slice(address.length - 4)}`
}

function getGrayscaleFilterValue(
	parcel: Parcel,
	selectedParcel: Parcel|null): number
{
	if(
		selectedParcel &&
		hasSameOwner(parcel, selectedParcel) === false
	)
	{
		return 0.95
	}

	return 0
}


function getParcelColor(
	parcel: Parcel,
	selectedParcel: Parcel|null,
	address: string): string
{
	if (address === DAOContractAddress) {
		return '#000'
	}

	return `#${address.substring(2, 8)}`
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
	getGrayscaleFilterValue,
	getParcelColor,
	hasSameOwner,
}
