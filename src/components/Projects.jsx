import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const PROJECTS = [
    {
        title: 'AI Chat Assistant',
        desc: 'Real-time conversational AI with context awareness, NLP models, and a blazing-fast React frontend.',
        tags: ['React', 'Python', 'TensorFlow', 'Flask'],
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        icon: '🤖',
        live: './projects/ai-chat/index.html', github: 'https://github.com/harshitgorad1/harshitgorad1',
    },
    {
        title: 'E-Commerce Platform',
        desc: 'Full-stack store with Stripe payments, real-time inventory, user auth, and advanced analytics dashboard.',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
        icon: '🛒',
        live: './projects/ecommerce/index.html', github: 'https://github.com/harshitgorad1/harshitgorad1',
    },
    {
        title: 'Analytics Dashboard',
        desc: 'Real-time data viz with D3 charts, live WebSocket feeds, and intelligent ML-powered insights.',
        tags: ['React', 'D3.js', 'Node.js', 'MySQL'],
        gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        icon: '📊',
        live: './projects/analytics/index.html', github: 'https://github.com/harshitgorad1/harshitgorad1',
    },
    {
        title: 'Sentiment Analyzer',
        desc: 'NLP-powered text analysis with word clouds, sentiment gauges, and real-time batch processing.',
        tags: ['Python', 'Scikit-learn', 'Flask', 'NLP'],
        gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
        icon: '💭',
        live: './projects/sentiment/index.html', github: 'https://github.com/harshitgorad1/harshitgorad1',
    },
    {
        title: 'Task Management App',
        desc: 'Collaborative kanban board with real-time sync, drag-and-drop, team features, and Socket.io.',
        tags: ['React', 'Express', 'MongoDB', 'Socket.io'],
        gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        icon: '📋',
        live: './projects/taskmanager/index.html', github: 'https://github.com/harshitgorad1/harshitgorad1',
    },
    {
        title: 'Smart IoT Dashboard',
        desc: 'ML-powered IoT device control platform with predictive automation and real-time telemetry.',
        tags: ['Python', 'TensorFlow', 'React', 'MQTT'],
        gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
        icon: '🏠',
        live: './projects/iot-dashboard/index.html', github: 'https://github.com/harshitgorad1/harshitgorad1',
    },
]

function ProjectCard({ p, index }) {
    const ref = useRef()
    const cardRef = useRef()
    const inView = useInView(ref, { once: true, margin: '-60px' })

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        const rotateX = -(y / (rect.height / 2)) * 8
        const rotateY = (x / (rect.width / 2)) * 8
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    }
    const handleMouseLeave = () => {
        if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                className="glass rounded-2xl overflow-hidden h-full
          border border-white/5 hover:border-white/15 transition-all duration-500"
                style={{ transition: 'transform 0.15s ease, border-color 0.3s' }}
            >
                {/* Preview */}
                <div className="relative h-[180px] flex items-center justify-center overflow-hidden"
                    style={{ background: p.gradient }}>
                    <div className="text-5xl z-10 relative" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
                        {p.icon}
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'rgba(2,2,10,0.35)' }} />
                    {/* Floating tags on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-all duration-400 gap-2 flex-wrap px-4 z-20">
                        {p.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-black/60 text-white border border-white/20">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-[var(--clr-muted)] text-sm leading-relaxed mb-5">{p.desc}</p>
                    <div className="flex gap-3">
                        <a href={p.live} className="btn-primary text-sm py-2 px-5 hoverable"
                            style={{ padding: '8px 18px', fontSize: '0.8rem' }}>Live Demo</a>
                        <a href={p.github} className="btn-outline text-sm hoverable"
                            style={{ padding: '7px 18px', fontSize: '0.8rem' }}>GitHub</a>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function Projects() {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="projects" className="relative py-32 px-6">
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(79,172,254,0.04) 0%, transparent 60%)' }} />

            <div className="max-w-6xl mx-auto" ref={ref}>
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="section-tag block">03 — Work</motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-black tracking-tight"
                    >
                        Featured <span className="gradient-text">Projects</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--clr-muted)] mt-4 max-w-xl mx-auto"
                    >
                        A curated selection of projects that showcase technical depth and design sensibility.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} index={i} />)}
                </div>
            </div>
        </section>
    )
}
