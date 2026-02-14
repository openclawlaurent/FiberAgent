import React, { useEffect, useRef } from 'react';

const HeroBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Mouse interaction
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.color = `rgba(229, 255, 0, ${Math.random() * 0.6 + 0.2})`;
            }

            update() {
                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        // Repel effect
                        if (distance < mouse.radius) {
                            this.x -= directionX;
                            this.y -= directionY;
                        }
                    }
                }

                // Drift
                this.x += this.vx; // Removed 0.5 damper for faster movement
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Initialize particles
        // Reduce count on mobile for performance
        const particleCount = window.innerWidth < 768 ? 40 : 100; // More particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background text gradient here if needed OR keep it in CSS

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                // Connect to mouse
                if (mouse.x != null) {
                    const dx = particle.x - mouse.x;
                    const dy = particle.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 250) { // Increased distance slightly
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(229, 255, 0, ${0.4 - distance / 500})`; // Mouse connection
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();

                        // Gentle nudge away from mouse (simulating interaction without stopping drift)
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (250 - distance) / 250;
                        if (distance < 100) {
                            particle.vx += forceDirectionX * force * 0.05;
                            particle.vy += forceDirectionY * force * 0.05;
                        }
                    }
                }

                // Draw connections between particles
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 180) { // Longer connection distance
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(229, 255, 0, ${0.25 - distance / 1000})`; // More opaque lines
                        ctx.lineWidth = 0.8; // Thicker lines
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.6 // Subtle overlay effect
            }}
        />
    );
};

export default HeroBackground;
