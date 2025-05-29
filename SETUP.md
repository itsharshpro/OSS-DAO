# 🚀 Complete Setup Guide for OSS DAO Platform

This guide will help you set up and run the complete OSS DAO platform with smart contracts and frontend.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **MetaMask** browser extension
- **Holesky testnet ETH** (for deployment and testing)

## 🛠️ Step 1: Initial Setup

### Clone and Install Frontend Dependencies

```bash
# Install frontend dependencies
npm install

# If you encounter any errors, try:
npm install --legacy-peer-deps
```

## 🔧 Step 2: Smart Contracts Setup

### Initialize Hardhat Environment

```bash
# Copy the contracts package.json
cp contracts-package.json package-contracts.json

# Install Hardhat and contract dependencies
npm install --prefix . hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv

# Or manually install the required packages:
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
npm install @openzeppelin/contracts
```

### Environment Configuration

```bash
# Copy the environment template
cp env.example .env

# Edit .env with your settings:
# PRIVATE_KEY=your_wallet_private_key_here
# ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**⚠️ Security Note**: Never commit your `.env` file. Your private key should be kept secure.

## 🌐 Step 3: Get Holesky Testnet ETH

1. **Add Holesky to MetaMask** (will be prompted automatically when connecting)
2. **Get test ETH** from any Holesky faucet:
   - [Holesky Faucet](https://faucet.holesky.etherscan.io/)
   - [QuickNode Faucet](https://faucet.quicknode.com/ethereum/holesky)

## 📄 Step 4: Compile and Deploy Smart Contracts

### Compile Contracts

```bash
# Compile the smart contracts
npx hardhat compile
```

### Deploy to Local Network (Testing)

```bash
# Start local Hardhat network
npx hardhat node

# In another terminal, deploy to local network
npx hardhat run scripts/deploy.js --network hardhat
```

### Deploy to Holesky Testnet

```bash
# Deploy to Holesky testnet
npx hardhat run scripts/deploy.js --network holesky
```

After successful deployment, you'll see output like:
```
🚀 Starting deployment to holesky
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.5 ETH

📦 Deploying OSS Token...
✅ OSS Token deployed to: 0x...

📦 Deploying OSS Rewards...
✅ OSS Rewards deployed to: 0x...

📦 Deploying OSS DAO...
✅ OSS DAO deployed to: 0x...

🔧 Setting up permissions...
✅ Added OSS Rewards as token minter
✅ Transferred 1M tokens to DAO treasury

🎨 Frontend config updated: src/utils/contracts.ts
```

## 🎨 Step 5: Start the Frontend

```bash
# Start the React development server
npm start
```

The application will open at `http://localhost:3000`

## 🧪 Step 6: Test the Platform

### Frontend Testing

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Switch Network**: Confirm switching to Holesky testnet
3. **Explore Features**:
   - Submit a test contribution
   - Create a governance proposal
   - Vote on existing proposals
   - Check your profile and stats

### Smart Contract Testing

```bash
# Run contract tests
npx hardhat test

# Test specific contract
npx hardhat test test/OSSToken.test.js
```

## 🔍 Step 7: Verify Contracts (Optional)

If you deployed to Holesky, verify your contracts on Etherscan:

```bash
# Verify OSS Token
npx hardhat verify --network holesky <OSS_TOKEN_ADDRESS>

# Verify OSS Rewards  
npx hardhat verify --network holesky <OSS_REWARDS_ADDRESS> <OSS_TOKEN_ADDRESS>

# Verify OSS DAO
npx hardhat verify --network holesky <OSS_DAO_ADDRESS> <OSS_TOKEN_ADDRESS>
```

## 📁 Project Structure

```
oss-dao-platform/
├── contracts/                 # Smart contracts
│   ├── OSSToken.sol          # ERC-20 reward token
│   ├── OSSRewards.sol        # Contribution rewards
│   └── OSSDAO.sol            # DAO governance
├── scripts/                  # Deployment scripts
│   └── deploy.js             # Main deployment script
├── test/                     # Contract tests
│   └── OSSToken.test.js      # Token contract tests
├── src/                      # React frontend
│   ├── components/           # UI components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts
│   └── utils/               # Utilities
├── deployments/             # Contract deployment info
├── hardhat.config.js        # Hardhat configuration
├── package.json            # Frontend dependencies
└── README.md              # Project documentation
```

## 🐛 Troubleshooting

### Common Issues

**1. "Module not found" errors**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**2. MetaMask connection issues**
- Ensure MetaMask is unlocked
- Check if you're on the correct network (Holesky)
- Try refreshing the page

**3. Contract deployment fails**
- Check your ETH balance on Holesky
- Verify your private key in `.env`
- Ensure RPC URL is working

**4. Frontend compilation errors**
```bash
# Install missing dependencies
npm install @types/react @types/react-dom

# If using older Node.js version
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### Getting Help

1. **Check console logs** for detailed error messages
2. **Verify network connection** to Holesky
3. **Ensure sufficient test ETH** for transactions
4. **Check contract addresses** in deployment output

## 🔄 Development Workflow

### Making Changes

1. **Smart Contracts**: Edit in `contracts/`, compile, test, and redeploy
2. **Frontend**: Changes auto-reload with `npm start`
3. **Testing**: Run `npx hardhat test` after contract changes

### Redeployment

If you need to redeploy contracts:

```bash
# Clean previous deployments
npx hardhat clean

# Compile and deploy again
npx hardhat compile
npx hardhat run scripts/deploy.js --network holesky
```

## 🚀 Production Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to hosting service (Vercel, Netlify, etc.)
# The build/ folder contains the static files
```

### Mainnet Deployment

⚠️ **WARNING**: Before deploying to mainnet:

1. **Audit smart contracts** thoroughly
2. **Test extensively** on testnets
3. **Use a hardware wallet** for mainnet deployment
4. **Consider using a multisig** for contract ownership

## 📚 Next Steps

1. **Customize the platform** for your specific use case
2. **Add more contribution categories** if needed
3. **Implement additional governance features**
4. **Set up automated testing** and CI/CD
5. **Plan token economics** and initial distribution

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Congratulations!** You now have a fully functional decentralized platform for rewarding open-source contributors! 