import { CreateTokenForm } from '@/components/CreateTokenForm'

export default function CreateTokenPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Create Your Token
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Launch your own token on Nexus Layer 1. No coding required!
        </p>
      </div>

      <CreateTokenForm />

      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4">💡 Tips for Success</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-success">✓</span>
              <span>Choose a catchy and memorable name</span>
            </li>
            <li className="flex gap-2">
              <span className="text-success">✓</span>
              <span>Write a clear description that explains your token's purpose</span>
            </li>
            <li className="flex gap-2">
              <span className="text-success">✓</span>
              <span>Use a high-quality image (square format works best)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-success">✓</span>
              <span>Include social links to build community trust</span>
            </li>
            <li className="flex gap-2">
              <span className="text-success">✓</span>
              <span>Be the first to buy your token to bootstrap liquidity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
