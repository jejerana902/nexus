'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTokenFactory } from '@/lib/hooks'
import { Loader2, Send } from 'lucide-react'

interface TradePanelProps {
  tokenAddress: `0x${string}`
  tokenSymbol: string
  userBalance?: bigint
}

export function TradePanel({ tokenAddress, tokenSymbol, userBalance }: TradePanelProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState('1')
  
  const { address, isConnected } = useAccount()
  const { buyToken, sellToken, isPending, isConfirming } = useTokenFactory()

  const handleBuy = async () => {
    if (!amount || !address) return
    
    try {
      await buyToken(tokenAddress, amount)
      setAmount('')
    } catch (error) {
      console.error('Buy failed:', error)
    }
  }

  const handleSell = async () => {
    if (!amount || !address || !userBalance) return
    
    try {
      // Convert amount to bigint (assuming 18 decimals)
      const sellAmount = BigInt(Math.floor(parseFloat(amount) * 1e18))
      await sellToken(tokenAddress, sellAmount)
      setAmount('')
    } catch (error) {
      console.error('Sell failed:', error)
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-6">Trade</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'buy'
              ? 'bg-success text-black'
              : 'bg-card-hover text-gray-400 hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'sell'
              ? 'bg-danger text-white'
              : 'bg-card-hover text-gray-400 hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {activeTab === 'buy' ? 'NEX Amount' : `${tokenSymbol} Amount`}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-background-start border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              step="0.000001"
              min="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {activeTab === 'buy' ? 'NEX' : tokenSymbol}
            </div>
          </div>
        </div>

        {/* Estimated Output */}
        <div className="bg-background-start border border-primary/20 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">You receive (estimate)</div>
          <div className="text-lg font-semibold">
            ~ {amount || '0'} {activeTab === 'buy' ? tokenSymbol : 'NEX'}
          </div>
        </div>

        {/* Slippage */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Slippage Tolerance
          </label>
          <div className="flex gap-2">
            {['0.5', '1', '2', '5'].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                  slippage === value
                    ? 'bg-primary text-white'
                    : 'bg-card-hover text-gray-400 hover:text-white'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>

        {/* Trade Button */}
        {!isConnected ? (
          <button
            disabled
            className="w-full py-3 rounded-lg font-semibold bg-gray-700 text-gray-400 cursor-not-allowed"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={activeTab === 'buy' ? handleBuy : handleSell}
            disabled={!amount || isLoading}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'buy'
                ? 'bg-success hover:bg-success/90 text-black'
                : 'bg-danger hover:bg-danger/90 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Processing...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {activeTab === 'buy' ? 'Buy' : 'Sell'} {tokenSymbol}
              </>
            )}
          </button>
        )}
      </div>

      {/* Balance Info */}
      {isConnected && userBalance !== undefined && (
        <div className="mt-4 text-sm text-gray-400">
          Your balance: {(Number(userBalance) / 1e18).toFixed(4)} {tokenSymbol}
        </div>
      )}
    </div>
  )
}
