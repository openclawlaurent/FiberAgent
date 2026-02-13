import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AgentPage.css';

export default function AgentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedToken, setSelectedToken] = useState('MON');
  const tokens = ['MON', 'BONK'];

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/fiber-shop?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => setProducts(data.results || []))
        .catch(err => console.error(err));
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="agent-page">
      {/* Header */}
      <section className="page-hero">
        <div className="hero-inner">
          <p className="label">FOR AGENTS</p>
          <h1>Build revenue, not features.</h1>
          <p className="sub">Register once. Search forever. Earn automatically.</p>
        </div>
      </section>

      <div className="page-body">
        {/* Dashboard Cards */}
        <section className="dashboard-section">
          <div className="dashboard-grid">
            <div className="dash-card">
              <p className="card-label">Your Earnings</p>
              <p className="card-value">$0.00</p>
              <p className="card-desc">This month</p>
            </div>
            <div className="dash-card">
              <p className="card-label">Active Users</p>
              <p className="card-value">0</p>
              <p className="card-desc">Shopping through you</p>
            </div>
            <div className="dash-card">
              <p className="card-label">Payout Token</p>
              <div className="token-selector">
                {tokens.map(t => (
                  <button
                    key={t}
                    className={`token-btn ${selectedToken === t ? 'active' : ''}`}
                    onClick={() => setSelectedToken(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="card-desc">Receive {selectedToken} on conversion</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-section">
          <p className="section-label">THE PROCESS</p>
          <h2>Three steps to revenue.</h2>
          <div className="steps-layout">
            <div className="how-step">
              <span className="step-num">01</span>
              <h3>Register</h3>
              <p>You already did. Your agent ID is ready to query FiberAgent.</p>
            </div>
            <div className="how-step">
              <span className="step-num">02</span>
              <h3>Query & Share</h3>
              <p>Your agent searches FiberAgent. You share the affiliate link with your users.</p>
            </div>
            <div className="how-step">
              <span className="step-num">03</span>
              <h3>Earn</h3>
              <p>User buys. You get a kickback in {selectedToken}. Automatic. On-chain.</p>
            </div>
          </div>
        </section>

        {/* Search Products */}
        <section className="products-section">
          <p className="section-label">SEARCH</p>
          <h2>Find what your users want.</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="shoes, electronics, food…"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <p>Start searching to see products and earnings.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <a
                  key={product.productId}
                  href={product.affiliate_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-card"
                >
                  <div className="pc-image">
                    <img src={product.image || ''} alt={product.title} />
                  </div>
                  <div className="pc-body">
                    <h4>{product.title}</h4>
                    <span className="pc-shop">{product.shop?.name}</span>
                    <span className="pc-earn">{(product.cashback?.amount * 0.2).toFixed(2)} {selectedToken}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Tips */}
        <section className="tips-section">
          <p className="section-label">TIPS</p>
          <h2>Maximize your earnings.</h2>
          <div className="tips-grid">
            <div className="tip-box">
              <h3>Share What Converts</h3>
              <p>Find products your users actually buy. Quality over quantity.</p>
            </div>
            <div className="tip-box">
              <h3>Build on Trust</h3>
              <p>Your reputation score grows with every successful transaction.</p>
            </div>
            <div className="tip-box">
              <h3>Real-time Payouts</h3>
              <p>No waiting. Earnings hit your wallet as transactions confirm.</p>
            </div>
            <div className="tip-box">
              <h3>API-First</h3>
              <p>Integrate FiberAgent directly into your agent. One API call per search.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="page-footer">
        <p>Build with Fiber. Deploy on Monad.</p>
      </footer>
    </div>
  );
}
