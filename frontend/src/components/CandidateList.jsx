// frontend/src/components/CandidateList.jsx
import React, { useState } from 'react';
import { castVote } from '../ethereum/evoting';
import './CandidateList.css';

/**
 * CandidateList Component
 * Displays all candidates and allows voting
 */
const CandidateList = ({ 
  candidates, 
  canVote, 
  electionRunning,
  winner,
  onUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle vote submission
  const handleVote = async (candidateId) => {
    if (!window.confirm(`Are you sure you want to vote for this candidate?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSelectedCandidate(candidateId);
      await castVote(candidateId);
      setSuccess('Vote cast successfully!');
      setTimeout(() => setSuccess(''), 3000);
      onUpdate();
    } catch (err) {
      console.error(err);
      setError('Failed to cast vote. Make sure you are registered and haven\'t voted yet.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
      setSelectedCandidate(null);
    }
  };

  // Calculate percentage of votes
  const calculatePercentage = (voteCount) => {
    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="candidate-list">
      <h2>📋 Candidates</h2>
      
      {/* Status Messages */}
      {error && <div className="message error-message">❌ {error}</div>}
      {success && <div className="message success-message">✅ {success}</div>}

      {/* Winner Banner */}
      {winner && !electionRunning && (
        <div className="winner-banner">
          <h3>🏆 Winner: {winner.name}</h3>
          <p>Total Votes: {winner.voteCount}</p>
        </div>
      )}

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="no-candidates">
          <p>No candidates available yet.</p>
          <p>Admin needs to add candidates.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((candidate) => {
            const isWinner = winner && winner.id === candidate.id;
            const percentage = calculatePercentage(candidate.voteCount);
            
            return (
              <div 
                key={candidate.id} 
                className={`candidate-card ${isWinner ? 'winner-card' : ''}`}
              >
                {isWinner && <div className="winner-badge">👑 Winner</div>}
                
                <div className="candidate-header">
                  <h3>{candidate.name}</h3>
                  <span className="candidate-id">ID: {candidate.id}</span>
                </div>

                <div className="vote-info">
                  <div className="vote-count">
                    <span className="count-label">Votes:</span>
                    <span className="count-value">{candidate.voteCount}</span>
                  </div>
                  <div className="vote-percentage">
                    {percentage}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Vote Button */}
                {canVote && electionRunning && (
                  <button
                    onClick={() => handleVote(candidate.id)}
                    disabled={loading}
                    className={`vote-btn ${selectedCandidate === candidate.id ? 'voting' : ''}`}
                  >
                    {selectedCandidate === candidate.id && loading 
                      ? '⏳ Voting...' 
                      : '🗳️ Vote'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Voting Instructions */}
      {canVote && electionRunning && (
        <div className="voting-instructions">
          <p>💡 Click "Vote" on your preferred candidate to cast your vote.</p>
          <p>⚠️ You can only vote once. Choose carefully!</p>
        </div>
      )}
    </div>
  );
};

export default CandidateList;