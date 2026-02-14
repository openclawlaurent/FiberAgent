
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import HeroBackground from '../components/HeroBackground'; // Reusing the fiber nodes
import styles from '../styles/StatisticsPage.module.css';

// Import User Uploaded Logos
import adidasLogo from '../assets/brands/upload/adidas-logo.png';
import aloLogo from '../assets/brands/upload/alo-logo.png';
import bestBuyLogo from '../assets/brands/upload/best-buy-logo.png';
import lowesLogo from '../assets/brands/upload/lowes-logo.png';
import macysLogo from '../assets/brands/upload/macys-logo.png';
import sephoraLogo from '../assets/brands/upload/sephora-logo.png';
import skimsLogo from '../assets/brands/upload/skims-logo.png';
import temuLogo from '../assets/brands/upload/temu-logo.png';
import viatorLogo from '../assets/brands/upload/viator-logo.png';
import walmartLogo from '../assets/brands/upload/walmart-logo.png';

// Import Coin Logos
import monadLogo from '../assets/coins/monad.png';
import solanaLogo from '../assets/coins/solana.png';
import bonkLogo from '../assets/coins/bonk.png';
import chogLogo from '../assets/coins/chog.avif';
import mfLogo from '../assets/coins/moonwalk_fit.png';
import usd1Logo from '../assets/coins/usd1.png';
import valorLogo from '../assets/coins/valor.png';
import penguLogo from '../assets/coins/pengu.png';
import aolLogo from '../assets/coins/aol.png';

// Mock Data Generator (Enhanced)
const generateData = () => {
  // Top Brands on Fiber.shop
  const brands = [
    { name: 'Adidas', logo: adidasLogo },
    { name: 'Alo Yoga', logo: aloLogo },
    { name: 'Best Buy', logo: bestBuyLogo },
    { name: "Lowe's", logo: lowesLogo },
    { name: "Macy's", logo: macysLogo },
    { name: 'Sephora', logo: sephoraLogo },
    { name: 'Skims', logo: skimsLogo },
    { name: 'Temu', logo: temuLogo },
    { name: 'Viator', logo: viatorLogo },
    { name: 'Walmart', logo: walmartLogo }
  ];

  return brands.map(b => ({
    ...b,
    searches: Math.floor(Math.random() * 50000) + 10000,
    volume: Math.floor(Math.random() * 1000000) + 50000,
    conversions: Math.floor(Math.random() * 5000) + 1200, // Monthly conversions
    growth: Math.floor(Math.random() * 20) + 5
  })).sort((a, b) => b.conversions - a.conversions); // Sort by conversions
};

// Cashback Tokens (Mock Data)
const generateCashbackData = () => {
  const tokens = [
    { name: 'MON', logo: monadLogo, color: '#7E3AF2' },
    { name: 'SOL', logo: solanaLogo, color: '#14F195' },
    { name: 'CHOG', logo: chogLogo, color: '#FFD700' },
    { name: 'BONK', logo: bonkLogo, color: '#FFA500' },
    { name: 'MF', logo: mfLogo, color: '#E5FF00' },
    { name: 'USD1', logo: usd1Logo, color: '#00D1FF' },
    { name: 'PENGU', logo: penguLogo, color: '#FF69B4' },
    { name: 'VALOR', logo: valorLogo, color: '#FF4500' },
    { name: 'AOL', logo: aolLogo, color: '#0000FF' }
  ];

  return tokens.map(t => ({
    ...t,
    agents: Math.floor(Math.random() * 800) + 50 // Random agent count
  })).sort((a, b) => b.agents - a.agents);
};

const trendingVerticals = [
  { name: "Fashion", value: 85, color: '#E5FF00' },
  { name: "Tech", value: 65, color: '#00D1FF' },
  { name: "Home", value: 45, color: '#FF4500' },
  { name: "Beauty", value: 30, color: '#FF69B4' },
  { name: "Travel", value: 25, color: '#14F195' },
  { name: "Health", value: 20, color: '#7E3AF2' }
];

