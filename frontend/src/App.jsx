// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import VoterPanel from './components/VoterPanel';
import CandidateList from './components/CandidateList';
import {
  connectWallet,
  getCurrentAccount,
  isUserAdmin,
  getVoterInfo,
  isElectionRunning,
  getAllCandidates,
  getWinner,
  onAccountsChanged,
  onChainChanged
} from './ethereum/evoting';
import './App.css';

function App() {
  // State management
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [voterInfo, setVoterInfo] = useState({
    registered: false,
    voted: false,
    votedFor: 0
  });
  const [electionRunning, setElectionRunning] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Connect wallet handler
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const accounts = await connectWallet();
      if (accounts.length === 0) {
        setError('No accounts found. Please create an account in MetaMask.');
        return;
      }

      const currentAccount = accounts[0];
      setAccount(currentAccount);
      
      // Load all data
      await loadAllData(currentAccount);

    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
    } finally {
      setLoading(false);
    }
  };

  // Load all data from blockchain
  const loadAllData = async (accountAddress = null) => {
    try {
      const address = accountAddress || account;
      
      // Check admin status
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);

      // Get voter information
      const voter = await getVoterInfo(address);
      setVoterInfo(voter);

      // Get election status
      const running = await isElectionRunning();
      setElectionRunning(running);

      // Get all candidates
      const candidatesList = await getAllCandidates();
      setCandidates(candidatesList);

      // Get winner if election ended
      if (!running) {
        try {
          const winnerData = await getWinner();
          setWinner(winnerData);
        } catch (err) {
          // No winner yet or no votes
          setWinner(null);
        }
      } else {
        setWinner(null);
      }

    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Setup event listeners
  useEffect(() => {
    // Listen for account changes
    onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsAdmin(false);
        setVoterInfo({ registered: false, voted: false, votedFor: 0 });
      } else {
        window.location.reload();
      }
    });

    // Listen for chain changes
    onChainChanged(() => {
      window.location.reload();
    });
  }, []);

  // Auto-refresh data every 5 seconds when connected
  useEffect(() => {
    if (account) {
      const interval = setInterval(() => {
        loadAllData();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [account]);

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🗳️ Decentralized E-Voting System</h1>
          <p className="header-subtitle">Secure, Transparent, Blockchain-Powered</p>
        </div>
        
        {!account ? (
          <button onClick={handleConnectWallet} className="connect-btn" disabled={loading}>
            {loading ? '⏳ Connecting...' : '🦊 Connect MetaMask'}
          </button>
        ) : (
          <div className="account-info">
            <div className="account-address">
              <span className="address-label">Connected:</span>
              <span className="address-value">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
            <div className="role-badge">
              {isAdmin ? '👑 Admin' : voterInfo.registered ? '✅ Registered Voter' : '⏳ Unregistered'}
            </div>
          </div>
        )}
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          ❌ {error}
        </div>
      )}

      {/* Main Content */}
      {account && (
        <main className="main-content">
          {/* Admin Panel */}
          {isAdmin && (
            <AdminPanel 
              electionRunning={electionRunning}
              onUpdate={loadAllData}
            />
          )}

          {/* Voter Panel */}
          {!isAdmin && (
            <VoterPanel
              isRegistered={voterInfo.registered}
              hasVoted={voterInfo.voted}
              votedFor={voterInfo.votedFor}
              electionRunning={electionRunning}
              candidates={candidates}
            />
          )}

          {/* Candidate List */}
          <CandidateList
            candidates={candidates}
            canVote={voterInfo.registered && !voterInfo.voted}
            electionRunning={electionRunning}
            winner={winner}
            onUpdate={loadAllData}
          />

          {/* Refresh Button */}
          <div className="refresh-section">
            <button onClick={() => loadAllData()} className="refresh-btn" disabled={loading}>
              🔄 Refresh Data
            </button>
          </div>
        </main>
      )}

      {/* Welcome Screen */}
      {!account && !error && (
        <div className="welcome-screen">
          <div className="welcome-card">
            <h2>Welcome to E-Voting dApp</h2>
            <p>Connect your MetaMask wallet to participate in secure, blockchain-based elections.</p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <h3>Secure</h3>
                <p>Votes recorded on blockchain</p>
              </div>
              <div className="feature">
                <span className="feature-icon">👁️</span>
                <h3>Transparent</h3>
                <p>Real-time vote counting</p>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <h3>Fast</h3>
                <p>Instant vote verification</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Built with Solidity, Hardhat, React & ethers.js</p>
        <p>© 2025 E-Voting dApp | Blockchain-Powered Democracy</p>
      </footer>
    </div>
  );
}

export default App;