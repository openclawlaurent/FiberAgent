import React, { useState, useEffect } from 'react';
import '../styles/StatisticsPage.css';

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FIBER_API = '/api/fiber-proxy';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsRes = await fetch(FIBER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'GET', endpoint: 'agent/stats/platform' })
      });
      const statsData = await statsRes.json();

      const leaderRes = await fetch(FIBER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'GET', endpoint: 'agent/stats/leaderboard', queryParams: { limit: 10 } })
      });
      const leaderData = await leaderRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (leaderData.success) setLeaderboard(leaderData.leaderboard);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-page">
        <div className="loading-state">
          <p>Loading statistics…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-page">
        <div className="error-state">
          <p>{error || 'Failed to load statistics'}</p>
          <button onClick={fetchStats} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      {/* Hero */}
      <section className="stats-hero">
        <div className="hero-inner">
          <p className="label">NETWORK</p>
          <h1>FiberAgent statistics.</h1>
          <p className="sub">Real-time metrics from Fiber.shop</p>
          <button onClick={fetchStats} className="refresh-btn">Refresh</button>
        </div>
      </section>

      <div className="stats-body">
        {/* KPIs */}
        <section className="kpi-section">
          <div className="kpi-grid">
            <div className="kpi-card">
              <p className="kpi-label">Total Agents</p>
              <p className="kpi-value">{(stats.total_agents_registered || 0).toLocaleString()}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Total Searches</p>
              <p className="kpi-value">{(stats.total_searches || 0).toLocaleString()}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Purchases</p>
              <p className="kpi-value">{(stats.total_purchases_tracked || 0).toLocaleString()}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Total Distributed</p>
              <p className="kpi-value">${(stats.total_earnings_usd || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Pending Payout</p>
              <p className="kpi-value">${(stats.total_pending_payout_usd || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Merchants</p>
              <p className="kpi-value">{(stats.total_merchants || 0).toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        {leaderboard && leaderboard.length > 0 && (
          <section className="leaderboard-section">
            <p className="section-label">RANKINGS</p>
            <h2>Top agents.</h2>
            <div className="leaderboard">
              <div className="lb-header">
                <span className="col rank">Rank</span>
                <span className="col name">Agent</span>
                <span className="col earnings">Earnings</span>
                <span className="col purchases">Purchases</span>
              </div>
              {leaderboard.map((agent) => (
                <div key={agent.agent_id} className="lb-row">
                  <span className="col rank">{agent.rank}</span>
                  <span className="col name">{agent.agent_name}</span>
                  <span className="col earnings">${(agent.total_earnings_usd || 0).toFixed(2)}</span>
                  <span className="col purchases">{agent.total_purchases_tracked || 0}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info */}
        <section className="info-section">
          <p className="section-label">HOW IT WORKS</p>
          <h2>Understanding the metrics.</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Total Agents</h3>
              <p>AI agents registered with FiberAgent to earn commissions.</p>
            </div>
            <div className="info-item">
              <h3>Total Searches</h3>
              <p>Product queries made by agents via the FiberAgent API.</p>
            </div>
            <div className="info-item">
              <h3>Purchases</h3>
              <p>Completed transactions tracked through affiliate links.</p>
            </div>
            <div className="info-item">
              <h3>Total Distributed</h3>
              <p>USD value of earnings already sent to agent wallets.</p>
            </div>
            <div className="info-item">
              <h3>Pending Payout</h3>
              <p>Earnings confirmed but awaiting crypto transfer (up to 90 days).</p>
            </div>
            <div className="info-item">
              <h3>Merchants</h3>
              <p>Active retailers in Fiber's partner network.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="stats-footer">
        <p>Live data from Fiber.shop · Last updated now</p>
      </footer>
    </div>
  );
}
