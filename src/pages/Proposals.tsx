import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { web3Service } from '../utils/web3';
import { 
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HandRaisedIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  forVotes: number;
  againstVotes: number;
  status: number;
  endTime: string;
  hasVoted?: boolean;
  isMock?: boolean;
}

const Proposals: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    executionData: '',
    target: ''
  });

  const fetchProposals = useCallback(async () => {
    // Mock proposals data
    const mockProposals: Proposal[] = [
      {
        id: 1,
        title: "Increase Bug Fix Rewards by 25%",
        description: "Proposal to increase the base reward for bug fix contributions from 100 OSS to 125 OSS tokens to better incentivize security-focused contributions and attract more talented developers to the ecosystem.",
        proposer: "0x742d35Cc6634C0532925a3b8D404fddBD4f4d4d4",
        forVotes: 847,
        againstVotes: 123,
        status: 1, // Passed
        endTime: "2024-12-15 18:00:00",
        hasVoted: false,
        isMock: true
      },
      {
        id: 2,
        title: "Implement Multi-Chain Support",
        description: "Expand the DAO to support Polygon and Arbitrum networks to reduce gas fees and increase accessibility for developers worldwide. This proposal includes smart contract migration and cross-chain bridge implementation.",
        proposer: "0x8ba1f109551bD432803012645Hac136c2c2e2c2e",
        forVotes: 1234,
        againstVotes: 89,
        status: 0, // Active
        endTime: "2024-12-20 12:00:00",
        hasVoted: false,
        isMock: true
      },
      {
        id: 3,
        title: "Create Developer Mentorship Program",
        description: "Establish a structured mentorship program where experienced contributors can guide newcomers, with additional token rewards for mentors and achievement badges for participants.",
        proposer: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        forVotes: 567,
        againstVotes: 234,
        status: 0, // Active
        endTime: "2024-12-18 16:30:00",
        hasVoted: true,
        isMock: true
      },
      {
        id: 4,
        title: "Security Audit Fund Allocation",
        description: "Allocate 50,000 OSS tokens from the treasury for professional security audits of critical smart contracts and high-impact community contributions.",
        proposer: "0x9876543210fedcba0987654321fedcba09876543",
        forVotes: 312,
        againstVotes: 678,
        status: 2, // Failed
        endTime: "2024-12-10 14:00:00",
        hasVoted: false,
        isMock: true
      }
    ];

    try {
      setLoading(true);
      
      // Fetch real proposals if contracts are deployed
      if (web3Service.isContractsDeployed()) {
        console.log('Fetching proposals from blockchain...');
        const fetchedProposals = await web3Service.getAllProposals();
        console.log('Fetched proposals:', fetchedProposals);
        
        if (fetchedProposals && fetchedProposals.length > 0) {
          // Check voting status for real proposals if user is connected
          if (isConnected && account) {
            const proposalsWithVoteStatus = await Promise.all(
              fetchedProposals.map(async (proposal) => {
                try {
                  const hasVoted = await web3Service.hasVotedOnProposal(proposal.id, account);
                  return { ...proposal, hasVoted, isMock: false };
                } catch (error) {
                  console.warn(`Failed to check vote status for proposal ${proposal.id}:`, error);
                  return { ...proposal, hasVoted: false, isMock: false };
                }
              })
            );
            // Combine real and mock proposals
            setProposals([...proposalsWithVoteStatus.map(p => ({ ...p, isMock: false })), ...mockProposals].sort((a, b) => b.id - a.id));
          } else {
            setProposals([...fetchedProposals.map(p => ({ ...p, isMock: false })), ...mockProposals].sort((a, b) => b.id - a.id));
          }
        } else {
          setProposals(mockProposals);
        }
      } else {
        console.log('Contracts not deployed, showing mock proposals');
        setProposals(mockProposals);
      }
      
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      // Show mock proposals even on error
      setProposals(mockProposals);
    } finally {
      setLoading(false);
    }
  }, [isConnected, account]);

  useEffect(() => {
    fetchProposals();
  }, [isConnected, account, fetchProposals]);

  const categories = [
    { value: 'General', label: 'General Discussion' },
    { value: 'Reward Changes', label: 'Reward Changes' },
    { value: 'Governance', label: 'Governance Parameters' },
    { value: 'Technical', label: 'Technical Upgrades' }
  ];

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: // Passed
        return <CheckCircleIcon className="w-5 h-5 text-accent-green" />;
      case 2: // Failed
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 3: // Executed
        return <CheckCircleIcon className="w-5 h-5 text-accent-green" />;
      case 4: // Cancelled
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default: // Active
        return <ClockIcon className="w-5 h-5 text-accent-orange" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: // Passed
        return 'text-accent-green bg-accent-green/10 border-accent-green/30';
      case 2: // Failed
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 3: // Executed
        return 'text-accent-green bg-accent-green/10 border-accent-green/30';
      case 4: // Cancelled
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: // Active
        return 'text-accent-orange bg-accent-orange/10 border-accent-orange/30';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Passed';
      case 2: return 'Failed';
      case 3: return 'Executed';
      case 4: return 'Cancelled';
      default: return 'Active';
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tx = await web3Service.createProposal(
        formData.title,
        formData.description,
        formData.category,
        formData.executionData,
        formData.target
      );
      
      console.log('Transaction sent:', tx.hash);
      alert('Proposal created successfully! Transaction: ' + tx.hash);
      
      // Reset form and close modal
      setFormData({ title: '', description: '', category: 'General', executionData: '', target: '' });
      setShowCreateForm(false);
      
      // Refresh proposals
      fetchProposals();
    } catch (error) {
      console.error('Failed to create proposal:', error);
      alert('Failed to create proposal: ' + (error as Error).message);
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const tx = await web3Service.voteOnProposal(proposalId, support);
      console.log('Vote transaction sent:', tx.hash);
      alert('Vote submitted successfully! Transaction: ' + tx.hash);
      
      // Refresh proposals
      fetchProposals();
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neon-blue font-semibold">Loading governance proposals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold neon-text mb-2">Governance Proposals</h1>
          <p className="text-dark-600">
            Participate in DAO governance by creating and voting on proposals
          </p>
        </div>
        {isConnected && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-neon flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5 flex-shrink-0" />
            <span>Create Proposal</span>
          </button>
        )}
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="card-cyber text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent-purple/20 to-neon-blue/20 rounded-full flex items-center justify-center">
            <ChatBubbleLeftIcon className="w-10 h-10 text-neon-blue" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Proposals Yet</h2>
          <p className="text-dark-600 mb-6 max-w-md mx-auto">
            Be the first to shape the future of this DAO by creating a governance proposal.
          </p>
          {isConnected && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-cyber"
            >
              Create First Proposal
            </button>
          )}
          {!isConnected && (
            <div className="text-sm text-dark-700">
              Connect your wallet to participate in governance
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="card-cyber floating-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 whitespace-nowrap ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      <span>{getStatusText(proposal.status)}</span>
                    </span>
                  </div>
                  <p className="text-dark-600 mb-4 leading-relaxed">{proposal.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-dark-600">
                    <span>
                      Proposer: <span className="text-neon-blue font-mono">{proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}</span>
                    </span>
                    <span>•</span>
                    <span>Ends: {proposal.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-accent-green/10 to-accent-green/5 p-4 rounded-lg border border-accent-green/20">
                  <div className="text-2xl font-bold text-accent-green">{proposal.forVotes}</div>
                  <div className="text-sm text-dark-600">For</div>
                </div>
                <div className="bg-gradient-to-r from-red-400/10 to-red-400/5 p-4 rounded-lg border border-red-400/20">
                  <div className="text-2xl font-bold text-red-400">{proposal.againstVotes}</div>
                  <div className="text-sm text-dark-600">Against</div>
                </div>
              </div>

              {/* Voting Buttons */}
              {isConnected && proposal.status === 0 && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVote(proposal.id, true)}
                    disabled={proposal.hasVoted}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap ${
                      proposal.hasVoted
                        ? 'bg-dark-300 text-dark-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-accent-green to-accent-emerald text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <HandRaisedIcon className="w-5 h-5 flex-shrink-0" />
                    <span>Vote For</span>
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, false)}
                    disabled={proposal.hasVoted}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap ${
                      proposal.hasVoted
                        ? 'bg-dark-300 text-dark-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>Vote Against</span>
                  </button>
                </div>
              )}
              
              {proposal.hasVoted && (
                <div className="text-center py-3 text-accent-green font-semibold">
                  ✓ You have already voted on this proposal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Proposal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-dark-50/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-cyber max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold neon-text">Create New Proposal</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                  placeholder="Enter a clear, descriptive title"
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
                  placeholder="Provide a detailed description of your proposal"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Target Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                    placeholder="0x..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Execution Data (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.executionData}
                    onChange={(e) => setFormData({ ...formData, executionData: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white placeholder-dark-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors"
                    placeholder="0x..."
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-neon"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals; 