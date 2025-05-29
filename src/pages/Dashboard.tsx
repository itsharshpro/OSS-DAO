import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  TrophyIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  FireIcon,
  StarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { isConnected, account, balance, tokenBalance } = useWeb3();

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="card-cyber max-w-md mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-neon-blue to-accent-purple rounded-full flex items-center justify-center animate-glow">
              <ChartBarIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold neon-text mb-4">Connect Your Wallet</h2>
            <p className="text-dark-600 mb-6 leading-relaxed">
              Welcome to your mission control center. Monitor your contributions, track rewards, and stay updated with the latest DAO activities in this comprehensive dashboard.
            </p>
            <div className="text-sm text-dark-700">
              Connect your wallet to access personalized dashboard features
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userStats = [
    {
      label: 'Total Earned',
      value: '1,250',
      suffix: 'OSS',
      icon: CurrencyDollarIcon,
      color: 'text-accent-green',
      gradient: 'from-accent-green to-accent-emerald',
      trend: '+18%'
    },
    {
      label: 'Contributions',
      value: '8',
      suffix: '',
      icon: TrophyIcon,
      color: 'text-accent-purple',
      gradient: 'from-accent-purple to-accent-violet',
      trend: '+2'
    },
    {
      label: 'Reputation Score',
      value: '2,847',
      suffix: '',
      icon: StarIcon,
      color: 'text-neon-blue',
      gradient: 'from-neon-blue to-primary-400',
      trend: '+156'
    },
    {
      label: 'Active Streak',
      value: '23',
      suffix: 'days',
      icon: FireIcon,
      color: 'text-accent-orange',
      gradient: 'from-accent-orange to-neon-yellow',
      trend: 'New!'
    }
  ];

  const recentActivity = [
    {
      type: 'contribution',
      title: 'Smart Contract Optimization',
      description: 'Submitted gas optimization for DeFi protocol smart contracts',
      amount: '+150 OSS',
      time: '2 hours ago',
      status: 'pending',
      category: 'Performance'
    },
    {
      type: 'reward',
      title: 'Security Audit Completion',
      description: 'Reward claimed for comprehensive security audit',
      amount: '+500 OSS',
      time: '1 day ago',
      status: 'completed',
      category: 'Security'
    },
    {
      type: 'vote',
      title: 'Governance Proposal Vote',
      description: 'Participated in DAO governance decision',
      amount: '+5 OSS',
      time: '2 days ago',
      status: 'completed',
      category: 'Governance'
    },
    {
      type: 'contribution',
      title: 'GraphQL API Enhancement',
      description: 'Implemented advanced query optimization features',
      amount: '+300 OSS',
      time: '3 days ago',
      status: 'approved',
      category: 'Feature'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-accent-green bg-accent-green/20 border-accent-green/40';
      case 'approved':
        return 'text-neon-blue bg-neon-blue/20 border-neon-blue/40';
      case 'pending':
        return 'text-accent-orange bg-accent-orange/20 border-accent-orange/40';
      default:
        return 'text-dark-400 bg-dark-400/20 border-dark-400/40';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <RocketLaunchIcon className="w-5 h-5" />;
      case 'reward':
        return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'vote':
        return <ChartBarIcon className="w-5 h-5" />;
      default:
        return <StarIcon className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Performance': return 'text-accent-green';
      case 'Security': return 'text-accent-purple';
      case 'Governance': return 'text-neon-blue';
      case 'Feature': return 'text-accent-orange';
      default: return 'text-dark-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-bold neon-text mb-2">Mission Control</h1>
          <p className="text-dark-400 text-lg">
            Welcome back, <span className="text-neon-blue font-semibold">contributor</span>! Here's your decentralized impact overview.
          </p>
        </div>
        <div className="flex gap-4 mt-6 sm:mt-0">
          <Link
            to="/contributions"
            className="btn-neon flex items-center space-x-2 group whitespace-nowrap"
          >
            <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform flex-shrink-0" />
            <span>New Contribution</span>
          </Link>
          <Link
            to="/proposals"
            className="btn-cyber flex items-center space-x-2 whitespace-nowrap"
          >
            <span>Governance</span>
            <ArrowTrendingUpIcon className="w-4 h-4 flex-shrink-0" />
          </Link>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="card-cyber">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-accent-purple rounded-full flex items-center justify-center animate-glow">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold neon-text">Wallet Status</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-r from-dark-200/50 to-dark-300/50 rounded-lg border border-dark-400/30">
            <p className="text-sm text-dark-400 mb-2 font-semibold">Address</p>
            <p className="text-neon-blue font-mono text-sm break-all">
              {account?.slice(0, 12)}...{account?.slice(-10)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-dark-200/50 to-dark-300/50 rounded-lg border border-dark-400/30">
            <p className="text-sm text-dark-400 mb-2 font-semibold">ETH Balance</p>
            <p className="text-white font-bold text-lg">
              {parseFloat(balance).toFixed(4)} ETH
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-accent-green/10 to-accent-emerald/10 rounded-lg border border-accent-green/30">
            <p className="text-sm text-dark-400 mb-2 font-semibold">OSS Tokens</p>
            <p className="text-accent-green font-bold text-lg">
              {tokenBalance || '1,250'} OSS
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-cyber floating-card holographic group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:animate-pulse`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold text-accent-green bg-accent-green/20 px-2 py-1 rounded-full">
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                {stat.value}
                <span className="text-lg text-dark-400 ml-1">{stat.suffix}</span>
              </div>
              <div className="text-sm text-dark-400 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="card-cyber">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold neon-text flex items-center space-x-2">
            <ChartBarIcon className="w-6 h-6 text-neon-blue" />
            <span>Performance Analytics</span>
          </h3>
          <div className="text-sm text-dark-400">Last 30 days</div>
        </div>
        <div className="h-64 bg-gradient-to-r from-dark-200/30 to-dark-300/30 rounded-lg border border-dark-400/30 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-accent-purple rounded-full flex items-center justify-center animate-pulse">
              <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-dark-400 mb-2">Analytics Dashboard</p>
            <p className="text-sm text-dark-500">Chart integration coming soon</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-cyber">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold neon-text flex items-center space-x-2">
            <ClockIcon className="w-6 h-6 text-neon-blue" />
            <span>Recent Activity</span>
          </h3>
          <Link
            to="/profile"
            className="text-neon-blue hover:text-accent-purple transition-colors font-medium"
          >
            View All →
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={index} 
              className="p-4 bg-gradient-to-r from-dark-200/30 to-dark-300/30 rounded-lg border border-dark-400/20 hover:border-neon-blue/30 transition-all duration-300 floating-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-purple/20 to-neon-blue/20 rounded-full flex items-center justify-center text-neon-blue border border-accent-purple/30">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white truncate">{activity.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <span className={`text-xs font-medium ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400 mb-2 leading-relaxed">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-500">{activity.time}</span>
                    <span className="text-accent-green font-bold">{activity.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/contributions" className="card-cyber group hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full flex items-center justify-center group-hover:animate-pulse">
              <PlusIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">Submit Work</h4>
            <p className="text-dark-400 text-sm">Share your latest contribution</p>
          </div>
        </Link>
        
        <Link to="/proposals" className="card-cyber group hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent-purple to-accent-violet rounded-full flex items-center justify-center group-hover:animate-pulse">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">Governance</h4>
            <p className="text-dark-400 text-sm">Participate in DAO decisions</p>
          </div>
        </Link>
        
        <Link to="/profile" className="card-cyber group hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-primary-400 rounded-full flex items-center justify-center group-hover:animate-pulse">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">Achievements</h4>
            <p className="text-dark-400 text-sm">View your milestones</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 