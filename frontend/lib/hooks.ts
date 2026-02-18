import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TokenFactoryABI, TOKEN_FACTORY_ADDRESS, ERC20ABI } from './contracts'
import { parseEther } from 'viem'

export function useTokenFactory() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const createToken = async (data: {
    name: string
    symbol: string
    description: string
    imageUrl: string
    website?: string
    twitter?: string
    telegram?: string
  }) => {
    return writeContract({
      address: TOKEN_FACTORY_ADDRESS,
      abi: TokenFactoryABI,
      functionName: 'createToken',
      args: [
        data.name,
        data.symbol,
        data.description,
        data.imageUrl,
        data.website || '',
        data.twitter || '',
        data.telegram || '',
      ],
    })
  }

  const buyToken = async (tokenAddress: `0x${string}`, nexAmount: string) => {
    return writeContract({
      address: TOKEN_FACTORY_ADDRESS,
      abi: TokenFactoryABI,
      functionName: 'buy',
      args: [tokenAddress],
      value: parseEther(nexAmount),
    })
  }

  const sellToken = async (tokenAddress: `0x${string}`, tokenAmount: bigint) => {
    return writeContract({
      address: TOKEN_FACTORY_ADDRESS,
      abi: TokenFactoryABI,
      functionName: 'sell',
      args: [tokenAddress, tokenAmount],
    })
  }

  const addComment = async (tokenAddress: `0x${string}`, message: string) => {
    return writeContract({
      address: TOKEN_FACTORY_ADDRESS,
      abi: TokenFactoryABI,
      functionName: 'addComment',
      args: [tokenAddress, message],
    })
  }

  return {
    createToken,
    buyToken,
    sellToken,
    addComment,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

export function useTokenInfo(tokenAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getTokenInfo',
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })
}

export function useAllTokens(offset: number = 0, limit: number = 20) {
  return useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getAllTokens',
    args: [BigInt(offset), BigInt(limit)],
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  })
}

export function useTokenCount() {
  return useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getTokenCount',
    query: {
      refetchInterval: 10000,
    },
  })
}

export function useTokenComments(tokenAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getComments',
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress,
      refetchInterval: 5000,
    },
  })
}

export function useTokenBalance(tokenAddress: `0x${string}` | undefined, userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!userAddress,
      refetchInterval: 5000,
    },
  })
}

export function useTokenSupply(tokenAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!tokenAddress,
      refetchInterval: 5000,
    },
  })
}
