import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import {
	ERC20Interface,
	useCall,
} from '@usedapp/core'

export type UseTokenBalanceHookResult = [
	BigNumber|undefined,
	Error|undefined,
	boolean,
]

const useTokenBalance = (
	tokenAddress: string,
	address?: string): UseTokenBalanceHookResult =>
{

	let result;

	result = useCall(
		address &&
		{
			contract: new Contract(tokenAddress, ERC20Interface),
			method: 'balanceOf',
			args: [address],
		}
	)

	if(!address)
	{
		return [undefined, undefined, true]
	}

	if(!result)
	{
		return [undefined, undefined, false]
	}

	let { value, error } = result

	if(error) {
		return [undefined, error, false]
	}

	const { balance } = value

	return [balance, undefined, false]

}

export default useTokenBalance
