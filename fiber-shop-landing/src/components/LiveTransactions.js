
import React, { useEffect, useRef } from 'react';
import styles from '../styles/LiveTransactions.module.css';

// ========= CONFIGURATION =========
const TOKENS = ["SOL", "MON", "MF", "BONK", "USD1", "VALOR", "AOL"];
const TOKEN_COLORS = {
    SOL: "#14F195",  // Solana green
    MON: "#6E54FF",  // Monad Purple
    MF: "#FF5E99",  // MF pink
    BONK: "#FF6A3D",  // BONK orange
    USD1: "#FFCC00",  // USD1 gold
    VALOR: "#00E0FF",  // VALOR cyan
    AOL: "#2E6BFF"   // AOL blue
};

const ITEM_COLOR = "#D00BFF"; // Neon Purple
const VENDOR_COLOR = "#FD6262"; // Coral Red
const DEFAULT_TEXT_COLOR = "#FFFFFF";

const CATALOG = {
    "Lowe's": { items: ["power drill", "paint set", "lawn mower", "light kit", "door lock", "pressure washer"], tokens: TOKENS },
    "StubHub": { items: ["concert tickets", "NBA tickets", "MLB tickets", "theater pass"], tokens: TOKENS },
    "ezCater": { items: ["boxed lunch", "meal tray", "breakfast set", "sandwich pack"], tokens: TOKENS },
    "Kohl's": { items: ["sneakers", "air fryer", "hoodie", "cookware set"], tokens: TOKENS },
    "Viator": { items: ["city tour", "boat cruise", "day trip", "museum pass"], tokens: TOKENS },
    "HexClad": { items: ["frying pan", "cookware set", "wok", "griddle"], tokens: TOKENS },
    "Ancestry": { items: ["DNA kit", "membership", "gift card"], tokens: TOKENS },
    "L.L. Bean": { items: ["flannel shirt", "bean boots", "fleece jacket", "day pack"], tokens: TOKENS },
    "Lenovo": { items: ["ThinkPad", "USB monitor", "docking hub", "tablet"], tokens: TOKENS },
    "SKIMS": { items: ["body suit", "leggings", "tank dress", "lounge set"], tokens: TOKENS },
    "GameStop": { items: ["PS5 game", "Xbox pad", "Switch game", "gift card"], tokens: TOKENS },
    "Celebrity Cruises": { items: ["cruise deal", "shore trip", "drink plan", "Wi-Fi pass"], tokens: TOKENS },
    "Dell": { items: ["XPS laptop", "27 monitor", "dock hub", "desktop PC"], tokens: TOKENS },
    "Alo Yoga": { items: ["yoga mat", "leggings", "hoodie", "joggers"], tokens: TOKENS },
    "Bed Bath & Beyond": { items: ["sheet set", "bath towels", "coffee maker", "duvet cover"], tokens: TOKENS },
    "CarGurus": { items: ["car listing", "dealer ad", "featured spot"], tokens: TOKENS },
    "Samsung": { items: ["Galaxy phone", "4K TV", "sound bar", "SSD"], tokens: TOKENS },
    "AT&T": { items: ["iPhone", "data plan", "Wi-Fi router", "fiber plan"], tokens: TOKENS },
    "Virgin Atlantic": { items: ["flight seat", "lounge pass", "seat upgrade"], tokens: TOKENS },
    "Trip.com": { items: ["hotel stay", "flight deal", "train pass"], tokens: TOKENS },
    "Sam's Club": { items: ["membership", "bulk snacks", "coffee beans", "TV set"], tokens: TOKENS },
    "SeatGeek": { items: ["NBA tickets", "concert pass", "parking pass"], tokens: TOKENS }
};

const CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
const GLITCH_DURATION = 800;
const GLITCH_FRAMES = 30;
const FADE_DURATION = 600;
const HOLD = 2600;

