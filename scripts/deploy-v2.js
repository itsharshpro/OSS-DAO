const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Helper function to wait for transaction with retries
async function waitForTransactionWithRetries(provider, txHash, maxRetries = 10, delay = 10000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`⏳ Waiting for transaction ${txHash} (attempt ${i + 1}/${maxRetries})...`);
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        return receipt;
      }
      console.log(`⏳ Transaction not yet mined, waiting ${delay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.log(`⚠️ Error checking transaction (attempt ${i + 1}): ${error.message}`);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Transaction confirmation timeout");
}

async function main() {
  console.log("🚀 Starting OSS DAO V2 Deployment...\n");

  // Get network and deployer info
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Configuration:");
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH\n`);

  if (balance < ethers.parseEther("0.01")) {
    throw new Error("❌ Insufficient balance for deployment. Need at least 0.01 ETH");
  }

  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  try {
    // 1. Deploy OSS Token (reuse existing or deploy new)
    console.log("1️⃣ Deploying OSS Token...");
    const OSSToken = await ethers.getContractFactory("OSSToken");
    
    // Deploy with manual transaction handling
    const tokenDeployTx = await OSSToken.getDeployTransaction();
    const tokenTx = await deployer.sendTransaction({
      ...tokenDeployTx,
      gasLimit: 2000000,
    });
    
    console.log(`📤 Token deployment transaction sent: ${tokenTx.hash}`);
    const tokenReceipt = await waitForTransactionWithRetries(ethers.provider, tokenTx.hash);
    
    const ossTokenAddress = tokenReceipt.contractAddress;
    console.log(`✅ OSS Token deployed to: ${ossTokenAddress}\n`);

    // 2. Deploy OSS Rewards V2
    console.log("2️⃣ Deploying OSS Rewards V2...");
    const OSSRewardsV2 = await ethers.getContractFactory("OSSRewardsV2");
    
    const rewardsDeployTx = await OSSRewardsV2.getDeployTransaction(ossTokenAddress);
    const rewardsTx = await deployer.sendTransaction({
      ...rewardsDeployTx,
      gasLimit: 3000000,
    });
    
    console.log(`📤 Rewards V2 deployment transaction sent: ${rewardsTx.hash}`);
    const rewardsReceipt = await waitForTransactionWithRetries(ethers.provider, rewardsTx.hash);
    
    const ossRewardsV2Address = rewardsReceipt.contractAddress;
    console.log(`✅ OSS Rewards V2 deployed to: ${ossRewardsV2Address}\n`);

    // 3. Deploy OSS DAO (reuse existing or deploy new)
    console.log("3️⃣ Deploying OSS DAO...");
    const OSSDAO = await ethers.getContractFactory("OSSDAO");
    
    const daoDeployTx = await OSSDAO.getDeployTransaction(ossTokenAddress);
    const daoTx = await deployer.sendTransaction({
      ...daoDeployTx,
      gasLimit: 2500000,
    });
    
    console.log(`📤 DAO deployment transaction sent: ${daoTx.hash}`);
    const daoReceipt = await waitForTransactionWithRetries(ethers.provider, daoTx.hash);
    
    const ossDAOAddress = daoReceipt.contractAddress;
    console.log(`✅ OSS DAO deployed to: ${ossDAOAddress}\n`);

    // 4. Setup permissions and initial configuration
    console.log("4️⃣ Setting up permissions...");
    
    // Get contract instances
    const ossToken = await ethers.getContractAt("OSSToken", ossTokenAddress);
    const ossRewardsV2 = await ethers.getContractAt("OSSRewardsV2", ossRewardsV2Address);

    // Add minter role to Rewards V2 contract
    console.log("🔐 Adding minter role to Rewards V2 contract...");
    const addMinterTx = await ossToken.addMinter(ossRewardsV2Address);
    console.log(`📤 Add minter transaction sent: ${addMinterTx.hash}`);
    await waitForTransactionWithRetries(ethers.provider, addMinterTx.hash);
    console.log("✅ Minter role added\n");

    // 5. Initial token distribution for testing
    console.log("5️⃣ Initial token distribution...");
    
    // Mint tokens to deployer for testing (10,000 OSS)
    const mintAmount = ethers.parseEther("10000");
    console.log(`🪙 Minting ${ethers.formatEther(mintAmount)} OSS tokens to deployer...`);
    const mintTx = await ossToken.mint(deployer.address, mintAmount);
    console.log(`📤 Mint transaction sent: ${mintTx.hash}`);
    await waitForTransactionWithRetries(ethers.provider, mintTx.hash);
    console.log("✅ Tokens minted\n");

    // Store deployment info
    deploymentInfo.contracts = {
      OSSToken: {
        address: ossTokenAddress,
        txHash: tokenTx.hash,
        blockNumber: tokenReceipt.blockNumber
      },
      OSSRewardsV2: {
        address: ossRewardsV2Address,
        txHash: rewardsTx.hash,
        blockNumber: rewardsReceipt.blockNumber
      },
      OSSDAO: {
        address: ossDAOAddress,
        txHash: daoTx.hash,
        blockNumber: daoReceipt.blockNumber
      }
    };

    // 6. Save deployment information
    console.log("6️⃣ Saving deployment information...");
    
    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment info
    const deploymentFile = path.join(deploymentsDir, `${network.name}-v2.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`💾 Deployment info saved to: ${deploymentFile}`);

    // Update frontend config
    const frontendConfigPath = path.join(__dirname, "..", "src", "utils", "contracts.js");
    const frontendConfig = `// Auto-generated contract addresses - DO NOT EDIT MANUALLY
// This file is updated by the deployment script

export const CONTRACT_ADDRESSES = {
  TOKEN: "${ossTokenAddress}",
  REWARDS: "${ossRewardsV2Address}",
  DAO: "${ossDAOAddress}",
};

export const DEPLOYMENT_INFO = {
  network: "${network.name}",
  chainId: ${Number(network.chainId)},
  deployedAt: "${deploymentInfo.timestamp}",
  deployer: "${deployer.address}",
  version: "v2",
  gasUsed: {
    token: ${tokenReceipt.gasUsed.toString()},
    rewards: ${rewardsReceipt.gasUsed.toString()},
    dao: ${daoReceipt.gasUsed.toString()},
  },
};
`;

    fs.writeFileSync(frontendConfigPath, frontendConfig);
    console.log(`🔄 Frontend config updated: ${frontendConfigPath}`);

    // 7. Display summary
    console.log("\n🎉 OSS DAO V2 Deployment Complete!");
    console.log("=" .repeat(60));
    console.log(`📋 Network: ${network.name} (${network.chainId})`);
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`⏰ Timestamp: ${deploymentInfo.timestamp}`);
    console.log("");
    console.log("📄 Contract Addresses:");
    console.log(`🪙 OSS Token: ${ossTokenAddress}`);
    console.log(`🏆 OSS Rewards V2: ${ossRewardsV2Address}`);
    console.log(`🗳️  OSS DAO: ${ossDAOAddress}`);
    console.log("");
    console.log("🔗 Verification Commands:");
    console.log(`npx hardhat verify --network ${network.name} ${ossTokenAddress}`);
    console.log(`npx hardhat verify --network ${network.name} ${ossRewardsV2Address} ${ossTokenAddress}`);
    console.log(`npx hardhat verify --network ${network.name} ${ossDAOAddress} ${ossTokenAddress}`);
    console.log("");
    console.log("🌐 Block Explorer:");
    console.log(`Token: https://holesky.etherscan.io/address/${ossTokenAddress}`);
    console.log(`Rewards V2: https://holesky.etherscan.io/address/${ossRewardsV2Address}`);
    console.log(`DAO: https://holesky.etherscan.io/address/${ossDAOAddress}`);
    console.log("");
    console.log("💡 Next Steps:");
    console.log("1. Start the React app: npm start");
    console.log("2. Connect your wallet to the app");
    console.log("3. The OSS token will be automatically added to MetaMask");
    console.log("4. Become a validator by staking 1,000 OSS tokens");
    console.log("5. Submit contributions and start earning rewards!");
    console.log("");
    console.log("🚀 Your startup-ready OSS DAO platform is now live!");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  }); 