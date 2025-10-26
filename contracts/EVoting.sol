// contracts/EVoting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EVoting
 * @dev Decentralized E-Voting System
 * @notice This contract allows an admin to manage elections and voters to cast votes
 */
contract EVoting {
    // Struct to store candidate information
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Struct to store voter information
    struct Voter {
        bool registered;
        bool voted;
        uint256 vote; // candidate id they voted for
    }

    // State variables
    address public admin;
    bool public electionRunning;
    uint256 public candidateCount;
    
    // Mappings
    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;

    // Events
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoterRegistered(address indexed voterAddress);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted();
    event ElectionEnded();

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier whenRunning() {
        require(electionRunning, "Election is not running");
        _;
    }

    modifier whenNotRunning() {
        require(!electionRunning, "Election is already running");
        _;
    }

    /**
     * @dev Constructor initializes the contract with default candidates
     * @notice Sets the deployer as admin and adds three default candidates
     */
    constructor() {
        admin = msg.sender;
        electionRunning = false;
        
        // Initialize with default candidates: Alice, Bob, Carol
        addCandidate("Alice");
        addCandidate("Bob");
        addCandidate("Carol");
    }

    /**
     * @dev Add a new candidate to the election
     * @param _name Name of the candidate
     */
    function addCandidate(string memory _name) public onlyAdmin whenNotRunning {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        emit CandidateAdded(candidateCount, _name);
    }

    /**
     * @dev Register a voter
     * @param _voterAddress Address of the voter to register
     */
    function registerVoter(address _voterAddress) public onlyAdmin {
        require(!voters[_voterAddress].registered, "Voter already registered");
        voters[_voterAddress] = Voter(true, false, 0);
        emit VoterRegistered(_voterAddress);
    }

    /**
     * @dev Start the election
     */
    function startElection() public onlyAdmin whenNotRunning {
        require(candidateCount > 0, "No candidates available");
        electionRunning = true;
        emit ElectionStarted();
    }

    /**
     * @dev End the election
     */
    function endElection() public onlyAdmin whenRunning {
        electionRunning = false;
        emit ElectionEnded();
    }

    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId ID of the candidate to vote for
     */
    function vote(uint256 _candidateId) public whenRunning {
        require(voters[msg.sender].registered, "You are not registered to vote");
        require(!voters[msg.sender].voted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    /**
     * @dev Get the winner of the election
     * @return winnerId ID of the winning candidate
     * @return winnerName Name of the winning candidate
     * @return winnerVoteCount Vote count of the winning candidate
     */
    function getWinner() public view returns (uint256 winnerId, string memory winnerName, uint256 winnerVoteCount) {
        uint256 maxVotes = 0;
        uint256 winningCandidateId = 0;

        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        require(winningCandidateId > 0, "No winner yet");
        
        return (
            winningCandidateId,
            candidates[winningCandidateId].name,
            candidates[winningCandidateId].voteCount
        );
    }

    /**
     * @dev Get all candidates
     * @return Array of all candidates
     */
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }

    /**
     * @dev Check if an address is the admin
     * @param _address Address to check
     */
    function isAdmin(address _address) public view returns (bool) {
        return _address == admin;
    }

    /**
     * @dev Get voter information
     * @param _voterAddress Address of the voter
     */
    function getVoter(address _voterAddress) public view returns (bool registered, bool voted, uint256 votedFor) {
        Voter memory voter = voters[_voterAddress];
        return (voter.registered, voter.voted, voter.vote);
    }
}