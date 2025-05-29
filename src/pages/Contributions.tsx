import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { web3Service, ContributionCategory } from '../utils/web3';
import { 
  PlusIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HandRaisedIcon,
  XCircleIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface Contribution {
  id: number;
  title: string;
  description: string;
  projectUrl: string;
  githubPR: string;
  contributor: string;
  category: number;
  submissionTime: Date;
  approvalVotes: number;
  rejectionVotes: number;
  totalValidators: number;
  status: number;
  rewardAmount: string;
  claimed: boolean;
  isMock?: boolean;
}

const Contributions: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    githubPR: '',
    category: 'bug-fix'
  });

  useEffect(() => {
    fetchContributions();
  }, [isConnected, account]);

  const fetchContributions = async () => {
    // Mock contributions data
    const mockContributions: Contribution[] = [
      {
        id: 1,
        title: "Enhanced Smart Contract Gas Optimization",
        description: "Optimized gas usage in core DeFi smart contracts, reducing transaction costs by 35% through efficient storage patterns and optimized loops. Implemented advanced assembly optimizations for critical functions.",
        projectUrl: "https://github.com/defi-protocol/core-contracts",
        githubPR: "https://github.com/defi-protocol/core-contracts/pull/247",
        contributor: "0x742d35Cc6634C0532925a3b8D404fddBD4f4d4d4",
        category: ContributionCategory.Performance,
        submissionTime: new Date('2024-01-15'),
        approvalVotes: 15,
        rejectionVotes: 2,
        totalValidators: 18,
        status: 1, // Approved
        rewardAmount: "350",
        claimed: true,
        isMock: true
      },
      {
        id: 2,
        title: "Cross-Chain Bridge Security Audit",
        description: "Comprehensive security review and penetration testing of the multi-chain bridge protocol. Identified and fixed 3 critical vulnerabilities and 7 medium-risk issues, enhancing overall protocol security.",
        projectUrl: "https://github.com/bridge-protocol/core",
        githubPR: "https://github.com/bridge-protocol/core/pull/89",
        contributor: "0x8ba1f109551bD432803012645Hac136c2c2e2c2e",
        category: ContributionCategory.Security,
        submissionTime: new Date('2024-01-12'),
        approvalVotes: 22,
        rejectionVotes: 1,
        totalValidators: 25,
        status: 1, // Approved
        rewardAmount: "500",
        claimed: false,
        isMock: true
      },
      {
        id: 3,
        title: "GraphQL API Performance Enhancement",
        description: "Implemented advanced caching mechanisms and query optimization for the DAO's GraphQL API, improving response times by 60% and reducing server load significantly.",
        projectUrl: "https://github.com/oss-dao/api-server",
        githubPR: "https://github.com/oss-dao/api-server/pull/156",
        contributor: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        category: ContributionCategory.Feature,
        submissionTime: new Date('2024-01-10'),
        approvalVotes: 8,
        rejectionVotes: 5,
        totalValidators: 15,
        status: 0, // Pending
        rewardAmount: "0",
        claimed: false,
        isMock: true
      },
      {
        id: 4,
        title: "Mobile App UI/UX Redesign",
        description: "Complete redesign of the mobile application interface with improved accessibility, modern design patterns, and enhanced user experience. Includes comprehensive user testing and feedback implementation.",
        projectUrl: "https://github.com/oss-dao/mobile-app",
        githubPR: "https://github.com/oss-dao/mobile-app/pull/78",
        contributor: "0x9876543210fedcba0987654321fedcba09876543",
        category: ContributionCategory.Feature,
        submissionTime: new Date('2024-01-08'),
        approvalVotes: 12,
        rejectionVotes: 8,
        totalValidators: 20,
        status: 2, // Rejected
        rewardAmount: "0",
        claimed: false,
        isMock: true
      },
      {
        id: 5,
        title: "Comprehensive Documentation Overhaul",
        description: "Rewrote and restructured the entire project documentation, creating interactive tutorials, API references, and beginner-friendly guides. Added multilingual support for global accessibility.",
        projectUrl: "https://github.com/oss-dao/documentation",
        githubPR: "https://github.com/oss-dao/documentation/pull/234",
        contributor: "0x456789abcdef0123456789abcdef012345678901",
        category: ContributionCategory.Documentation,
        submissionTime: new Date('2024-01-05'),
        approvalVotes: 18,
        rejectionVotes: 3,
        totalValidators: 21,
        status: 1, // Approved
        rewardAmount: "275",
        claimed: true,
        isMock: true
      }
    ];

    try {
      setLoading(true);
      
      // Only fetch real contributions from blockchain
      if (web3Service.isContractsDeployed()) {
        console.log('Fetching contributions from blockchain...');
        const fetchedContributions = await web3Service.getAllContributions();
        console.log('Fetched contributions:', fetchedContributions);
        
        if (fetchedContributions && fetchedContributions.length > 0) {
          const realContributions = fetchedContributions.map(c => ({ ...c, isMock: false }));
          setContributions([...realContributions, ...mockContributions].sort((a, b) => b.id - a.id));
        } else {
          setContributions(mockContributions);
        }
      } else {
        console.log('Contracts not deployed, showing mock contributions');
        setContributions(mockContributions);
      }
      
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      // Show mock contributions even on error
      setContributions(mockContributions);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'bug-fix', label: 'Bug Fix', contractValue: ContributionCategory.BugFix },
    { value: 'feature', label: 'New Feature', contractValue: ContributionCategory.Feature },
    { value: 'security', label: 'Security', contractValue: ContributionCategory.Security },
    { value: 'documentation', label: 'Documentation', contractValue: ContributionCategory.Documentation },
    { value: 'performance', label: 'Performance', contractValue: ContributionCategory.Performance },
    { value: 'research', label: 'Research', contractValue: ContributionCategory.Research },
  ];

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: // Approved
        return <CheckCircleIcon className="w-5 h-5 text-accent-green" />;
      case 2: // Rejected
        return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
      default: // Pending
        return <ClockIcon className="w-5 h-5 text-accent-orange" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: // Approved
        return 'text-accent-green bg-accent-green/10 border-accent-green/30';
      case 2: // Rejected
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: // Pending
        return 'text-accent-orange bg-accent-orange/10 border-accent-orange/30';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Pending';
    }
  };

  const getCategoryColor = (category: number) => {
    const colors: { [key: number]: string } = {
      [ContributionCategory.BugFix]: 'bg-red-500/20 text-red-300 border-red-500/30',
      [ContributionCategory.Feature]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      [ContributionCategory.Security]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      [ContributionCategory.Documentation]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      [ContributionCategory.Performance]: 'bg-green-500/20 text-green-300 border-green-500/30',
      [ContributionCategory.Research]: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getCategoryName = (category: number) => {
    const names: { [key: number]: string } = {
      [ContributionCategory.BugFix]: 'Bug Fix',
      [ContributionCategory.Feature]: 'Feature',
      [ContributionCategory.Security]: 'Security',
      [ContributionCategory.Documentation]: 'Documentation',
      [ContributionCategory.Performance]: 'Performance',
      [ContributionCategory.Research]: 'Research',
    };
    return names[category] || 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const category = categories.find(c => c.value === formData.category);
      if (!category) {
        alert('Invalid category selected');
        return;
      }

      const tx = await web3Service.submitContribution(
        formData.title,
        formData.description,
        formData.projectUrl,
        formData.githubPR,
        category.contractValue
      );
      
      console.log('Transaction sent:', tx.hash);
      alert('Contribution submitted successfully! Transaction: ' + tx.hash);
      
      // Reset form and close modal
      setFormData({ title: '', description: '', projectUrl: '', githubPR: '', category: 'bug-fix' });
      setShowSubmitForm(false);
      
      // Refresh contributions
      fetchContributions();
    } catch (error) {
      console.error('Failed to submit contribution:', error);
      alert('Failed to submit contribution: ' + (error as Error).message);
    }
  };

  const handleVote = async (contributionId: number, approve: boolean) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tx = await web3Service.validateContribution(contributionId, approve);
      console.log('Vote transaction sent:', tx.hash);
      alert('Vote submitted successfully! Transaction: ' + tx.hash);
      
      // Refresh contributions
      fetchContributions();
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote: ' + (error as Error).message);
    }
  };

  const handleClaimReward = async (contributionId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tx = await web3Service.claimReward(contributionId);
      console.log('Claim transaction sent:', tx.hash);
      alert('Reward claimed successfully! Transaction: ' + tx.hash);
      
      // Refresh contributions
      fetchContributions();
    } catch (error) {
      console.error('Failed to claim reward:', error);
      alert('Failed to claim reward: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neon-blue font-semibold">Loading contributions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold neon-text mb-2">Open Source Contributions</h1>
          <p className="text-dark-600">
            Submit your contributions and earn rewards through community validation
          </p>
        </div>
        {isConnected && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="btn-neon flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5 flex-shrink-0" />
            <span>Submit Contribution</span>
          </button>
        )}
      </div>

      {/* Contributions List */}
      {contributions.length === 0 ? (
        <div className="card-cyber text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent-purple/20 to-neon-blue/20 rounded-full flex items-center justify-center">
            <CodeBracketIcon className="w-10 h-10 text-neon-blue" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Contributions Yet</h2>
          <p className="text-dark-600 mb-6 max-w-md mx-auto">
            Start earning rewards by submitting your open-source contributions for community validation.
          </p>
          {isConnected && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="btn-cyber"
            >
              Submit First Contribution
            </button>
          )}
          {!isConnected && (
            <div className="text-sm text-dark-700">
              Connect your wallet to submit contributions
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="card-cyber floating-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{contribution.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 whitespace-nowrap ${getStatusColor(contribution.status)}`}>
                      {getStatusIcon(contribution.status)}
                      <span>{getStatusText(contribution.status)}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getCategoryColor(contribution.category)}`}>
                      {getCategoryName(contribution.category)}
                    </span>
                  </div>
                  <p className="text-dark-600 mb-4 leading-relaxed">{contribution.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-dark-600 mb-4">
                    <span>
                      Contributor: <span className="text-neon-blue font-mono">{contribution.contributor.slice(0, 8)}...{contribution.contributor.slice(-6)}</span>
                    </span>
                    <span>•</span>
                    <span>Submitted: {contribution.submissionTime.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {contribution.projectUrl && (
                      <a
                        href={contribution.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-neon-blue hover:text-accent-purple transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Project</span>
                      </a>
                    )}
                    {contribution.githubPR && (
                      <a
                        href={contribution.githubPR}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-neon-blue hover:text-accent-purple transition-colors"
                      >
                        <CodeBracketIcon className="w-4 h-4" />
                        <span>Pull Request</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-accent-green/10 to-accent-green/5 p-4 rounded-lg border border-accent-green/20">
                  <div className="text-2xl font-bold text-accent-green">{contribution.approvalVotes}</div>
                  <div className="text-sm text-dark-600">Approved</div>
                </div>
                <div className="bg-gradient-to-r from-red-400/10 to-red-400/5 p-4 rounded-lg border border-red-400/20">
                  <div className="text-2xl font-bold text-red-400">{contribution.rejectionVotes}</div>
                  <div className="text-sm text-dark-600">Rejected</div>
                </div>
                <div className="bg-gradient-to-r from-neon-blue/10 to-neon-blue/5 p-4 rounded-lg border border-neon-blue/20">
                  <div className="text-2xl font-bold text-neon-blue">{contribution.totalValidators}</div>
                  <div className="text-sm text-dark-600">Total Validators</div>
                </div>
              </div>

              {/* Voting Buttons */}
              {isConnected && contribution.status === 0 && contribution.contributor !== account && (
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => handleVote(contribution.id, true)}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-accent-green to-accent-emerald text-white hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <HandRaisedIcon className="w-5 h-5 flex-shrink-0" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleVote(contribution.id, false)}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {/* Reward Information */}
              {contribution.status === 1 && (
                <div className="bg-gradient-to-r from-accent-green/10 to-accent-green/5 p-4 rounded-lg border border-accent-green/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-accent-green">
                        {contribution.rewardAmount} OSS Tokens
                      </div>
                      <div className="text-sm text-dark-600">Approved Reward</div>
                    </div>
                    {contribution.contributor === account && !contribution.claimed && (
                      <button
                        onClick={() => handleClaimReward(contribution.id)}
                        className="btn-neon"
                      >
                        Claim Reward
                      </button>
                    )}
                    {contribution.claimed && (
                      <div className="text-accent-green font-semibold">
                        ✓ Reward Claimed
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Contribution Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-dark-50/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-cyber max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold neon-text">Submit Contribution</h2>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Contribution Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                  placeholder="Brief title of your contribution"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors h-32 resize-none"
                  placeholder="Detailed description of your contribution and its impact"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                    placeholder="https://github.com/project/repo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    GitHub PR/Issue URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubPR}
                    onChange={(e) => setFormData({ ...formData, githubPR: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                    placeholder="https://github.com/project/repo/pull/123"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-neon"
                >
                  Submit Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contributions; 