export default function StatisticsPage() {
  const brandData = useMemo(() => generateData(), []);
  const cashbackData = useMemo(() => generateCashbackData(), []);

  // Aggregates
  const totalVolume = brandData.reduce((acc, curr) => acc + curr.volume, 0);
  const totalSearches = brandData.reduce((acc, curr) => acc + curr.searches, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <HeroBackground /> {/* Fiber Nodes Background */}
      </div>

      <div className={styles.content}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Fiber Network Stats</h1>
            <p className={styles.subtitle}>Real-time activity across the Fiber Agent ecosystem.</p>
          </div>
          <div className={styles.liveIndicator}>
            <span className={styles.dot}></span> Live Data
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <motion.div
          className={styles.dashboardGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Row 1: Key Metrics */}
          <motion.div className={styles.metricCard} variants={itemVariants}>
            <div className={styles.cardHeader}>Total Volume</div>
            <div className={styles.metricValue}>${(totalVolume / 1000000).toFixed(1)}M</div>
            <div className={styles.metricTrend}>+12.5% <span className={styles.trendLabel}>vs last week</span></div>
            <div className={styles.miniChart}>
              <div className={styles.chartBar} style={{ height: '40%' }}></div>
              <div className={styles.chartBar} style={{ height: '60%' }}></div>
              <div className={styles.chartBar} style={{ height: '30%' }}></div>
              <div className={styles.chartBar} style={{ height: '80%' }}></div>
              <div className={styles.chartBar} style={{ height: '50%' }}></div>
              <div className={styles.chartBar} style={{ height: '100%' }}></div>
            </div>
          </motion.div>

          <motion.div className={styles.metricCard} variants={itemVariants}>
            <div className={styles.cardHeader}>Total Searches</div>
            <div className={styles.metricValue}>{(totalSearches / 1000).toFixed(1)}k</div>
            <div className={styles.metricTrend}>+8.2% <span className={styles.trendLabel}>vs last week</span></div>
            <div className={styles.miniChart}>
              <div className={styles.chartBar} style={{ height: '30%' }}></div>
              <div className={styles.chartBar} style={{ height: '40%' }}></div>
              <div className={styles.chartBar} style={{ height: '60%' }}></div>
              <div className={styles.chartBar} style={{ height: '50%' }}></div>
              <div className={styles.chartBar} style={{ height: '70%' }}></div>
              <div className={styles.chartBar} style={{ height: '90%' }}></div>
            </div>
          </motion.div>

          <motion.div className={styles.metricCard} variants={itemVariants}>
            <div className={styles.cardHeader}>Active Agents</div>
            <div className={styles.metricValue}>1,243</div>
            <div className={styles.metricTrend}>+15% <span className={styles.trendLabel}>new agents</span></div>
            <div className={styles.miniChart}>
              <div className={styles.chartBar} style={{ height: '20%' }}></div>
              <div className={styles.chartBar} style={{ height: '35%' }}></div>
              <div className={styles.chartBar} style={{ height: '50%' }}></div>
              <div className={styles.chartBar} style={{ height: '60%' }}></div>
              <div className={styles.chartBar} style={{ height: '80%' }}></div>
              <div className={styles.chartBar} style={{ height: '95%' }}></div>
            </div>
          </motion.div>

          {/* Cashback List (Scrollable) */}
          <motion.div className={`${styles.metricCard} ${styles.scrollCard}`} variants={itemVariants}>
            <div className={styles.cardHeader}>Cashback Token Ranking</div>
            <div className={styles.cashbackList}>
              {cashbackData.map((token, index) => (
                <div key={token.name} className={styles.cashbackItem}>
                  <div className={styles.cashbackRank}>#{index + 1}</div>
                  <div className={styles.tokenAvatar} style={{
                    backgroundColor: token.logo ? 'transparent' : token.color,
                    border: token.logo ? 'none' : `1px solid ${token.color}` // Clean look for logos
                  }}>
                    {token.logo ? (
                      <img src={token.logo} alt={token.name} className={styles.tokenLogoImg} />
                    ) : (
                      token.name[0]
                    )}
                  </div>
                  <div className={styles.tokenInfo}>
                    <div className={styles.tokenName}>{token.name}</div>
                    <div className={styles.tokenKey}>Selected by</div>
                  </div>
                  <div className={styles.tokenCount}>{token.agents}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Row 2: Trending Verticals (Vertical Bar Chart) & Top Brands */}
          <motion.div className={`${styles.dashboardCard} ${styles.colSpan1}`} variants={itemVariants}>
            <h3 className={styles.cardTitle}>Trending Verticals</h3>
            <div className={styles.verticalChart}>
              {trendingVerticals.map((v, i) => (
                <div key={v.name} className={styles.verticalBarContainer}>
                  <div className={styles.vBarWrapper}>
                    <motion.div
                      className={styles.vBarFill}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${v.value}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ backgroundColor: v.color }}
                    />
                  </div>
                  <span className={styles.vBarLabel}>{v.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className={`${styles.dashboardCard} ${styles.colSpan2}`} variants={itemVariants}>
            <h3 className={styles.cardTitle}>Top Performing Brands</h3>
            <div className={styles.brandsGrid}>
              {brandData.slice(0, 6).map((brand, index) => (
                <div key={brand.name} className={styles.inputCard}> {/* Reusing styled card look */}
                  <div className={styles.brandHeader}>
                    <div className={styles.brandLogoContainer}>
                      <img src={brand.logo} alt={brand.name} className={styles.brandLogoImg} />
                    </div>
                    <div>
                      <div className={styles.brandName}>{brand.name}</div>
                      <div className={styles.brandSub}>{brand.conversions.toLocaleString()} Sales</div>
                    </div>
                  </div>
                  <div className={styles.brandGraph}>
                    <div className={styles.brandBarFill} style={{ width: `${(brand.conversions / brandData[0].conversions) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
