import React, { useState, useEffect } from 'react';
import '../styles/StatisticsPage.css';

export default function StatisticsPage() {
  const FIBER_API = '/api/fiber-proxy';

  // Global stats state
  const [platformStats, setPlatformStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);

  // Agent lookup state
  const [agentIdInput, setAgentIdInput] = useState('');
  const [agentStats, setAgentStats] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState(null);

  // Load global stats on mount
  React.useEffect(() => {
    const loadGlobalStats = async () => {
      setGlobalLoading(true);
      setGlobalError(null);
      try {
        // Fetch platform stats
        const statsRes = await fetch(FIBER_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'GET',
            endpoint: 'agent/stats/platform'
          })
        });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setPlatformStats(statsData);
        }

        // Fetch leaderboard
        const lbRes = await fetch(FIBER_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'GET',
            endpoint: 'agent/stats/leaderboard'
          })
        });
        const lbData = await lbRes.json();
        if (lbData.success && lbData.agents) {
          setLeaderboard(lbData.agents);
        }
      } catch (err) {
        setGlobalError('Could not load global stats: ' + err.message);
      } finally {
        setGlobalLoading(false);
      }
    };

    loadGlobalStats();
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!agentIdInput.trim()) return;

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(FIBER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'GET',
          endpoint: `agent/${agentIdInput}/stats`
        })
      });

      const data = await res.json();
      if (data.success) {
        setAgentStats(data);
        setLookupError(null);
      } else {
        setLookupError(data.error || 'Agent not found');
        setAgentStats(null);
      }
    } catch (err) {
      setLookupError('Could not load agent stats: ' + err.message);
      setAgentStats(null);
    } finally {
      setLookupLoading(false);
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
        {/* Global Stats Loading */}
        {globalLoading && <p className="loading-state">Loading network stats…</p>}
        {globalError && <p className="error-state">Error: {globalError}</p>}

        {/* Network Stats */}
        {!globalLoading && (
          <section className="network-section">
            <p className="section-label">NETWORK</p>
            <h2>FiberAgent metrics.</h2>
            <div className="network-grid">
              <div className="network-card">
                <p className="network-label">Total Agents</p>
                <p className="network-value">
                  {platformStats?.total_agents || '0'}
                </p>
              </div>
              <div className="network-card">
                <p className="network-label">Total Searches</p>
                <p className="network-value">
                  {platformStats?.total_searches || '0'}
                </p>
              </div>
              <div className="network-card">
                <p className="network-label">Purchases Tracked</p>
                <p className="network-value">
                  {platformStats?.total_purchases_tracked || '0'}
                </p>
              </div>
              <div className="network-card">
                <p className="network-label">Total Distributed</p>
                <p className="network-value">
                  ${(platformStats?.total_earnings_usd || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Leaderboard */}
        {!globalLoading && (
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
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((agent, idx) => (
                  <div key={idx} className="lb-row">
                    <span className="col rank">{idx + 1}</span>
                    <span className="col name">{agent.agent_name}</span>
                    <span className="col earnings">${(agent.total_earnings_usd || 0).toFixed(2)}</span>
                    <span className="col purchases">{agent.total_purchases_tracked || 0}</span>
                  </div>
                ))
              ) : (
                <p style={{padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)'}}>No agents yet</p>
              )}
            </div>
          </section>
        )}

        {/* Agent Lookup (Optional) */}
        <section className="lookup-section">
          <p className="section-label">LOOKUP AGENT</p>
          <h2>Find a specific agent.</h2>
          <form onSubmit={handleLookup} className="lookup-form">
            <div className="lookup-input-group">
              <input
                type="text"
                value={agentIdInput}
                onChange={(e) => setAgentIdInput(e.target.value)}
                placeholder="agent_12345"
                className="lookup-input"
              />
              <button type="submit" disabled={lookupLoading} className="lookup-btn">
                {lookupLoading ? 'Loading…' : 'View Stats'}
              </button>
            </div>
            {lookupError && <p className="lookup-error">{lookupError}</p>}
          </form>
        </section>

        {/* Agent Stats (if found) */}
        {agentStats && (
          <section className="your-stats-section">
            <p className="section-label">AGENT STATS</p>
            <h2>{agentStats.agent_name}</h2>
            <div className="your-stats-grid">
              <div className="stat-card">
                <p className="stat-label">Total Earnings</p>
                <p className="stat-value">${(agentStats.stats?.total_earnings_usd || 0).toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Purchases Tracked</p>
                <p className="stat-value">{agentStats.stats?.total_purchases_tracked || 0}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Reputation Score</p>
                <p className="stat-value">{(agentStats.stats?.reputation_score || 0).toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Avg Cashback</p>
                <p className="stat-value">${(agentStats.stats?.average_cashback_per_purchase || 0).toFixed(2)}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="stats-footer">
        <p>Live data from Fiber.shop</p>
      </footer>
    </div>
  );
}
