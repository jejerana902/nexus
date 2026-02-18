'use client'

import { useAllTokens } from '@/lib/hooks'
import { TokenCard } from './TokenCard'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

type SortBy = 'newest' | 'marketcap' | 'trending'
type FilterBy = 'all' | 'graduated' | 'not-graduated'

export function TokenList() {
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [filterBy, setFilterBy] = useState<FilterBy>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: tokens, isLoading } = useAllTokens(0, 50)

  // Filter and sort tokens
  const filteredTokens = tokens?.filter((token) => {
    // Apply filter
    if (filterBy === 'graduated' && !token.graduated) return false
    if (filterBy === 'not-graduated' && token.graduated) return false
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
      )
    }
    
    return true
  }).sort((a, b) => {
    // Apply sort
    if (sortBy === 'newest') {
      return Number(b.createdAt) - Number(a.createdAt)
    }
    if (sortBy === 'marketcap') {
      return Number(b.totalRaised) - Number(a.totalRaised)
    }
    // trending would require volume data
    return 0
  }) || []

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-card border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-card border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
        >
          <option value="newest">Newest</option>
          <option value="marketcap">Market Cap</option>
          <option value="trending">Trending</option>
        </select>

        {/* Filter */}
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as FilterBy)}
          className="bg-card border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
        >
          <option value="all">All Tokens</option>
          <option value="graduated">Graduated</option>
          <option value="not-graduated">Not Graduated</option>
        </select>
      </div>

      {/* Token Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredTokens.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No tokens found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTokens.map((token) => (
            <TokenCard key={token.tokenAddress} token={token} />
          ))}
        </div>
      )}
    </div>
  )
}
