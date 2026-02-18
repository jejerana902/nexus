import { KingOfTheHill } from '@/components/KingOfTheHill'
import { TrendingTokens } from '@/components/TrendingTokens'
import { TokenList } from '@/components/TokenList'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gradient mb-4">
          Welcome to NexusPump
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          The premier token launchpad on Nexus Layer 1. Create, trade, and watch your tokens graduate to the DEX!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <KingOfTheHill />
        </div>
        <div>
          <TrendingTokens />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">All Tokens</h2>
          <TokenList />
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">How it works</h3>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</span>
                <span>Create your token with just a few clicks</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</span>
                <span>Trade on the bonding curve - price increases with demand</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</span>
                <span>Reach 69 NEX market cap to graduate to the DEX</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">4</span>
                <span>Liquidity auto-added, trade freely on DEX!</span>
              </li>
            </ol>
          </div>

          <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span className="font-semibold">Nexus L1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chain ID</span>
                <span className="font-semibold">3945</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trading Fee</span>
                <span className="font-semibold">1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Graduation</span>
                <span className="font-semibold">69 NEX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
