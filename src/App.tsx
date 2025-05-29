import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Proposals from './pages/Proposals';
import Contributions from './pages/Contributions';
import Profile from './pages/Profile';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-dark-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App; 