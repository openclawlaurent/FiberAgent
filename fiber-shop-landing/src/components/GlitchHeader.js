
import React from 'react';
import styles from '../styles/GlitchHeader.module.css';

const GlitchHeader = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.glitch} data-text="glitch">glitch</h1>
            <span className={styles.sub}>EFFECT</span>
        </div>
    );
};

export default GlitchHeader;
