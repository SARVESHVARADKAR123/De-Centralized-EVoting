# E-Voting Decentralized Application (dApp)

## 🗳️ Project Overview

A secure, transparent blockchain-based electronic voting system built using Solidity, React, and Hardhat. This decentralized application ensures tamper-proof voting with clear administrative controls and voter interfaces.

## ✨ Features

- 🔒 Secure blockchain-based voting
- 👥 Admin can add and manage candidates
- 🗳️ Voters can cast a single vote
- 📊 Transparent vote counting
- 🏆 Automated winner determination

## 🛠️ Technology Stack

- **Blockchain**: Ethereum, Solidity
- **Smart Contract Development**: Hardhat
- **Frontend**: React.js
- **Web3 Interaction**: ethers.js

## 📋 Prerequisites

- Node.js (v16+ recommended)
- MetaMask Browser Extension
- Ethereum Wallet

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/evoting-dapp.git
cd evoting-dapp
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 3. Blockchain Setup

#### Compile Smart Contracts
```bash
npx hardhat compile
```

#### Run Local Blockchain
```bash
npx hardhat node
```

### 4. Deploy Contracts
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Start Frontend
```bash
cd frontend
npm start
```

## 🔐 Smart Contract Workflow

1. Admin adds candidates
2. Admin starts voting period
3. Voters cast their votes
4. Admin ends voting
5. Winner is automatically determined

## 🛡️ Security Features

- Only admin can add candidates
- One vote per voter
- Immutable vote recording
- Transparent voting process

## 🧪 Testing

```bash
# Run smart contract tests
npx hardhat test

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## ⚠️ Disclaimer

This is a demonstration project. Conduct thorough security audits before using in production environments.

## 🔗 Useful Resources

- [Ethereum Documentation](https://ethereum.org/developers)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
