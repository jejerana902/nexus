const hre = require("hardhat");

async function main() {
  console.log("Deploying NexusPump contracts to Nexus Testnet III...");
  
  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "NEX");
  
  // Deploy DEX
  console.log("\n1. Deploying NexusPumpDEX...");
  const NexusPumpDEX = await hre.ethers.getContractFactory("NexusPumpDEX");
  const dex = await NexusPumpDEX.deploy();
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("NexusPumpDEX deployed to:", dexAddress);
  
  // Deploy TokenFactory (deployer is fee recipient)
  console.log("\n2. Deploying TokenFactory...");
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(dexAddress, deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("TokenFactory deployed to:", factoryAddress);
  
  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Add these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=${factoryAddress}`);
  console.log(`NEXT_PUBLIC_DEX_ADDRESS=${dexAddress}`);
  
  console.log("\n🔗 View on Explorer:");
  console.log(`TokenFactory: https://nexus.testnet.blockscout.com/address/${factoryAddress}`);
  console.log(`NexusPumpDEX: https://nexus.testnet.blockscout.com/address/${dexAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