export default function LiveTransactions() {
    const itemRef = useRef(null);
    const vendorRef = useRef(null);
    const tokenRef = useRef(null);
    // Keep track of current state to avoid cycling repetition
    const currentRef = useRef({ item: "", vendor: "", token: "" });
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        // Helper: Pick coherent random data
        const pickCoherent = (prev) => {
            const vendors = Object.keys(CATALOG);
            let vendor;
            do { vendor = vendors[Math.floor(Math.random() * vendors.length)]; } while (vendor === prev.vendor);

            const items = CATALOG[vendor].items;
            let item;
            do { item = items[Math.floor(Math.random() * items.length)]; } while (item === prev.item);

            let token;
            do { token = TOKENS[Math.floor(Math.random() * TOKENS.length)]; } while (token === prev.token);

            return { item, vendor, token };
        };

        // Helper: Glitch Effect
        const glitchScramble = async (element, targetText, color) => {
            if (!element || !isMountedRef.current) return;

            const frameDelay = GLITCH_DURATION / GLITCH_FRAMES;

            // Phase 1: Chaos
            const chaosFrames = Math.floor(GLITCH_FRAMES * 0.3);
            for (let frame = 0; frame < chaosFrames; frame++) {
                if (!isMountedRef.current) return;

                let scrambled = '';
                for (let j = 0; j < targetText.length; j++) {
                    if (targetText[j] === ' ') {
                        scrambled += ' ';
                    } else {
                        scrambled += CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
                    }
                }

                const intensity = 1 - (frame / chaosFrames);
                const rgbOffset = Math.floor(Math.random() * 2 * intensity);
                const glitchColors = ['#ff00ff', '#00ffff', '#ffff00', color];
                const currentColor = Math.random() > 0.7 ? glitchColors[Math.floor(Math.random() * glitchColors.length)] : color;

                const shadow = rgbOffset > 0
                    ? `${rgbOffset}px 0 rgba(255,0,0,0.5), -${rgbOffset}px 0 rgba(0,255,255,0.5)`
                    : 'none';

                element.innerHTML = scrambled;
                element.style.color = currentColor;
                element.style.textShadow = shadow;

                await new Promise(resolve => setTimeout(resolve, frameDelay));
            }

            // Phase 2: Resolve
            const resolveFrames = GLITCH_FRAMES - chaosFrames;
            for (let frame = 0; frame < resolveFrames; frame++) {
                if (!isMountedRef.current) return;

                let scrambled = '';
                const revealProgress = frame / resolveFrames;

                for (let charIndex = 0; charIndex < targetText.length; charIndex++) {
                    const targetChar = targetText[charIndex];

                    if (targetChar === ' ') {
                        scrambled += ' ';
                    } else {
                        const positionFactor = charIndex / targetText.length;
                        const revealThreshold = revealProgress - positionFactor * 0.3;

                        if (Math.random() < revealThreshold) {
                            scrambled += targetChar;
                        } else {
                            if (Math.random() < revealProgress * 0.4) {
                                scrambled += targetChar;
                            } else {
                                scrambled += CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
                            }
                        }
                    }
                }

                const remainingIntensity = 1 - revealProgress;
                const rgbOffset = Math.floor(remainingIntensity * 1.5);
                const shadow = (rgbOffset > 0 && Math.random() > 0.6)
                    ? `${rgbOffset}px 0 rgba(255,0,0,0.4), -${rgbOffset}px 0 rgba(0,255,255,0.4)`
                    : 'none';

                element.innerHTML = scrambled;
                element.style.color = color;
                element.style.textShadow = shadow;

                await new Promise(resolve => setTimeout(resolve, frameDelay));
            }

            // Final clean state
            if (isMountedRef.current) {
                element.innerHTML = targetText;
                element.style.color = color;
                element.style.textShadow = 'none';
            }
        };

        // Helper: Fade Swap (Token)
        const fadeSwap = async (element, newText, color) => {
            if (!element || !isMountedRef.current) return;

            // Simple opacity fade out
            element.style.transition = `opacity ${FADE_DURATION / 2}ms ease`;
            element.style.opacity = 0;

            await new Promise(resolve => setTimeout(resolve, FADE_DURATION / 2));
            if (!isMountedRef.current) return;

            element.innerHTML = newText;
            element.style.color = color;
            element.style.textShadow = `0 0 10px ${color}80, 0 0 20px ${color}60`;

            // Fade in
            element.style.opacity = 1;
            await new Promise(resolve => setTimeout(resolve, FADE_DURATION / 2));
        };

        const cycle = async () => {
            if (!isMountedRef.current) return;

            const next = pickCoherent(currentRef.current);
            currentRef.current = next;

            // Run animations
            await Promise.all([
                glitchScramble(itemRef.current, "Buy " + next.item, ITEM_COLOR),
                glitchScramble(vendorRef.current, " at " + next.vendor, VENDOR_COLOR),
                fadeSwap(tokenRef.current, " earn " + next.token, TOKEN_COLORS[next.token] || "#fff")
            ]);
        };

        // Start cycle loop
        let timeoutId;
        const runLoop = async () => {
            await cycle();
            if (isMountedRef.current) {
                timeoutId = setTimeout(runLoop, HOLD);
            }
        };

        runLoop();

        return () => {
            isMountedRef.current = false;
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className={styles.container}>
            <span
                ref={itemRef}
                className={styles.glitchText}
            >
                Initializing...
            </span>
            <span
                ref={vendorRef}
                className={styles.glitchText}
            >
            </span>
            <span
                ref={tokenRef}
                className={styles.tokenText}
            >
            </span>
        </div>
    );
}
