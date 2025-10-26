// frontend/src/ethereum/evoting.js
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

/**
 * Get the Web3 provider from MetaMask
 */
export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Get the signer (user's account)
 */
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

/**
 * Get the EVoting contract instance
 */
export const getContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Request account access from MetaMask
 * @returns {Promise<string[]>} Array of account addresses
 */
export const connectWallet = async () => {
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

/**
 * Get current connected account
 * @returns {Promise<string>} Current account address
 */
export const getCurrentAccount = async () => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return await signer.getAddress();
};

/**
 * Check if current user is admin
 * @returns {Promise<boolean>}
 */
export const isUserAdmin = async () => {
  try {
    const contract = await getContract();
    const currentAccount = await getCurrentAccount();
    const adminAddress = await contract.admin();
    return adminAddress.toLowerCase() === currentAccount.toLowerCase();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Get voter information
 * @param {string} address - Voter address
 * @returns {Promise<{registered: boolean, voted: boolean, votedFor: number}>}
 */
export const getVoterInfo = async (address) => {
  try {
    const contract = await getContract();
    const [registered, voted, votedFor] = await contract.getVoter(address);
    return {
      registered,
      voted,
      votedFor: Number(votedFor)
    };
  } catch (error) {
    console.error("Error getting voter info:", error);
    throw error;
  }
};

/**
 * Get election status
 * @returns {Promise<boolean>}
 */
export const isElectionRunning = async () => {
  try {
    const contract = await getContract();
    return await contract.electionRunning();
  } catch (error) {
    console.error("Error getting election status:", error);
    throw error;
  }
};

/**
 * Get all candidates
 * @returns {Promise<Array<{id: number, name: string, voteCount: number}>>}
 */
export const getAllCandidates = async () => {
  try {
    const contract = await getContract();
    const candidates = await contract.getAllCandidates();
    return candidates.map(c => ({
      id: Number(c.id),
      name: c.name,
      voteCount: Number(c.voteCount)
    }));
  } catch (error) {
    console.error("Error getting candidates:", error);
    throw error;
  }
};

/**
 * Add a new candidate (admin only)
 * @param {string} name - Candidate name
 * @returns {Promise<void>}
 */
export const addCandidate = async (name) => {
  try {
    const contract = await getContract();
    const tx = await contract.addCandidate(name);
    await tx.wait();
  } catch (error) {
    console.error("Error adding candidate:", error);
    throw error;
  }
};

/**
 * Register a voter (admin only)
 * @param {string} voterAddress - Address to register
 * @returns {Promise<void>}
 */
export const registerVoter = async (voterAddress) => {
  try {
    const contract = await getContract();
    const tx = await contract.registerVoter(voterAddress);
    await tx.wait();
  } catch (error) {
    console.error("Error registering voter:", error);
    throw error;
  }
};

/**
 * Start the election (admin only)
 * @returns {Promise<void>}
 */
export const startElection = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.startElection();
    await tx.wait();
  } catch (error) {
    console.error("Error starting election:", error);
    throw error;
  }
};

/**
 * End the election (admin only)
 * @returns {Promise<void>}
 */
export const endElection = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.endElection();
    await tx.wait();
  } catch (error) {
    console.error("Error ending election:", error);
    throw error;
  }
};

/**
 * Cast a vote
 * @param {number} candidateId - ID of candidate to vote for
 * @returns {Promise<void>}
 */
export const castVote = async (candidateId) => {
  try {
    const contract = await getContract();
    const tx = await contract.vote(candidateId);
    await tx.wait();
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};

/**
 * Get the winner of the election
 * @returns {Promise<{id: number, name: string, voteCount: number}>}
 */
export const getWinner = async () => {
  try {
    const contract = await getContract();
    const [winnerId, winnerName, winnerVoteCount] = await contract.getWinner();
    return {
      id: Number(winnerId),
      name: winnerName,
      voteCount: Number(winnerVoteCount)
    };
  } catch (error) {
    console.error("Error getting winner:", error);
    throw error;
  }
};

/**
 * Listen for account changes in MetaMask
 * @param {Function} callback - Function to call when account changes
 */
export const onAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Listen for chain changes in MetaMask
 * @param {Function} callback - Function to call when chain changes
 */
export const onChainChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
};