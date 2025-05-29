import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  TrophyIcon,
  StarIcon,
  CalendarIcon,
  FireIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { isConnected, account } = useWeb3();

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="card-cyber max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-accent-purple rounded-full flex items-center justify-center animate-glow">
              <StarIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold neon-text mb-4">Connect Your Wallet</h2>
            <p className="text-dark-600 mb-6">
              Please connect your wallet to view your profile and achievements.
            </p>
            <div className="text-sm text-dark-700">
              Access your decentralized identity and track your contributions
            </div>
          </div>
        </div>
      </div>
    );
  }

  const achievements = [
    {
      title: 'Pioneer Contributor',
      description: 'Made your first open-source contribution to the DAO',
      icon: '🎯',
      gradient: 'from-neon-blue to-accent-cyan',
      earned: true,
      date: '2024-01-10',
      rarity: 'Common',
      points: 100
    },
    {
      title: 'Bug Hunter Elite',
      description: 'Successfully identified and fixed 5+ critical vulnerabilities',
      icon: '🐛',
      gradient: 'from-accent-green to-accent-emerald',
      earned: true,
      date: '2024-01-12',
      rarity: 'Rare',
      points: 250
    },
    {
      title: 'Community Leader',
      description: 'Received 100+ community votes and positive feedback',
      icon: '👑',
      gradient: 'from-accent-purple to-accent-violet',
      earned: true,
      date: '2024-01-14',
      rarity: 'Epic',
      points: 500
    },
    {
      title: 'Security Guardian',
      description: 'Fixed critical security vulnerabilities',
      icon: '🔒',
      gradient: 'from-accent-rose to-accent-pink',
      earned: true,
      date: '2024-01-15',
      rarity: 'Legendary',
      points: 750
    },
    {
      title: 'Documentation Master',
      description: 'Contributed comprehensive documentation to 10+ projects',
      icon: '📚',
      gradient: 'from-accent-orange to-neon-yellow',
      earned: false,
      date: null,
      rarity: 'Epic',
      points: 400
    },
    {
      title: 'Performance Optimizer',
      description: 'Optimized performance in 5+ high-impact projects',
      icon: '⚡',
      gradient: 'from-neon-purple to-neon-pink',
      earned: false,
      date: null,
      rarity: 'Rare',
      points: 300
    },
    {
      title: 'Innovation Pioneer',
      description: 'Introduced groundbreaking features or technologies',
      icon: '💡',
      gradient: 'from-neon-green to-accent-emerald',
      earned: false,
      date: null,
      rarity: 'Mythic',
      points: 1000
    },
    {
      title: 'Code Architect',
      description: 'Designed and implemented complex system architectures',
      icon: '🏗️',
      gradient: 'from-primary-400 to-neon-blue',
      earned: false,
      date: null,
      rarity: 'Legendary',
      points: 800
    }
  ];

  const contributionHistory = [
    {
      month: 'January 2024',
      contributions: 8,
      rewards: 1250,
      votes: 45,
      trending: true
    },
    {
      month: 'December 2023',
      contributions: 5,
      rewards: 800,
      votes: 32,
      trending: false
    },
    {
      month: 'November 2023',
      contributions: 12,
      rewards: 1800,
      votes: 67,
      trending: true
    },
    {
      month: 'October 2023',
      contributions: 3,
      rewards: 450,
      votes: 18,
      trending: false
    }
  ];

  const stats = [
    {
      label: 'Total Contributions',
      value: '28',
      icon: ChartBarIcon,
      color: 'text-neon-blue',
      change: '+12%'
    },
    {
      label: 'Total Earned',
      value: '4,300 OSS',
      icon: CurrencyDollarIcon,
      color: 'text-accent-green',
      change: '+18%'
    },
    {
      label: 'Reputation Score',
      value: '2,847',
      icon: StarIcon,
      color: 'text-accent-purple',
      change: '+5%'
    },
    {
      label: 'Active Streak',
      value: '23 days',
      icon: FireIcon,
      color: 'text-accent-orange',
      change: 'New!'
    }
  ];

  const recentActivity = [
    {
      type: 'contribution',
      title: 'Smart Contract Optimization',
      date: '2 hours ago',
      reward: '+150 OSS',
      category: 'Performance'
    },
    {
      type: 'vote',
      title: 'Governance Proposal Participation',
      date: '5 hours ago',
      reward: '+5 OSS',
      category: 'Governance'
    },
    {
      type: 'achievement',
      title: 'Earned "Security Guardian" badge',
      date: '1 day ago',
      reward: '+50 OSS',
      category: 'Achievement'
    },
    {
      type: 'contribution',
      title: 'DeFi Protocol Enhancement',
      date: '2 days ago',
      reward: '+300 OSS',
      category: 'Feature'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <CodeBracketIcon className="w-5 h-5" />;
      case 'vote':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'achievement':
        return <TrophyIcon className="w-5 h-5" />;
      default:
        return <StarIcon className="w-5 h-5" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-orange-400';
      case 'Mythic': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-gradient-to-r from-neon-blue via-accent-purple to-neon-pink rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white animate-glow shadow-cyber">
            {account?.slice(2, 4).toUpperCase()}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{earnedAchievements}</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold neon-text mb-2">Your Profile</h1>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-dark-200/50 to-dark-300/50 rounded-lg border border-neon-blue/30">
          <span className="text-neon-blue font-mono text-sm">
            {account?.slice(0, 8)}...{account?.slice(-6)}
          </span>
        </div>
        <div className="mt-4 text-sm text-dark-600">
          <span className="text-accent-purple font-semibold">{totalPoints}</span> Achievement Points Earned
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-cyber text-center floating-card holographic">
              <div className={`${stat.color} mb-3 flex justify-center animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-dark-600 mb-2">{stat.label}</div>
              <div className="text-xs text-accent-green font-semibold">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="card-cyber">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold neon-text flex items-center space-x-2">
            <TrophyIcon className="w-7 h-7 text-neon-blue" />
            <span>Achievement Gallery</span>
          </h2>
          <div className="text-sm text-dark-600">
            {earnedAchievements} of {achievements.length} unlocked
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`achievement-badge ${achievement.earned ? 'earned' : 'not-earned'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${achievement.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {achievement.icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">{achievement.title}</h3>
                <p className="text-sm text-dark-600 mb-3 leading-relaxed">{achievement.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)} bg-current/10`}>
                    {achievement.rarity}
                  </span>
                  <span className="text-xs text-accent-purple font-semibold">
                    {achievement.points} pts
                  </span>
                </div>
                
                {achievement.earned && achievement.date && (
                  <div className="flex items-center justify-center space-x-1 text-xs text-accent-green">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{achievement.date}</span>
                  </div>
                )}
                {!achievement.earned && (
                  <div className="text-xs text-dark-700 italic">
                    Keep contributing to unlock!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution History */}
      <div className="card-cyber">
        <h2 className="text-2xl font-bold neon-text mb-6 flex items-center space-x-2">
          <ChartBarIcon className="w-7 h-7 text-neon-blue" />
          <span>Contribution Timeline</span>
        </h2>
        
        <div className="space-y-4">
          {contributionHistory.map((period, index) => (
            <div key={index} className="relative p-6 bg-gradient-to-r from-dark-200/50 to-dark-300/50 rounded-xl border border-dark-400/30 hover:border-neon-blue/50 transition-all duration-300 floating-card">
              {period.trending && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full text-xs font-bold text-white animate-pulse">
                  🔥 Trending
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{period.month}</h3>
                  <p className="text-sm text-dark-600 mt-1">
                    <span className="text-neon-blue font-semibold">{period.contributions}</span> contributions • 
                    <span className="text-accent-purple font-semibold"> {period.votes}</span> votes received
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent-green mb-1">
                    +{period.rewards} OSS
                  </div>
                  <div className="text-sm text-dark-600">Total earned</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-cyber">
        <h2 className="text-2xl font-bold neon-text mb-6 flex items-center space-x-2">
          <RocketLaunchIcon className="w-7 h-7 text-neon-blue" />
          <span>Recent Activity</span>
        </h2>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-dark-200/30 to-dark-300/30 rounded-lg border border-dark-400/20 hover:border-accent-purple/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-purple/20 to-neon-blue/20 rounded-full flex items-center justify-center text-neon-blue border border-accent-purple/30">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{activity.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-dark-600">
                  <span>{activity.date}</span>
                  <span>•</span>
                  <span className="text-accent-purple">{activity.category}</span>
                </div>
              </div>
              <div className="text-accent-green font-bold">
                {activity.reward}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Profile Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-cyber">
          <h3 className="text-xl font-bold neon-text mb-6 flex items-center space-x-2">
            <LightBulbIcon className="w-6 h-6 text-neon-blue" />
            <span>Expertise Areas</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-dark-700 font-medium">Smart Contracts</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-400 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-accent-green to-accent-emerald h-3 rounded-full animate-pulse" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm text-accent-green font-semibold">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-700 font-medium">Security Auditing</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-400 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-accent-purple to-accent-violet h-3 rounded-full animate-pulse" style={{ width: '78%', animationDelay: '0.5s' }}></div>
                </div>
                <span className="text-sm text-accent-purple font-semibold">78%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-700 font-medium">Performance Optimization</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-400 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-neon-blue to-primary-400 h-3 rounded-full animate-pulse" style={{ width: '72%', animationDelay: '1s' }}></div>
                </div>
                <span className="text-sm text-neon-blue font-semibold">72%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <h3 className="text-xl font-bold neon-text mb-6 flex items-center space-x-2">
            <ShieldCheckIcon className="w-6 h-6 text-neon-blue" />
            <span>Community Standing</span>
          </h3>
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="text-4xl font-bold neon-text">#47</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">↗</span>
              </div>
            </div>
            <p className="text-dark-600 mb-6">Global Ranking</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-dark-300/30 to-dark-400/30 rounded-lg">
                <span className="text-dark-600">Percentile:</span>
                <span className="text-accent-green font-semibold">Top 5%</span>
              </div>
              <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-dark-300/30 to-dark-400/30 rounded-lg">
                <span className="text-dark-600">Reputation Score:</span>
                <span className="text-neon-blue font-semibold">2,847</span>
              </div>
              <div className="flex justify-between text-sm p-3 bg-gradient-to-r from-dark-300/30 to-dark-400/30 rounded-lg">
                <span className="text-dark-600">Trust Level:</span>
                <span className="text-accent-purple font-semibold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 