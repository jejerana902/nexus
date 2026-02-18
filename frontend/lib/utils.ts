import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatUnits, parseUnits } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const formatted = formatUnits(amount, decimals)
  const num = parseFloat(formatted)
  
  if (num === 0) return '0'
  if (num < 0.000001) return '< 0.000001'
  if (num < 1) return num.toFixed(6)
  if (num < 1000) return num.toFixed(4)
  if (num < 1000000) return (num / 1000).toFixed(2) + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M'
  return (num / 1000000000).toFixed(2) + 'B'
}

export function formatNEX(amount: bigint): string {
  return formatTokenAmount(amount, 18)
}

export function parseNEX(amount: string): bigint {
  try {
    return parseUnits(amount, 18)
  } catch {
    return 0n
  }
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function calculateProgress(totalRaised: bigint, threshold: bigint): number {
  const raised = Number(formatUnits(totalRaised, 18))
  const target = Number(formatUnits(threshold, 18))
  return Math.min((raised / target) * 100, 100)
}

export function formatPercentage(value: number): string {
  if (value === 0) return '0%'
  if (Math.abs(value) < 0.01) return '< 0.01%'
  return value.toFixed(2) + '%'
}
