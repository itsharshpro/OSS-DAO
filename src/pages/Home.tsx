import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  CubeTransparentIcon, 
  UsersIcon, 
  GiftIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { isConnected } = useWeb3();

  const features = [
    {
      icon: GiftIcon,
      title: 'Token Rewards',
      description: 'Earn OSS tokens for your valuable contributions to open-source projects through smart contract automation.',
      color: 'text-accent-green',
      gradient: 'from-accent-green to-accent-emerald'
    },
    {
      icon: UsersIcon,
      title: 'Community Validation',
      description: 'Decentralized community consensus determines contribution value through transparent voting mechanisms.',
      color: 'text-accent-purple',
      gradient: 'from-accent-purple to-accent-violet'
    },
    {
      icon: CubeTransparentIcon,
      title: 'DAO Governance',
      description: 'Participate in decentralized governance and shape the future of open-source funding protocols.',
      color: 'text-neon-blue',
      gradient: 'from-neon-blue to-primary-400'
    },
    {
      icon: ChartBarIcon,
      title: 'Impact Analytics',
      description: 'Track your impact with real-time analytics and see how your contributions benefit the ecosystem.',
      color: 'text-accent-orange',
      gradient: 'from-accent-orange to-neon-yellow'
    }
  ];

  const stats = [
    { label: 'Contributors', value: '1,234', suffix: '+', icon: '👥' },
    { label: 'Tokens Distributed', value: '2.5M', suffix: '', icon: '💰' },
    { label: 'Active Proposals', value: '47', suffix: '', icon: '📋' },
    { label: 'Projects Funded', value: '156', suffix: '+', icon: '🚀' },
  ];

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-neon-blue/10 rounded-full animate-float blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent-purple/10 rounded-full animate-float blur-xl" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-neon-pink/5 to-neon-blue/5 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-dark-200/50 to-dark-300/50 px-4 py-2 rounded-full border border-neon-blue/30 mb-8 animate-slide-up">
            <SparklesIcon className="w-5 h-5 text-neon-blue" />
            <span className="text-sm text-neon-blue font-semibold">Revolutionizing Open Source Funding</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-slide-up">
            <span className="neon-text">Rewarding</span>
            <br />
            <span className="bg-gradient-to-r from-accent-green via-neon-blue to-accent-purple bg-clip-text text-transparent">
              Open Source Excellence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-dark-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Join a <span className="text-neon-blue font-semibold">decentralized platform</span> where your open-source contributions are recognized, 
            rewarded with <span className="text-accent-green font-semibold">crypto tokens</span>, and evaluated by the 
            <span className="text-accent-purple font-semibold"> global developer community</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {isConnected ? (
              <Link
                to="/dashboard"
                className="btn-neon px-10 py-4 text-lg flex items-center space-x-3 group whitespace-nowrap"
              >
                <RocketLaunchIcon className="w-6 h-6 group-hover:rotate-12 transition-transform flex-shrink-0" />
                <span>Launch Dashboard</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            ) : (
              <div className="card-cyber px-8 py-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="w-6 h-6 text-neon-blue flex-shrink-0" />
                  <p className="text-dark-600">Connect your wallet to access the platform</p>
                </div>
              </div>
            )}
            <Link
              to="/contributions"
              className="btn-cyber px-10 py-4 text-lg group flex items-center space-x-2 whitespace-nowrap"
            >
              <span>Explore Ecosystem</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold neon-text mb-4 animate-slide-up">Platform Metrics</h2>
          <p className="text-dark-600 animate-slide-up" style={{ animationDelay: '0.1s' }}>Real-time impact of our decentralized ecosystem</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card-cyber text-center floating-card holographic" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold neon-text mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-dark-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold neon-text mb-6 animate-slide-up">
            How The System Works
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A transparent, <span className="text-neon-blue">blockchain-powered</span> process for recognizing and rewarding valuable open-source work
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-cyber floating-card group hover:scale-105 transition-all duration-500" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:animate-pulse`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4">
        <div className="card-cyber p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold neon-text mb-4">
              Get Started in 3 Steps
            </h3>
            <p className="text-dark-600">Simple onboarding process for immediate participation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-neon-blue to-primary-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-neon animate-pulse">
                  1
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-neon-blue to-primary-400 rounded-full mx-auto opacity-50 animate-ping"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">Submit Your Work</h4>
              <p className="text-dark-600 leading-relaxed">Submit your open-source contributions with detailed project information and impact metrics for community evaluation.</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-accent-purple to-accent-violet rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-neon animate-pulse" style={{ animationDelay: '0.5s' }}>
                  2
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-accent-purple to-accent-violet rounded-full mx-auto opacity-50 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">Community Validation</h4>
              <p className="text-dark-600 leading-relaxed">Decentralized community validates and votes on contribution value through transparent blockchain-based consensus mechanisms.</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-neon animate-pulse" style={{ animationDelay: '1s' }}>
                  3
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-accent-green to-accent-emerald rounded-full mx-auto opacity-50 animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">Earn Crypto Rewards</h4>
              <p className="text-dark-600 leading-relaxed">Receive OSS tokens automatically through smart contracts based on community consensus and contribution quality assessment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 text-center">
        <div className="relative card-cyber p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-accent-purple/10 to-neon-pink/10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 mb-6">
              <SparklesIcon className="w-6 h-6 text-neon-blue animate-spin" />
              <span className="text-neon-blue font-semibold">Join the Revolution</span>
              <SparklesIcon className="w-6 h-6 text-neon-blue animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
            <h3 className="text-4xl font-bold neon-text mb-6">
              Ready to Get Rewarded?
            </h3>
            <p className="text-xl text-dark-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join <span className="text-accent-green font-semibold">thousands of developers</span> earning crypto tokens for their 
              <span className="text-neon-blue font-semibold"> open-source contributions</span> in the decentralized economy.
            </p>
            {isConnected ? (
              <Link
                to="/contributions"
                className="btn-neon px-12 py-4 text-lg group inline-flex items-center space-x-3 whitespace-nowrap"
              >
                <RocketLaunchIcon className="w-6 h-6 group-hover:rotate-12 transition-transform flex-shrink-0" />
                <span>Submit Your First Contribution</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            ) : (
              <div className="inline-block">
                <div className="bg-gradient-to-r from-dark-300/50 to-dark-400/50 px-8 py-4 rounded-lg border border-neon-blue/30">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-6 h-6 text-neon-blue animate-pulse flex-shrink-0" />
                    <p className="text-white font-semibold">Connect your wallet to start earning</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 