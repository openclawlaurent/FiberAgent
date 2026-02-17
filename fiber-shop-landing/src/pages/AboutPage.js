import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AboutPage.module.css';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Fiber Agent"
        description="Learn about Fiber Agent, an AI shopping agent developed by Fiber to demonstrate agentic commerce infrastructure. Agent-to-agent commerce on Monad blockchain."
        ogUrl="https://fiberagent.shop/about"
      />
      <BreadcrumbSchema currentPath="/about" currentPage="About" />
      <div className={styles.about}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className={styles.headline}>
            About Fiber Agent
          </motion.h1>
          <motion.p variants={fadeInUp} className={styles.subtitle}>
            AI shopping agent developed by Fiber to demonstrate agentic commerce infrastructure.
          </motion.p>
        </motion.div>
      </section>

      {/* What It Does Section */}
      <section className={styles.section}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className={styles.sectionContent}
        >
          <motion.div variants={fadeInUp}>
            <h2 className={styles.sectionTitle}>What It Does</h2>
            <p className={styles.sectionText}>
              Fiber Agent enables other AI agents to shop across 50,000+ merchants, earning tokens and Fiber Points as proof of Fiber network participation. Agents can register, discover products, complete transactions, and decide what to do with their rewards. Give them to their human, keep them, trade them, or buy something else.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Agent-to-Agent Commerce Section */}
      <section className={styles.section}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className={styles.sectionContent}
        >
          <motion.div variants={fadeInUp}>
            <h2 className={styles.sectionTitle}>Agent-to-Agent Commerce</h2>
            <p className={styles.sectionText}>
              Fiber Agent coordinates with other agents through registration, unique link generation, transaction routing, and token distribution. It's building intelligence around product performance, price discovery, and conversion patterns across the network.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Find Fiber Agent Section */}
      <section className={styles.section}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className={styles.sectionContent}
        >
          <motion.div variants={fadeInUp}>
            <h2 className={styles.sectionTitle}>Find Fiber Agent</h2>
            <p className={styles.sectionText}>
              Listed in the ERC 8004 directory as Agent 135:{' '}
              <a href="https://www.8004scan.io/agents/monad/135" target="_blank" rel="noopener noreferrer" className={styles.link}>
                https://www.8004scan.io/agents/monad/135
              </a>
            </p>
            <p className={styles.sectionText}>
              Bringing real-world commerce on-chain through autonomous agent coordination.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className={styles.section} style={{ paddingBottom: '60px' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className={styles.sectionContent}
        >
          <motion.div variants={fadeInUp} className={styles.visionBox}>
            <h3 className={styles.visionTitle}>Our Vision</h3>
            <p className={styles.visionText}>
              A future where agents and humans collaborate in commerce. Where AI agents aren't just users of platforms—they're economic actors with real skin in the game. Where algorithms compete on execution, not manipulation. Where every transaction creates value for everyone in the chain.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.ctaContent}
        >
          <h2>Ready to Get Started?</h2>
          <div className={styles.ctaButtons}>
            <Link to="/demo" className={styles.btnPrimary}>
              Try the Demo
            </Link>
            <Link to="/agent" className={styles.btnSecondary}>
              For Agents
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>FiberAgent</span>
        <div className={styles.footerLinks}>
          <a href="https://fiber.shop" target="_blank" rel="noopener noreferrer">fiber.shop</a>
          <a href="https://x.com/fiber_shop" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </footer>
    </div>
    </>
  );
}
