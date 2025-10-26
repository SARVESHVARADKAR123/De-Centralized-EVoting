// frontend/src/components/VoterPanel.jsx
import React from 'react';
import './VoterPanel.css';

/**
 * VoterPanel Component
 * Displays voter status and information
 */
const VoterPanel = ({ isRegistered, hasVoted, votedFor, electionRunning, candidates }) => {
  
  // Get candidate name from voted candidate ID
  const getVotedCandidateName = () => {
    if (!hasVoted || votedFor === 0) return null;
    const candidate = candidates.find(c => c.id === votedFor);
    return candidate ? candidate.name : 'Unknown';
  };

  return (
    <div className="voter-panel">
      <h2>🗳️ Voter Information</h2>
      
      <div className="voter-status-card">
        {/* Registration Status */}
        <div className="status-item">
          <span className="status-label">Registration Status:</span>
          <span className={`status-badge ${isRegistered ? 'registered' : 'not-registered'}`}>
            {isRegistered ? '✅ Registered' : '❌ Not Registered'}
          </span>
        </div>

        {/* Voting Status */}
        {isRegistered && (
          <div className="status-item">
            <span className="status-label">Voting Status:</span>
            <span className={`status-badge ${hasVoted ? 'voted' : 'not-voted'}`}>
              {hasVoted ? '✅ Voted' : '⏳ Not Voted'}
            </span>
          </div>
        )}

        {/* Show voted candidate */}
        {hasVoted && getVotedCandidateName() && (
          <div className="status-item">
            <span className="status-label">Your Vote:</span>
            <span className="voted-candidate">
              🎯 {getVotedCandidateName()}
            </span>
          </div>
        )}

        {/* Election Status */}
        <div className="status-item">
          <span className="status-label">Election:</span>
          <span className={`status-badge ${electionRunning ? 'running' : 'not-running'}`}>
            {electionRunning ? '🟢 Running' : '🔴 Not Running'}
          </span>
        </div>
      </div>

      {/* Information Messages */}
      <div className="voter-messages">
        {!isRegistered && (
          <div className="message warning-message">
            <strong>⚠️ You are not registered to vote</strong>
            <p>Please contact the election admin to register your address.</p>
          </div>
        )}

        {isRegistered && !hasVoted && !electionRunning && (
          <div className="message info-message">
            <strong>ℹ️ Election not started</strong>
            <p>Please wait for the admin to start the election.</p>
          </div>
        )}

        {isRegistered && !hasVoted && electionRunning && (
          <div className="message success-message">
            <strong>✨ You can vote now!</strong>
            <p>Select a candidate from the list below to cast your vote.</p>
          </div>
        )}

        {isRegistered && hasVoted && (
          <div className="message success-message">
            <strong>🎉 Thank you for voting!</strong>
            <p>Your vote has been recorded on the blockchain. You voted for: <strong>{getVotedCandidateName()}</strong></p>
          </div>
        )}
      </div>

      {/* Voter Rights Information */}
      <div className="voter-info-box">
        <h3>📜 Your Voting Rights</h3>
        <ul>
          <li>✅ Each voter can vote only once</li>
          <li>🔒 Your vote is recorded on the blockchain</li>
          <li>🔐 Voting is secure and transparent</li>
          <li>👁️ You can view real-time vote counts</li>
        </ul>
      </div>
    </div>
  );
};

export default VoterPanel;