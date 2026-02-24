import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ITEMS = [
    {
        date: '2024 — Present',
        title: 'Full Stack Developer',
        sub: 'Freelance / Remote',
        desc: 'Building scalable web applications and AI-driven tools for global clients. Specializing in React, Node.js, and Python systems.',
        color: '#4facfe',
    },
    {
        date: '2023 — 2024',
        title: 'AI / ML Intern',
        sub: 'Tech Startup',
        desc: 'Developed NLP pipelines and sentiment analysis systems. Built automated ML workflows using TensorFlow and Scikit-learn.',
        color: '#a855f7',
    },
    {
        date: '2023',
        title: 'Freelance Developer',
        sub: 'Self-Employed',
        desc: 'Delivered 10+ full-stack projects for startups and SMEs — focused on performance, modern UX, and rapid delivery.',
        color: '#00f2fe',
    },
    {
        date: '2021 — 2025',
        title: 'B.Tech Computer Science',
        sub: 'University',
        desc: 'Strong foundation in DSA, ML, Software Engineering, and Computer Networks. Active in hackathons and open-source.',
        color: '#f093fb',
    },
]

export default function Experience() {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="experience" className="relative py-32 px-6" ref={ref}>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="section-tag block">04 — Journey</motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-black tracking-tight"
                    >
                        Experience &amp; <span className="gradient-text">Education</span>
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] timeline-line" />
                    <motion.div
                        className="absolute left-[19px] top-0 w-[2px] timeline-fill"
                        initial={{ height: 0 }}
                        animate={inView ? { height: '100%' } : { height: 0 }}
                        transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />

                    <div className="flex flex-col gap-10">
                        {ITEMS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -40 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="flex gap-6"
                            >
                                {/* Dot */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10"
                                    style={{
                                        background: `radial-gradient(circle, ${item.color}30, ${item.color}10)`,
                                        border: `2px solid ${item.color}`,
                                        boxShadow: `0 0 20px ${item.color}40`,
                                        marginTop: 4,
                                    }}
                                >
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                                </div>

                                {/* Content */}
                                <div className="glass rounded-2xl p-6 flex-1 hover:border-white/15 transition-all duration-300 hoverable">
                                    <span className="text-xs font-mono font-semibold mb-1 block" style={{ color: item.color }}>
                                        {item.date}
                                    </span>
                                    <h3 className="text-lg font-bold text-white mb-0.5">{item.title}</h3>
                                    <span className="text-xs text-[var(--clr-muted)] mb-3 block">{item.sub}</span>
                                    <p className="text-sm text-[var(--clr-muted)] leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
