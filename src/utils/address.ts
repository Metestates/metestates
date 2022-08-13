// See: https://github.com/MetaMask/metamask-extension/blob/develop/ui/helpers/utils/util.js#L207-L215

const TruncatedNameCharLimit = 11;
const TruncatedAddressStartChars = 5;
const TruncatedAddressEndChars = 4;

export const shortenAddress = (
	address: string = '') =>
{

	if(address.length < TruncatedNameCharLimit) {
		return address
	}

	let [start, end] = [
		address.slice(0, TruncatedAddressStartChars),
		address.slice(-TruncatedAddressEndChars),
	]

	return `${start}…${end}`

}
