
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AgentStats.module.css';

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

const BRAND_ASSETS = {
    Adidas: adidasLogo,
    "Alo Yoga": aloLogo,
    "Best Buy": bestBuyLogo,
    "Lowe's": lowesLogo,
    "Macy's": macysLogo,
    Sephora: sephoraLogo,
    Skims: skimsLogo,
    Temu: temuLogo,
    Viator: viatorLogo,
    Walmart: walmartLogo
};
const BRAND_NAMES = Object.keys(BRAND_ASSETS);

const generateMockData = () => {
    // Generate 50 random entries simulating database records
    const entries = Array.from({ length: 50 }, (_, i) => {
        const brandName = BRAND_NAMES[Math.floor(Math.random() * BRAND_NAMES.length)];
        return {
            id: i,
            sales: Math.floor(Math.random() * 500) + 50, // $50 - $550
            token: Math.random() > 0.4 ? 'MON' : 'BONK', // 60% MON, 40% BONK preference
            brand: brandName,
            brandImage: BRAND_ASSETS[brandName]
        };
    });
    return entries;
};

export default function AgentStats() {
    const data = useMemo(() => generateMockData(), []);

    // Aggregations
    const totalAgents = 1243; // Hardcoded "live" stat baselines + random drift
    const totalSearches = 89021;
    const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0) + 450000; // Base + mock

    // Top 5 Brands
    const brandCounts = data.reduce((acc, curr) => {
        if (!acc[curr.brand]) {
            acc[curr.brand] = { count: 0, image: curr.brandImage };
        }
        acc[curr.brand].count += 1;
        return acc;
    }, {});

    const sortedBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);
    const maxBrandCount = Math.max(...sortedBrands.map(b => b[1].count));

    // Token Distribution
    const tokenStats = data.reduce((acc, curr) => {
        acc[curr.token] = (acc[curr.token] || 0) + curr.sales;
        return acc;
    }, { MON: 0, BONK: 0 });
    const totalTokenValue = tokenStats.MON + tokenStats.BONK;

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className={styles.section} id="stats">
            <div className={styles.header}>
                <h2 className={styles.title}>Live Agent Activity</h2>
                <p className={styles.subtitle}>Real-time network performance metrics</p>
            </div>

            <div className={styles.grid}>
                {/* Key Metrics Cards */}
                <motion.div
                    className={styles.card}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    <div className={styles.metricLabel}>Total Agents</div>
                    <div className={styles.metricValue}>{totalAgents.toLocaleString()}</div>
                    <div className={styles.metricTrend}>+12% this week</div>
                </motion.div>

                <motion.div
                    className={styles.card}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    <div className={styles.metricLabel}>Product Searches</div>
                    <div className={styles.metricValue}>{totalSearches.toLocaleString()}</div>
                    <div className={styles.metricTrend}>+8.5% this week</div>
                </motion.div>

                <motion.div
                    className={styles.card}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    <div className={styles.metricLabel}>Total Volume (USD)</div>
                    <div className={styles.metricValue}>${totalSales.toLocaleString()}</div>
                    <div className={styles.metricTrend}>+24% this week</div>
                </motion.div>

                {/* Top Brands Visualization */}
                <motion.div
                    className={`${styles.card} ${styles.colSpan2}`}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    <h3 className={styles.cardHeader}>Top Searched Brands</h3>
                    <div className={styles.barChart}>
                        {sortedBrands.map(([brandName, { count, image }], index) => (
                            <div key={brandName} className={styles.barRow}>
                                <div className={styles.barLabelGroup}>
                                    <div className={styles.barLogoContainer}>
                                        <img src={image} alt={brandName} className={styles.barLogo} />
                                    </div>
                                    <span className={styles.barLabel}>{brandName}</span>
                                </div>
                                <div className={styles.barTrack}>
                                    <motion.div
                                        className={styles.barFill}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(count / maxBrandCount) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                                    />
                                </div>
                                <span className={styles.barValue}>{count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Token Scorecard */}
                <motion.div
                    className={`${styles.card} ${styles.colSpan2}`}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    <h3 className={styles.cardHeader}>Cashback Deployment</h3>
                    <div className={styles.tokenCard}>
                        <div className={styles.tokenRow}>
                            <div className={styles.tokenInfo}>
                                <span className={styles.tokenName}>$MON</span>
                                <span className={styles.tokenAmount}>${tokenStats.MON.toLocaleString()} deployed</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.tokenFillMon}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(tokenStats.MON / totalTokenValue) * 100}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>

                        <div className={styles.tokenRow}>
                            <div className={styles.tokenInfo}>
                                <span className={styles.tokenName} style={{ color: '#FFA500' }}>$BONK</span>
                                <span className={styles.tokenAmount}>${tokenStats.BONK.toLocaleString()} deployed</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.tokenFillBonk}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(tokenStats.BONK / totalTokenValue) * 100}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>
                    </div>
                    <p className={styles.note}>*Real-time estimate based on recent blocks</p>
                </motion.div>
            </div>
        </section>
    );
}
