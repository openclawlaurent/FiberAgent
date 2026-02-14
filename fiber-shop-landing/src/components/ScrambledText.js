import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export default function ScrambledText({ text, className }) {
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        let interval;
        let iteration = 0;

        const scramble = () => {
            interval = setInterval(() => {
                setDisplay(
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        // Trigger on mount or when text changes
        scramble();

        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{display}</span>;
}
