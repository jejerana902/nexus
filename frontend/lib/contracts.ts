// Contract ABIs - These would be imported from compiled contracts
// For now, defining essential ABI fragments

export const TOKEN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS as `0x${string}` || '0x'
export const DEX_ADDRESS = process.env.NEXT_PUBLIC_DEX_ADDRESS as `0x${string}` || '0x'

export const TokenFactoryABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "imageUrl", "type": "string" },
      { "internalType": "string", "name": "website", "type": "string" },
      { "internalType": "string", "name": "twitter", "type": "string" },
      { "internalType": "string", "name": "telegram", "type": "string" }
    ],
    "name": "createToken",
    "outputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "sell",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "internalType": "string", "name": "message", "type": "string" }
    ],
    "name": "addComment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }],
    "name": "getTokenInfo",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "tokenAddress", "type": "address" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "string", "name": "symbol", "type": "string" },
        { "internalType": "string", "name": "description", "type": "string" },
        { "internalType": "string", "name": "imageUrl", "type": "string" },
        { "internalType": "string", "name": "website", "type": "string" },
        { "internalType": "string", "name": "twitter", "type": "string" },
        { "internalType": "string", "name": "telegram", "type": "string" },
        { "internalType": "address", "name": "creator", "type": "address" },
        { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
        { "internalType": "uint256", "name": "totalRaised", "type": "uint256" },
        { "internalType": "bool", "name": "graduated", "type": "bool" }
      ],
      "internalType": "struct ITokenFactory.TokenInfo",
      "name": "info",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "offset", "type": "uint256" },
      { "internalType": "uint256", "name": "limit", "type": "uint256" }
    ],
    "name": "getAllTokens",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "tokenAddress", "type": "address" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "string", "name": "symbol", "type": "string" },
        { "internalType": "string", "name": "description", "type": "string" },
        { "internalType": "string", "name": "imageUrl", "type": "string" },
        { "internalType": "string", "name": "website", "type": "string" },
        { "internalType": "string", "name": "twitter", "type": "string" },
        { "internalType": "string", "name": "telegram", "type": "string" },
        { "internalType": "address", "name": "creator", "type": "address" },
        { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
        { "internalType": "uint256", "name": "totalRaised", "type": "uint256" },
        { "internalType": "bool", "name": "graduated", "type": "bool" }
      ],
      "internalType": "struct ITokenFactory.TokenInfo[]",
      "name": "infos",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }],
    "name": "getComments",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "author", "type": "address" },
        { "internalType": "string", "name": "message", "type": "string" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
      ],
      "internalType": "struct ITokenFactory.Comment[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "trader", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "isBuy", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "nexAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "tokenAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "TokenTraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "totalRaised", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "TokenGraduated",
    "type": "event"
  }
] as const

export const ERC20ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const
