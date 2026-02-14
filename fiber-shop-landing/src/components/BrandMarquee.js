import React from 'react';
import styles from '../styles/BrandMarquee.module.css';

// Import User Uploaded Logos
import adidasLogo from '../assets/brands/upload/adidas-logo.png';
import aloLogo from '../assets/brands/upload/alo-logo.png';
import bedBathLogo from '../assets/brands/upload/bed-bath-beyond-logo.png';
import bestBuyLogo from '../assets/brands/upload/best-buy-logo.png';
import dicksLogo from '../assets/brands/upload/dicks-logo.png';
import doorDashLogo from '../assets/brands/upload/door-dash-logo.png';
import gameStopLogo from '../assets/brands/upload/game-stop-logo.png';
import llBeanLogo from '../assets/brands/upload/ll-bean-logo.png';
import lowesLogo from '../assets/brands/upload/lowes-logo.png';
import macysLogo from '../assets/brands/upload/macys-logo.png';
import sephoraLogo from '../assets/brands/upload/sephora-logo.png';
import skimsLogo from '../assets/brands/upload/skims-logo.png';
import stubHubLogo from '../assets/brands/upload/stub-hub-logo.png';
import temuLogo from '../assets/brands/upload/temu-logo.png';
import ultaLogo from '../assets/brands/upload/ulta-logo.png';
import viatorLogo from '../assets/brands/upload/viator-logo.png';
import walmartLogo from '../assets/brands/upload/walmart-logo.png';

const brands = [
    { name: "Macy's", image: macysLogo },
    { name: "Temu", image: temuLogo, className: styles.invertLogo },
    { name: "Skims", image: skimsLogo },
    { name: "Viator", image: viatorLogo },
    { name: "Sephora", image: sephoraLogo },
    { name: "Lowe's", image: lowesLogo },
    { name: "Best Buy", image: bestBuyLogo },
    { name: "Walmart", image: walmartLogo },
    { name: "Ulta", image: ultaLogo, className: styles.invertLogo },
    { name: "Adidas", image: adidasLogo, className: styles.invertLogo },
    { name: "Alo Yoga", image: aloLogo },
    { name: "DoorDash", image: doorDashLogo },
    { name: "GameStop", image: gameStopLogo },
    { name: "StubHub", image: stubHubLogo },
    { name: "Dick's", image: dicksLogo },
    { name: "Bed Bath", image: bedBathLogo },
    { name: "LL Bean", image: llBeanLogo },
];

export default function BrandMarquee() {
    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
                {brands.map((brand, index) => (
                    <div key={index} className={styles.brandItem}>
                        <img
                            src={brand.image}
                            alt={brand.name}
                            className={`${styles.brandLogoImage} ${brand.className || ''}`}
                        />
                    </div>
                ))}
                {/* Duplicate for infinite loop */}
                {brands.map((brand, index) => (
                    <div key={`dup-${index}`} className={styles.brandItem}>
                        <img
                            src={brand.image}
                            alt={brand.name}
                            className={`${styles.brandLogoImage} ${brand.className || ''}`}
                        />
                    </div>
                ))}
                {/* Duplicate again for smoother loop */}
                {brands.map((brand, index) => (
                    <div key={`dup2-${index}`} className={styles.brandItem}>
                        <img
                            src={brand.image}
                            alt={brand.name}
                            className={`${styles.brandLogoImage} ${brand.className || ''}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
