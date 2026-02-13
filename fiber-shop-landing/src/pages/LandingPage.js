import React from 'react';
import '../styles/LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-label">AGENT INFRASTRUCTURE</p>
          <h1>
            The agent layer<br />
            for commerce.
          </h1>
          <p className="hero-sub">
            FiberAgent is the behavioral intelligence layer for agentic commerce — 
            connecting AI agents to 50,000+ merchants with personalized deals and on-chain rewards.
          </p>
          <p className="hero-tagline">Agents query. Users earn. Everyone gets paid.</p>
          <div className="hero-actions">
            <a href="/demo" className="btn-main">Try the Demo</a>
            <a href="/agent" className="btn-outline">For Agents</a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-num">50,000+</span>
            <span className="stat-desc">Merchants</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">$3T</span>
            <span className="stat-desc">Crypto economy</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">2M+</span>
            <span className="stat-desc">Token holders</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">1</span>
            <span className="stat-desc">Intelligence layer</span>
          </div>
        </div>
      </section>

      {/* What */}
      <section className="section">
        <div className="section-inner">
          <p className="section-label">WHAT IS FIBERAGENT</p>
          <h2>Have your agent<br />call my agent.</h2>
          <p className="section-text">
            AI agents need commerce. FiberAgent provides it.
          </p>
          <p className="section-text dim">
            Your agent queries FiberAgent with a wallet address and a shopping intent. 
            FiberAgent analyzes on-chain behavior and purchase history to return 
            personalized deals with real cashback. The user buys. The agent earns a kickback. 
            Fiber takes a cut. Everyone wins.
          </p>
        </div>
      </section>

      {/* How */}
      <section className="section dark">
        <div className="section-inner">
          <p className="section-label">HOW IT WORKS</p>
          <h2>Four steps to revenue.</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3>Register</h3>
              <p>Connect your wallet. Get an agent ID. Takes 30 seconds.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h3>Query</h3>
              <p>Send a search request with keywords and a wallet address. FiberAgent returns personalized results.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h3>Share</h3>
              <p>Give your user the affiliate link. They click, they shop, they earn cashback.</p>
            </div>
            <div className="step-card">
              <span className="step-num">04</span>
              <h3>Earn</h3>
              <p>You receive a kickback in MON or BONK. Automatic. On-chain. No invoices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section">
        <div className="section-inner">
          <p className="section-label">WHY FIBERAGENT</p>
          <h2>Unfair advantages.</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Behavioral Intelligence</h3>
              <p>
                On-chain signals + real purchase data = deals that actually convert.
                Not guessing from an NFT. Knowing they bought running shoes last month.
              </p>
            </div>
            <div className="feature-item">
              <h3>50,000+ Merchants</h3>
              <p>
                Real commission structures via Wildfire's affiliate network.
                Nike. Adidas. Walmart. Not mock data.
              </p>
            </div>
            <div className="feature-item">
              <h3>Agent Economics</h3>
              <p>
                Every agent in the chain gets paid. Kickbacks flow automatically.
                No contracts. No negotiations. Just code.
              </p>
            </div>
            <div className="feature-item">
              <h3>On-Chain Reputation</h3>
              <p>
                ERC-8004 identity registry on Monad. Trust built through performance, 
                not promises. Higher scores unlock better rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section dark">
        <div className="section-inner cta-section">
          <h2>The new era of<br />agent commerce.</h2>
          <p className="section-text">
            Register your agent. Start earning. Build reputation.
          </p>
          <div className="hero-actions">
            <a href="/demo" className="btn-main">Launch Demo</a>
            <a href="/agent" className="btn-outline">Read the Docs</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">FiberAgent</span>
          <span className="footer-links">
            <a href="https://fiber.shop" target="_blank" rel="noopener noreferrer">fiber.shop</a>
            <a href="https://x.com/fiber_shop" target="_blank" rel="noopener noreferrer">Twitter</a>
          </span>
          <span className="footer-copy">Powered by Fiber · Built on Monad</span>
        </div>
      </footer>
    </div>
  );
}
