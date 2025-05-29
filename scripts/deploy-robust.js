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
  throw new Error(`Transaction ${txHash} not confirmed after ${maxRetries} attempts`);
}

// Helper function to deploy contract with manual confirmation
async function deployContractRobust(contractFactory, args = [], contractName = "Contract") {
  console.log(`\n📦 Deploying ${contractName}...`);
  
  // Deploy the contract
  const contract = await contractFactory.deploy(...args);
  console.log(`📝 ${contractName} deployment transaction sent: ${contract.deploymentTransaction().hash}`);
  
  // Wait for transaction confirmation manually
  const receipt = await waitForTransactionWithRetries(
    contract.runner.provider, 
    contract.deploymentTransaction().hash
  );
  
  // Get the contract address
  const address = await contract.getAddress();
  console.log(`✅ ${contractName} deployed to: ${address}`);
  
  return { contract, address, receipt };
}

async function main() {
  console.log("🚀 Starting robust deployment to", network.name);
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  let deploymentResults = {};

  try {
    // Deploy OSS Token
    const OSSToken = await ethers.getContractFactory("OSSToken");
    const tokenResult = await deployContractRobust(OSSToken, [], "OSS Token");
    deploymentResults.token = tokenResult;

    // Deploy OSS Rewards
    const OSSRewards = await ethers.getContractFactory("OSSRewards");
    const rewardsResult = await deployContractRobust(OSSRewards, [tokenResult.address], "OSS Rewards");
    deploymentResults.rewards = rewardsResult;

    // Deploy OSS DAO
    const OSSDAO = await ethers.getContractFactory("OSSDAO");
    const daoResult = await deployContractRobust(OSSDAO, [tokenResult.address], "OSS DAO");
    deploymentResults.dao = daoResult;

    // Setup permissions
    console.log("\n🔧 Setting up permissions...");
    
    // Add OSS Rewards as a minter for the token
    console.log("📝 Adding OSS Rewards as token minter...");
    const addMinterTx = await tokenResult.contract.addMinter(rewardsResult.address);
    console.log(`📝 Add minter transaction sent: ${addMinterTx.hash}`);
    const addMinterReceipt = await waitForTransactionWithRetries(deployer.provider, addMinterTx.hash);
    console.log("✅ Added OSS Rewards as token minter");

    // Transfer some tokens to the DAO for governance
    console.log("📝 Transferring tokens to DAO treasury...");
    const transferAmount = ethers.parseEther("1000000"); // 1M tokens
    const transferTx = await tokenResult.contract.transfer(daoResult.address, transferAmount);
    console.log(`📝 Transfer transaction sent: ${transferTx.hash}`);
    const transferReceipt = await waitForTransactionWithRetries(deployer.provider, transferTx.hash);
    console.log("✅ Transferred 1M tokens to DAO treasury");

    // Create deployment info
    const deploymentInfo = {
      network: network.name,
      chainId: network.config.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        OSSToken: {
          address: tokenResult.address,
          name: "Open Source Rewards",
          symbol: "OSS",
          deploymentBlock: tokenResult.receipt.blockNumber
        },
        OSSRewards: {
          address: rewardsResult.address,
          deploymentBlock: rewardsResult.receipt.blockNumber
        },
        OSSDAO: {
          address: daoResult.address,
          deploymentBlock: daoResult.receipt.blockNumber
        }
      },
      transactions: {
        tokenDeploy: tokenResult.receipt.hash,
        rewardsDeploy: rewardsResult.receipt.hash,
        daoDeploy: daoResult.receipt.hash,
        addMinter: addMinterReceipt.hash,
        transferToDAO: transferReceipt.hash
      }
    };

    // Save deployment info
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment info saved to:", deploymentFile);

    // Update frontend config
    const frontendConfigPath = path.join(__dirname, "..", "src", "utils", "contracts.js");
    const frontendConfig = `// Auto-generated contract addresses - DO NOT EDIT MANUALLY
// This file is updated by the deployment script

export const CONTRACT_ADDRESSES = {
  TOKEN: "${tokenResult.address}",
  REWARDS: "${rewardsResult.address}",
  DAO: "${daoResult.address}",
};

export const DEPLOYMENT_INFO = {
  network: "${network.name}",
  chainId: ${network.config.chainId},
  deployedAt: "${deploymentInfo.timestamp}",
  deployer: "${deployer.address}",
  gasUsed: {
    token: ${tokenResult.receipt.gasUsed.toString()},
    rewards: ${rewardsResult.receipt.gasUsed.toString()},
    dao: ${daoResult.receipt.gasUsed.toString()},
  },
};
`;

    fs.writeFileSync(frontendConfigPath, frontendConfig);
    console.log("🎨 Frontend config updated:", frontendConfigPath);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Summary:");
    console.log("═══════════════════════════════════");
    console.log("🪙 OSS Token:", tokenResult.address);
    console.log("🎁 OSS Rewards:", rewardsResult.address);
    console.log("🏛️  OSS DAO:", daoResult.address);
    console.log("═══════════════════════════════════");
    
    if (network.name === "holesky" || network.name === "holesky2" || network.name === "holesky3") {
      console.log("\n🔍 Verify contracts on Etherscan:");
      console.log(`npx hardhat verify --network ${network.name} ${tokenResult.address}`);
      console.log(`npx hardhat verify --network ${network.name} ${rewardsResult.address} ${tokenResult.address}`);
      console.log(`npx hardhat verify --network ${network.name} ${daoResult.address} ${tokenResult.address}`);
    }

    console.log("\n💡 Next steps:");
    console.log("1. ✅ Frontend automatically updated with contract addresses");
    console.log("2. 🌐 Start your React app: npm start");
    console.log("3. 🔗 Connect your MetaMask to Holesky testnet");
    console.log("4. 🎯 Test the full platform functionality");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    // Save partial deployment info if any contracts were deployed
    if (Object.keys(deploymentResults).length > 0) {
      console.log("\n📄 Saving partial deployment info...");
      const partialInfo = {
        network: network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        status: "PARTIAL_FAILURE",
        deployedContracts: deploymentResults,
        error: error.message
      };
      
      const deploymentsDir = path.join(__dirname, "..", "deployments");
      if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
      }
      
      const partialFile = path.join(deploymentsDir, `${network.name}-partial.json`);
      fs.writeFileSync(partialFile, JSON.stringify(partialInfo, null, 2));
      console.log("📄 Partial deployment saved to:", partialFile);
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  }); 