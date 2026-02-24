import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CATEGORIES = [
    {
        title: 'Frontend',
        color: '#4facfe',
        items: [
            { name: 'React.js', icon: '⚛️', level: 92 },
            { name: 'JavaScript', icon: '⚡', level: 90 },
            { name: 'HTML / CSS', icon: '🌐', level: 95 },
            { name: 'Tailwind CSS', icon: '💨', level: 85 },
        ]
    },
    {
        title: 'Backend',
        color: '#a855f7',
        items: [
            { name: 'Node.js', icon: '🟢', level: 88 },
            { name: 'Express.js', icon: '🚂', level: 85 },
            { name: 'Python', icon: '🐍', level: 87 },
            { name: 'Flask', icon: '🧪', level: 78 },
        ]
    },
    {
        title: 'AI / ML',
        color: '#00f2fe',
        items: [
            { name: 'TensorFlow', icon: '🧠', level: 80 },
            { name: 'Scikit-learn', icon: '📊', level: 82 },
            { name: 'NLP', icon: '💬', level: 75 },
            { name: 'Sentiment Analysis', icon: '📈', level: 78 },
        ]
    },
    {
        title: 'Database & Tools',
        color: '#f093fb',
        items: [
            { name: 'MongoDB', icon: '🍃', level: 84 },
            { name: 'MySQL', icon: '🗄️', level: 82 },
            { name: 'Docker', icon: '🐳', level: 70 },
            { name: 'Git / GitHub', icon: '🔀', level: 92 },
        ]
    },
]

function SkillBar({ name, icon, level, color, delay }) {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-40px' })

    return (
        <div ref={ref} className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                    <span>{icon}</span> {name}
                </span>
                <span className="text-xs font-mono" style={{ color }}>{level}%</span>
            </div>
            <div className="h-[3px] rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.4))` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${level}%` } : { width: 0 }}
                    transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        </div>
    )
}

export default function TechStack() {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-100px' })

    const TECH_ICONS = [
        { icon: '⚛️', label: 'React' }, { icon: '🟢', label: 'Node' },
        { icon: '🐍', label: 'Python' }, { icon: '🧠', label: 'TensorFlow' },
        { icon: '🍃', label: 'MongoDB' }, { icon: '🐳', label: 'Docker' },
        { icon: '⚡', label: 'JS' }, { icon: '💨', label: 'Tailwind' },
    ]

    return (
        <section id="tech" className="relative py-32 px-6">
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(168,85,247,0.04) 0%, transparent 60%)' }} />

            <div className="max-w-6xl mx-auto" ref={ref}>
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }} className="section-tag block">02 — Tech Stack</motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-black tracking-tight"
                    >
                        Tools of the <span className="gradient-text">Trade</span>
                    </motion.h2>
                </div>

                {/* Floating orbit icons */}
                <motion.div
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {TECH_ICONS.map(({ icon, label }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                            whileHover={{ scale: 1.15, y: -6 }}
                            className="glass rounded-2xl p-4 flex flex-col items-center gap-2 cursor-default hoverable
                hover:border-[rgba(79,172,254,0.3)] transition-all duration-300"
                            style={{ minWidth: 80 }}
                        >
                            <span className="text-3xl">{icon}</span>
                            <span className="text-xs font-semibold text-[var(--clr-muted)]">{label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Skill bars grid */}
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
                    {CATEGORIES.map((cat, ci) => (
                        <div key={cat.title}>
                            <h3 className="text-xs font-mono font-semibold mb-5 tracking-widest"
                                style={{ color: cat.color }}>
                                {cat.title.toUpperCase()}
                            </h3>
                            {cat.items.map((item, ii) => (
                                <SkillBar
                                    key={item.name}
                                    {...item}
                                    color={cat.color}
                                    delay={0.2 + (ci * 4 + ii) * 0.07}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
