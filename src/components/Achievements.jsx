import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
    { label: 'Projects Completed', value: 30, suffix: '+', color: '#4facfe', pct: 85 },
    { label: 'GitHub Commits', value: 1200, suffix: '+', color: '#a855f7', pct: 90 },
    { label: 'Technologies', value: 20, suffix: '+', color: '#00f2fe', pct: 75 },
    { label: 'Clients Served', value: 15, suffix: '+', color: '#f093fb', pct: 70 },
]

function AnimatedCounter({ value, inView }) {
    const [display, setDisplay] = useState(0)
    useEffect(() => {
        if (!inView) return
        let start = 0
        const duration = 2000
        const startTime = performance.now()
        const tick = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.floor(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
            else setDisplay(value)
        }
        requestAnimationFrame(tick)
    }, [inView, value])
    return display
}

function RingMeter({ pct, color, inView }) {
    const r = 52, circ = 2 * Math.PI * r
    const [offset, setOffset] = useState(circ)
    useEffect(() => {
        if (inView) setTimeout(() => setOffset(circ * (1 - pct / 100)), 100)
    }, [inView, circ, pct])

    return (
        <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 left-0">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0.6" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle
                cx="60" cy="60" r={r} fill="none"
                stroke={`url(#grad-${color.replace('#', '')})`}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transition: `stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)`, transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
            />
        </svg>
    )
}

export default function Achievements() {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="achievements" className="relative py-32 px-6" ref={ref}>
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.05) 0%, transparent 65%)' }} />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="section-tag block">05 — Impact</motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-black tracking-tight"
                    >
                        Numbers that <span className="gradient-text">Matter</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="glass rounded-2xl p-6 flex flex-col items-center text-center hoverable
                hover:border-white/15 transition-all duration-300 group"
                        >
                            {/* Ring meter */}
                            <div className="counter-ring mb-4">
                                <RingMeter pct={s.pct} color={s.color} inView={inView} />
                                <div className="relative z-10 text-center">
                                    <span className="text-2xl font-black" style={{ color: s.color }}>
                                        <AnimatedCounter value={s.value} inView={inView} />
                                    </span>
                                    <span className="text-lg font-bold" style={{ color: s.color }}>{s.suffix}</span>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-[var(--clr-muted)] leading-tight">{s.label}</p>

                            {/* Glow pulse */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ boxShadow: `inset 0 0 30px ${s.color}15` }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
