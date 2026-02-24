import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const SOCIALS = [
    {
        label: 'LinkedIn', href: 'https://linkedin.com', color: '#0077b5',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
    },
    {
        label: 'GitHub', href: 'https://github.com', color: '#fff',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
    },
    {
        label: 'Email', href: 'mailto:hello@harshgupta.dev', color: '#4facfe',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    },
]

export default function Contact() {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-100px' })
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [errors, setErrors] = useState({})
    const [sent, setSent] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = true
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = true
        if (!form.message.trim()) e.message = true
        return e
    }

    const handleSubmit = (ev) => {
        ev.preventDefault()
        const e = validate()
        setErrors(e)
        if (Object.keys(e).length === 0) {
            setSubmitting(true)
            setTimeout(() => { setSubmitting(false); setSent(true) }, 1500)
            setTimeout(() => {
                setSent(false); setForm({ name: '', email: '', message: '' })
            }, 4000)
        }
    }

    return (
        <section id="contact" className="relative py-32 px-6" ref={ref}>
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center bottom, rgba(79,172,254,0.04) 0%, transparent 65%)' }} />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="section-tag block">06 — Connect</motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-black tracking-tight"
                    >
                        Let's Build Something <span className="gradient-text">Incredible</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <p className="text-[var(--clr-muted)] leading-relaxed mb-8 text-lg">
                            Have a project in mind, an opportunity, or just want to say hello?
                            I'd love to hear from you. Let's create something extraordinary together.
                        </p>
                        <div className="flex gap-4">
                            {SOCIALS.map(s => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={s.label}
                                    whileHover={{ y: -6, scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                    className="glass w-14 h-14 rounded-2xl flex items-center justify-center hoverable
                    hover:border-white/20 transition-all duration-300"
                                    style={{ color: s.color }}
                                >
                                    {s.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        onSubmit={handleSubmit}
                        className="glass rounded-2xl p-8 flex flex-col gap-5"
                    >
                        <div>
                            <input
                                className={`form-input ${errors.name ? 'border-red-500/60' : ''}`}
                                placeholder="Your Name"
                                value={form.name}
                                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: false })) }}
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">Please enter your name</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? 'border-red-500/60' : ''}`}
                                placeholder="Your Email"
                                value={form.email}
                                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: false })) }}
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">Please enter a valid email</p>}
                        </div>
                        <div>
                            <textarea
                                rows={4}
                                className={`form-input resize-none ${errors.message ? 'border-red-500/60' : ''}`}
                                placeholder="Your Message"
                                value={form.message}
                                onChange={e => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: false })) }}
                            />
                            {errors.message && <p className="text-red-400 text-xs mt-1">Please enter your message</p>}
                        </div>
                        <motion.button
                            type="submit"
                            className={`btn-primary w-full justify-center hoverable ${sent ? 'opacity-90' : ''}`}
                            style={{ background: sent ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : undefined }}
                            whileTap={{ scale: 0.97 }}
                            disabled={submitting || sent}
                        >
                            {sent ? '✓ Message Sent!' : submitting ? 'Sending...' : 'Send Message'}
                            {!sent && !submitting && (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            )}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </section>
    )
}
