// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./OSSToken.sol";

/**
 * @title OSSRewards
 * @dev Contract for managing open-source contribution submissions and rewards
 */
contract OSSRewards is ReentrancyGuard, Ownable, Pausable {
    OSSToken public immutable ossToken;
    
    enum ContributionStatus { Pending, Approved, Rejected, Claimed }
    enum Category { BugFix, Feature, Performance, Security, Documentation, Refactoring, Testing, Other }
    
    struct Contribution {
        uint256 id;
        address contributor;
        string title;
        string description;
        string projectUrl;
        Category category;
        uint256 submissionTime;
        uint256 upvotes;
        uint256 downvotes;
        uint256 rewardAmount;
        ContributionStatus status;
        bool claimed;
    }
    
    struct Vote {
        bool hasVoted;
        bool isUpvote;
    }
    
    uint256 public nextContributionId = 1;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTES_REQUIRED = 5;
    uint256 public constant APPROVAL_THRESHOLD = 60; // 60% approval required
    
    // Base reward amounts for different categories (in wei)
    mapping(Category => uint256) public baseRewards;
    
    // All contributions
    mapping(uint256 => Contribution) public contributions;
    
    // Voting tracking: contributionId => voter => Vote
    mapping(uint256 => mapping(address => Vote)) public votes;
    
    // User contribution history
    mapping(address => uint256[]) public userContributions;
    
    // Events
    event ContributionSubmitted(
        uint256 indexed contributionId,
        address indexed contributor,
        string title,
        Category category
    );
    
    event VoteCast(
        uint256 indexed contributionId,
        address indexed voter,
        bool isUpvote
    );
    
    event ContributionApproved(
        uint256 indexed contributionId,
        uint256 rewardAmount
    );
    
    event ContributionRejected(uint256 indexed contributionId);
    
    event RewardClaimed(
        uint256 indexed contributionId,
        address indexed contributor,
        uint256 amount
    );
    
    event BaseRewardUpdated(Category category, uint256 amount);
    
    constructor(address _ossToken) Ownable(msg.sender) {
        ossToken = OSSToken(_ossToken);
        
        // Set initial base rewards (in OSS tokens * 10^18)
        baseRewards[Category.BugFix] = 100 * 10**18;
        baseRewards[Category.Feature] = 200 * 10**18;
        baseRewards[Category.Performance] = 150 * 10**18;
        baseRewards[Category.Security] = 300 * 10**18;
        baseRewards[Category.Documentation] = 75 * 10**18;
        baseRewards[Category.Refactoring] = 125 * 10**18;
        baseRewards[Category.Testing] = 100 * 10**18;
        baseRewards[Category.Other] = 50 * 10**18;
    }
    
    /**
     * @dev Submit a new contribution for community review
     */
    function submitContribution(
        string memory title,
        string memory description,
        string memory projectUrl,
        Category category
    ) external whenNotPaused {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(projectUrl).length > 0, "Project URL cannot be empty");
        
        uint256 contributionId = nextContributionId++;
        
        contributions[contributionId] = Contribution({
            id: contributionId,
            contributor: msg.sender,
            title: title,
            description: description,
            projectUrl: projectUrl,
            category: category,
            submissionTime: block.timestamp,
            upvotes: 0,
            downvotes: 0,
            rewardAmount: 0,
            status: ContributionStatus.Pending,
            claimed: false
        });
        
        userContributions[msg.sender].push(contributionId);
        
        emit ContributionSubmitted(contributionId, msg.sender, title, category);
    }
    
    /**
     * @dev Vote on a contribution (upvote = true, downvote = false)
     */
    function voteOnContribution(uint256 contributionId, bool isUpvote) 
        external 
        whenNotPaused 
    {
        require(contributionId < nextContributionId, "Contribution does not exist");
        require(contributions[contributionId].status == ContributionStatus.Pending, "Voting period ended");
        require(contributions[contributionId].contributor != msg.sender, "Cannot vote on own contribution");
        require(!votes[contributionId][msg.sender].hasVoted, "Already voted");
        require(
            block.timestamp <= contributions[contributionId].submissionTime + VOTING_PERIOD,
            "Voting period has ended"
        );
        
        votes[contributionId][msg.sender] = Vote({
            hasVoted: true,
            isUpvote: isUpvote
        });
        
        if (isUpvote) {
            contributions[contributionId].upvotes++;
        } else {
            contributions[contributionId].downvotes++;
        }
        
        emit VoteCast(contributionId, msg.sender, isUpvote);
        
        // Auto-finalize if enough votes
        _tryFinalizeContribution(contributionId);
    }
    
    /**
     * @dev Finalize a contribution after voting period
     */
    function finalizeContribution(uint256 contributionId) external {
        require(contributionId < nextContributionId, "Contribution does not exist");
        require(contributions[contributionId].status == ContributionStatus.Pending, "Already finalized");
        require(
            block.timestamp > contributions[contributionId].submissionTime + VOTING_PERIOD,
            "Voting period still active"
        );
        
        _finalizeContribution(contributionId);
    }
    
    /**
     * @dev Internal function to try finalizing a contribution
     */
    function _tryFinalizeContribution(uint256 contributionId) internal {
        Contribution storage contribution = contributions[contributionId];
        uint256 totalVotes = contribution.upvotes + contribution.downvotes;
        
        if (totalVotes >= MIN_VOTES_REQUIRED) {
            _finalizeContribution(contributionId);
        }
    }
    
    /**
     * @dev Internal function to finalize a contribution
     */
    function _finalizeContribution(uint256 contributionId) internal {
        Contribution storage contribution = contributions[contributionId];
        uint256 totalVotes = contribution.upvotes + contribution.downvotes;
        
        if (totalVotes == 0) {
            contribution.status = ContributionStatus.Rejected;
            emit ContributionRejected(contributionId);
            return;
        }
        
        uint256 approvalPercentage = (contribution.upvotes * 100) / totalVotes;
        
        if (approvalPercentage >= APPROVAL_THRESHOLD) {
            // Calculate reward based on category and vote ratio
            uint256 baseReward = baseRewards[contribution.category];
            uint256 multiplier = 100 + ((approvalPercentage - APPROVAL_THRESHOLD) * 2); // Up to 180% of base
            contribution.rewardAmount = (baseReward * multiplier) / 100;
            contribution.status = ContributionStatus.Approved;
            
            emit ContributionApproved(contributionId, contribution.rewardAmount);
        } else {
            contribution.status = ContributionStatus.Rejected;
            emit ContributionRejected(contributionId);
        }
    }
    
    /**
     * @dev Claim reward for an approved contribution
     */
    function claimReward(uint256 contributionId) external nonReentrant whenNotPaused {
        require(contributionId < nextContributionId, "Contribution does not exist");
        
        Contribution storage contribution = contributions[contributionId];
        require(contribution.contributor == msg.sender, "Not the contributor");
        require(contribution.status == ContributionStatus.Approved, "Contribution not approved");
        require(!contribution.claimed, "Reward already claimed");
        
        contribution.claimed = true;
        contribution.status = ContributionStatus.Claimed;
        
        // Mint reward tokens to the contributor
        ossToken.mint(msg.sender, contribution.rewardAmount);
        
        emit RewardClaimed(contributionId, msg.sender, contribution.rewardAmount);
    }
    
    /**
     * @dev Get contribution details
     */
    function getContribution(uint256 contributionId) 
        external 
        view 
        returns (Contribution memory) 
    {
        require(contributionId < nextContributionId, "Contribution does not exist");
        return contributions[contributionId];
    }
    
    /**
     * @dev Get user's contribution IDs
     */
    function getUserContributions(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userContributions[user];
    }
    
    /**
     * @dev Get vote information for a contribution and voter
     */
    function getVote(uint256 contributionId, address voter) 
        external 
        view 
        returns (bool hasVoted, bool isUpvote) 
    {
        Vote memory vote = votes[contributionId][voter];
        return (vote.hasVoted, vote.isUpvote);
    }
    
    /**
     * @dev Update base reward for a category (only owner)
     */
    function updateBaseReward(Category category, uint256 amount) external onlyOwner {
        baseRewards[category] = amount;
        emit BaseRewardUpdated(category, amount);
    }
    
    /**
     * @dev Pause the contract (emergency use)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get total number of contributions
     */
    function getTotalContributions() external view returns (uint256) {
        return nextContributionId - 1;
    }
} 