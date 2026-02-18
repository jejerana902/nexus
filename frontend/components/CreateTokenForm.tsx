'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTokenFactory } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { Loader2, Rocket } from 'lucide-react'

export function CreateTokenForm() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { createToken, isPending, isConfirming, isSuccess } = useTokenFactory()

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    imageUrl: '',
    website: '',
    twitter: '',
    telegram: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Token name is required'
    }
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Token symbol is required'
    } else if (formData.symbol.length > 10) {
      newErrors.symbol = 'Symbol must be 10 characters or less'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !address) return

    try {
      await createToken(formData)
      
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        description: '',
        imageUrl: '',
        website: '',
        twitter: '',
        telegram: '',
      })
    } catch (error) {
      console.error('Failed to create token:', error)
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Token Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Pepe Coin"
            className={`w-full bg-card border ${
              errors.name ? 'border-danger' : 'border-primary/20'
            } rounded-lg px-4 py-3 focus:outline-none focus:border-primary`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-danger text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Token Symbol <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
            placeholder="e.g., PEPE"
            maxLength={10}
            className={`w-full bg-card border ${
              errors.symbol ? 'border-danger' : 'border-primary/20'
            } rounded-lg px-4 py-3 focus:outline-none focus:border-primary`}
            disabled={isLoading}
          />
          {errors.symbol && (
            <p className="text-danger text-sm mt-1">{errors.symbol}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell us about your token..."
            maxLength={500}
            rows={4}
            className={`w-full bg-card border ${
              errors.description ? 'border-danger' : 'border-primary/20'
            } rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none`}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-danger text-sm">{errors.description}</p>
            ) : (
              <div />
            )}
            <p className="text-gray-400 text-sm">{formData.description.length}/500</p>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/image.png"
            className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Website (Optional)
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourtoken.com"
            className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Twitter (Optional)
          </label>
          <input
            type="text"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            placeholder="@yourtoken"
            className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>

        {/* Telegram */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Telegram (Optional)
          </label>
          <input
            type="text"
            value={formData.telegram}
            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            placeholder="t.me/yourtoken"
            className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        {!isConnected ? (
          <button
            type="button"
            disabled
            className="w-full py-4 rounded-lg font-bold text-lg bg-gray-700 text-gray-400 cursor-not-allowed"
          >
            Connect Wallet to Create Token
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-primary to-success hover:opacity-90 text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Creating...'}
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                Create Token
              </>
            )}
          </button>
        )}

        {isSuccess && (
          <div className="bg-success/20 border border-success rounded-lg p-4 text-center">
            <p className="text-success font-semibold">
              Token created successfully! 🎉
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
