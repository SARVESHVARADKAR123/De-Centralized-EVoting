// frontend/src/components/AdminPanel.jsx
import React, { useState } from 'react';
import { addCandidate, registerVoter, startElection, endElection } from '../ethereum/evoting';
import './AdminPanel.css';

/**
 * AdminPanel Component
 * Provides interface for admin to manage the election
 */
const AdminPanel = ({ electionRunning, onUpdate }) => {
  const [candidateName, setCandidateName] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear messages after 3 seconds
  const showMessage = (type, message) => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 3000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Handle add candidate
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      showMessage('error', 'Please enter a candidate name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await addCandidate(candidateName);
      setCandidateName('');
      showMessage('success', `Candidate "${candidateName}" added successfully!`);
      onUpdate();
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to add candidate. Election may be running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle register voter
  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    if (!voterAddress.trim()) {
      showMessage('error', 'Please enter a voter address');
      return;
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) {
      showMessage('error', 'Invalid Ethereum address format');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await registerVoter(voterAddress);
      setVoterAddress('');
      showMessage('success', 'Voter registered successfully!');
      onUpdate();
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to register voter. They may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  // Handle start election
  const handleStartElection = async () => {
    try {
      setLoading(true);
      setError('');
      await startElection();
      showMessage('success', 'Election started successfully!');
      onUpdate();
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to start election. Check if candidates exist.');
    } finally {
      setLoading(false);
    }
  };

  // Handle end election
  const handleEndElection = async () => {
    if (!window.confirm('Are you sure you want to end the election?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await endElection();
      showMessage('success', 'Election ended successfully!');
      onUpdate();
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to end election.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>👑 Admin Control Panel</h2>
      
      {/* Status Messages */}
      {error && <div className="message error-message">❌ {error}</div>}
      {success && <div className="message success-message">✅ {success}</div>}

      {/* Add Candidate Section */}
      <div className="admin-section">
        <h3>Add Candidate</h3>
        <form onSubmit={handleAddCandidate}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter candidate name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={electionRunning || loading}
              className="form-input"
            />
            <button 
              type="submit" 
              disabled={electionRunning || loading}
              className="btn btn-primary"
            >
              {loading ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
          {electionRunning && (
            <p className="warning-text">⚠️ Cannot add candidates while election is running</p>
          )}
        </form>
      </div>

      {/* Register Voter Section */}
      <div className="admin-section">
        <h3>Register Voter</h3>
        <form onSubmit={handleRegisterVoter}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter voter address (0x...)"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              disabled={loading}
              className="form-input"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Registering...' : 'Register Voter'}
            </button>
          </div>
          <p className="info-text">💡 Tip: Use MetaMask account addresses</p>
        </form>
      </div>

      {/* Election Controls */}
      <div className="admin-section">
        <h3>Election Controls</h3>
        <div className="button-group">
          <button
            onClick={handleStartElection}
            disabled={electionRunning || loading}
            className="btn btn-success"
          >
            {loading ? 'Starting...' : '▶️ Start Election'}
          </button>
          <button
            onClick={handleEndElection}
            disabled={!electionRunning || loading}
            className="btn btn-danger"
          >
            {loading ? 'Ending...' : '⏹️ End Election'}
          </button>
        </div>
        <div className="status-indicator">
          <span className={`status-dot ${electionRunning ? 'running' : 'stopped'}`}></span>
          <span className="status-text">
            Election Status: {electionRunning ? '🟢 RUNNING' : '🔴 NOT RUNNING'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;