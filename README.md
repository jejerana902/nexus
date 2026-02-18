# NexusPump 🚀

A full-featured token launchpad platform on **Nexus Layer 1 Testnet III** blockchain. Create and trade meme tokens with automated exponential bonding curves, and watch them graduate to the DEX when they hit the target market cap!

## 🌟 Features

- **🎨 Token Creation**: Launch your own ERC20 token with custom metadata (name, symbol, description, image, social links)
- **📈 Bonding Curve Trading**: Buy and sell tokens via an exponential bonding curve - price increases with demand
- **👑 King of the Hill**: Automatic graduation to DEX at 69 NEX market cap threshold
- **💬 On-Chain Comments**: Community engagement with on-chain comments for each token
- **📊 Real-time Charts**: TradingView-powered price charts
- **💰 Auto-Liquidity**: When tokens graduate, liquidity is automatically added to the NexusPump DEX
- **🎯 Trending Tokens**: See which tokens are gaining momentum
- **👤 User Profiles**: Track tokens created by any address

## 🏗️ Tech Stack

### Smart Contracts
- **Solidity 0.8.20**
- **Hardhat** for development and deployment
- **OpenZeppelin** contracts for secure ERC20 implementation

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **wagmi v2** + **viem** for Web3 integration
- **lightweight-charts** for price visualization
- **Lucide React** for icons

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MetaMask** or compatible Web3 wallet
- **Test NEX tokens** from the [Nexus Faucet](https://faucet.nexus.xyz)

## 🌐 Nexus Testnet III Configuration

Add Nexus Testnet III to MetaMask:

- **Network Name**: Nexus Layer 1 Testnet III
- **RPC URL**: `https://testnet.rpc.nexus.xyz`
- **Chain ID**: `3945`
- **Currency Symbol**: `NEX`
- **Block Explorer**: `https://nexus.testnet.blockscout.com`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jejerana902/nexus.git
cd nexus
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Smart Contracts
PRIVATE_KEY=your_private_key_here

# Frontend
NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_DEX_ADDRESS=0x...
NEXT_PUBLIC_NEXUS_RPC_URL=https://testnet.rpc.nexus.xyz
NEXT_PUBLIC_NEXUS_WS_URL=wss://testnet.rpc.nexus.xyz
NEXT_PUBLIC_NEXUS_EXPLORER_URL=https://nexus.testnet.blockscout.com
NEXT_PUBLIC_NEXUS_CHAIN_ID=3945
```

⚠️ **Never commit your private key!** Use a test wallet only.

### 4. Deploy Smart Contracts

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Deploy to Nexus Testnet III
npx hardhat run scripts/deploy.js --network nexus
```

After deployment, copy the contract addresses to your `.env` file.

### 5. Run the Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nexuspump/
├── contracts/                    # Solidity smart contracts
│   ├── contracts/
│   │   ├── BondingCurve.sol      # Exponential bonding curve math
│   │   ├── TokenFactory.sol      # Factory + buy/sell + comments
│   │   ├── NexusPumpToken.sol    # ERC20 token with metadata
│   │   ├── NexusPumpDEX.sol      # Simple AMM DEX
│   │   └── interfaces/
│   │       └── INexusPump.sol    # Contract interfaces
│   ├── scripts/
│   │   └── deploy.js             # Deployment script
│   └── hardhat.config.js         # Hardhat configuration
├── frontend/                     # Next.js frontend
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── create/               # Token creation page
│   │   ├── token/[address]/      # Token detail page
│   │   └── profile/[address]/    # User profile page
│   ├── components/               # React components
│   ├── lib/                      # Utilities and hooks
│   └── public/                   # Static assets
└── README.md
```

## 🎯 How It Works

### 1. Token Creation
Anyone can create a token by providing:
- Name, Symbol, Description
- Image URL
- Optional: Website, Twitter, Telegram

A 1% creation fee goes to the platform.

### 2. Bonding Curve Trading

Tokens use an **exponential bonding curve** for pricing:

```
price = BASE_PRICE * e^(k * supply)
```

- Initial price: ~0.000001 NEX
- Price increases exponentially as supply grows
- 1% fee on all trades

**Buy**: Send NEX → Receive tokens (minted)  
**Sell**: Send tokens → Receive NEX (tokens burned)

### 3. Graduation ("King of the Hill")

When a token reaches **69 NEX** in total raised:
1. Token is marked as "graduated"
2. Additional tokens are minted for liquidity (50% of supply)
3. All NEX in the bonding curve + new tokens are added to the DEX
4. Trading via bonding curve stops
5. Token is now tradeable on the NexusPumpDEX with full liquidity

### 4. NexusPumpDEX

Simple AMM (Automated Market Maker) using constant product formula:
```
x * y = k
```

- 0.3% swap fee
- Fully decentralized
- No impermanent loss concerns (liquidity locked)

## 📜 Smart Contract Architecture

### BondingCurve.sol
Library containing bonding curve math:
- `calculatePurchaseReturn()` - Calculate tokens to mint for NEX amount
- `calculateSaleReturn()` - Calculate NEX to return for token amount
- `getPrice()` - Get current token price
- `getMarketCap()` - Calculate total market cap

### NexusPumpToken.sol
ERC20 token with:
- Standard ERC20 functions
- Metadata (description, image, social links)
- Creator tracking
- Graduation status
- Only factory can mint/burn

### TokenFactory.sol
Main contract handling:
- Token creation
- Buy/sell via bonding curve
- Comments system
- Graduation logic
- Token listing and info

### NexusPumpDEX.sol
Simple DEX for graduated tokens:
- Add liquidity (called by factory)
- Swap NEX for tokens
- Swap tokens for NEX
- 0.3% fee

## 🎨 Frontend Pages

### Homepage (`/`)
- King of the Hill section
- Trending tokens
- All tokens list with filters
- Search functionality

### Create Token (`/create`)
- Token creation form
- Real-time validation
- Preview card
- Tips for success

### Token Detail (`/token/[address]`)
- Token information and stats
- Price chart
- Buy/Sell panel
- Comments section
- Progress bar to graduation

### Profile (`/profile/[address]`)
- User's created tokens
- Stats (tokens created, holdings, volume)
- Trade history (coming soon)

## 🔒 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Only factory can mint/burn tokens
- **Input Validation**: All inputs validated on-chain
- **Slippage Protection**: Frontend includes slippage tolerance
- **Fee Protection**: 1% platform fee prevents abuse

## 🛠️ Development

### Compile Contracts
```bash
cd contracts
npx hardhat compile
```

### Run Tests (if implemented)
```bash
cd contracts
npx hardhat test
```

### Deploy to Local Network
```bash
npx hardhat node  # Terminal 1
npx hardhat run scripts/deploy.js --network localhost  # Terminal 2
```

### Build Frontend for Production
```bash
cd frontend
npm run build
npm start
```

## 📊 Gas Optimization

The contracts are optimized for gas efficiency:
- Using libraries for complex math
- Minimal storage reads/writes
- Efficient data structures
- Batch operations where possible

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Nexus Testnet Explorer**: https://nexus.testnet.blockscout.com
- **Nexus Faucet**: https://faucet.nexus.xyz
- **Nexus Documentation**: https://docs.nexus.xyz

## ⚠️ Disclaimer

This is experimental software deployed on a testnet. Use at your own risk. Never invest more than you can afford to lose. This is not financial advice.

## 🎉 Acknowledgments

- Inspired by pump.fun
- Built for Nexus Layer 1
- Powered by the Nexus community

---

**Built with ❤️ for the Nexus ecosystem**

*For support, open an issue on GitHub or reach out to the Nexus community.*
