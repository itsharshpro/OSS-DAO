import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  CodeBracketIcon,
  UserIcon,
  WalletIcon 
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isConnected, account, connectWallet, disconnect, isLoading } = useWeb3();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Proposals', href: '/proposals', icon: DocumentTextIcon },
    { name: 'Contributions', href: '/contributions', icon: CodeBracketIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const isActive = (href: string) => location.pathname === href;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-dark-50 cyber-grid flex flex-col">
      {/* Cyber Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-glow opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-glow opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <div className="bg-dark-100/80 backdrop-blur-xl border border-dark-300/50 rounded-2xl shadow-2xl">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold neon-text flex-shrink-0 mr-8">
                <span className="text-white">OSS</span> <span className="text-neon-blue">DAO</span>
              </Link>

              {/* Navigation Links - Desktop */}
              <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30'
                          : 'text-dark-700 hover:text-white hover:bg-dark-200/50'
                      } inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent whitespace-nowrap`}
                    >
                      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Wallet Connection */}
              <div className="flex items-center flex-shrink-0 ml-4">
                {isConnected ? (
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block px-3 py-2 bg-dark-200/60 rounded-xl border border-dark-400/30">
                      <span className="text-sm text-neon-blue font-mono whitespace-nowrap">
                        {formatAddress(account!)}
                      </span>
                    </div>
                    <button
                      onClick={disconnect}
                      className="px-4 py-2 bg-dark-200/60 hover:bg-red-500/20 border border-dark-400/30 hover:border-red-500/50 text-dark-700 hover:text-red-400 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30 hover:border-neon-blue/50 text-neon-blue rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
                  >
                    <WalletIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden border-t border-dark-300/30">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30'
                        : 'text-dark-700 hover:text-white hover:bg-dark-200/50'
                    } flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent`}
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-100/90 border-t border-dark-300/50 backdrop-blur-xl mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
              <p className="text-sm text-dark-700">
                © 2025 <span className="text-neon-blue font-semibold">OSS DAO</span>. Empowering open-source contributors through decentralized governance.
              </p>
              <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <p className="text-xs text-dark-600">
              Built on <span className="text-accent-purple font-medium">Ethereum Holesky Testnet</span> 
              <span className="mx-2 text-neon-blue">⚡</span>
              Powered by <span className="text-neon-blue font-medium">Web3 Technology</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 