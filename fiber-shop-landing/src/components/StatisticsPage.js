import React, { useState, useEffect } from 'react';
import '../styles/StatisticsPage.css';

export default function StatisticsPage() {
  const FIBER_API = '/api/fiber-proxy';

  // Input state
  const [agentIdInput, setAgentIdInput] = useState('');
  const [agentId, setAgentId] = useState(null);
  
  // Stats state
  const [agentStats, setAgentStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded top agents (for demo)
  const demoLeaderboard = [
    { rank: 1, agent_name: 'ShopBot Prime', total_earnings_usd: 2450.50, total_purchases_tracked: 487 },
    { rank: 2, agent_name: 'RetailAI', total_earnings_usd: 1890.25, total_purchases_tracked: 356 },
    { rank: 3, agent_name: 'DealFinder', total_earnings_usd: 1620.75, total_purchases_tracked: 298 },
    { rank: 4, agent_name: 'Commerce Agent', total_earnings_usd: 1440.00, total_purchases_tracked: 267 },
    { rank: 5, agent_name: 'Smart Shopper', total_earnings_usd: 1210.30, total_purchases_tracked: 219 },
  ];

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!agentIdInput.trim()) return;

    setAgentId(agentIdInput);
    setLoading(true);
    setError(null);

    try {
      // Fetch agent-specific stats
      const res = await fetch(FIBER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'GET', endpoint: `agent/${agentIdInput}` })
      });

      const data = await res.json();
      if (data.success) {
        setAgentStats(data);
        setError(null);
      } else {
        setError('Agent not found');
        setAgentStats(null);
      }
    } catch (err) {
      setError('Could not load agent stats: ' + err.message);
      setAgentStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stats-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="hero-inner">
          <p className="label">STATISTICS</p>
          <h1>Track your performance.</h1>
          <p className="sub">Enter your agent ID to see your earnings and stats.</p>
        </div>
      </section>

      <div className="page-body">
        {/* Lookup Section */}
        <section className="lookup-section">
          <form onSubmit={handleLookup} className="lookup-form">
            <div className="lookup-input-group">
              <input
                type="text"
                value={agentIdInput}
                onChange={(e) => setAgentIdInput(e.target.value)}
                placeholder="agent_12345"
                className="lookup-input"
              />
              <button type="submit" disabled={loading} className="lookup-btn">
                {loading ? 'Loading…' : 'View Stats'}
              </button>
            </div>
            {error && <p className="lookup-error">{error}</p>}
          </form>
        </section>

        {/* Your Stats (if agent found) */}
        {agentStats && agentId && (
          <section className="your-stats-section">
            <p className="section-label">YOUR PERFORMANCE</p>
            <h2>Agent {agentId}</h2>
            <div className="your-stats-grid">
              <div className="stat-card">
                <p className="stat-label">Your Earnings</p>
                <p className="stat-value">${(agentStats.total_earnings_usd || 0).toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Purchases Tracked</p>
                <p className="stat-value">{agentStats.total_purchases_tracked || 0}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Reputation Score</p>
                <p className="stat-value">{(agentStats.reputation_score || 0).toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Status</p>
                <p className="stat-value">{agentStats.status || 'Active'}</p>
              </div>
            </div>
          </section>
        )}

        {/* Network Stats */}
        <section className="network-section">
          <p className="section-label">NETWORK</p>
          <h2>FiberAgent metrics.</h2>
          <div className="network-grid">
            <div className="network-card">
              <p className="network-label">Total Agents</p>
              <p className="network-value">Loading…</p>
            </div>
            <div className="network-card">
              <p className="network-label">Total Searches</p>
              <p className="network-value">Loading…</p>
            </div>
            <div className="network-card">
              <p className="network-label">Purchases Tracked</p>
              <p className="network-value">Loading…</p>
            </div>
            <div className="network-card">
              <p className="network-label">Total Distributed</p>
              <p className="network-value">Loading…</p>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="leaderboard-section">
          <p className="section-label">TOP AGENTS</p>
          <h2>Leaderboard.</h2>
          <div className="leaderboard">
            <div className="lb-header">
              <span className="col rank">Rank</span>
              <span className="col name">Agent</span>
              <span className="col earnings">Earnings</span>
              <span className="col purchases">Purchases</span>
            </div>
            {demoLeaderboard.map((agent) => (
              <div key={agent.rank} className="lb-row">
                <span className="col rank">{agent.rank}</span>
                <span className="col name">{agent.agent_name}</span>
                <span className="col earnings">${agent.total_earnings_usd.toFixed(2)}</span>
                <span className="col purchases">{agent.total_purchases_tracked}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="stats-footer">
        <p>Live data from Fiber.shop</p>
      </footer>
    </div>
  );
}
