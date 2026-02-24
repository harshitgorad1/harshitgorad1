import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
    { href: '#about', label: 'About' },
    { href: '#tech', label: 'Tech' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60)
            const max = document.documentElement.scrollHeight - window.innerHeight
            setProgress((window.scrollY / max) * 100)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLink = (e, href) => {
        e.preventDefault()
        setOpen(false)
        const el = document.querySelector(href)
        if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' })
    }

    return (
        <>
            {/* Scroll progress */}
            <div
                className="scroll-progress-bar"
                style={{ width: `${progress}%` }}
            />

            <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500
        ${scrolled ? 'glass border-b border-white/5 py-3' : 'py-5'}`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="text-2xl font-black tracking-tight gradient-text hoverable">
                        HG<span style={{ color: 'var(--clr-cyan)' }}>.</span>
                    </a>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-1">
                        {links.map(l => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    onClick={e => handleLink(e, l.href)}
                                    className="relative px-4 py-2 text-sm font-medium text-[var(--clr-muted)] hover:text-white
                    rounded-lg hover:bg-white/5 transition-all duration-300 group hoverable"
                                >
                                    {l.label}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px]
                    bg-gradient-to-r from-[var(--clr-blue)] to-[var(--clr-purple)]
                    group-hover:w-[60%] transition-all duration-300 rounded" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden flex flex-col gap-[5px] p-2 hoverable"
                        aria-label="Menu"
                    >
                        <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300
              ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
                        <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300
              ${open ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300
              ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </button>
                </div>

                {/* Mobile menu */}
                <motion.div
                    initial={false}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    className="md:hidden overflow-hidden glass border-t border-white/5"
                >
                    <ul className="px-6 py-4 flex flex-col gap-2">
                        {links.map(l => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    onClick={e => handleLink(e, l.href)}
                                    className="block py-3 px-4 text-sm font-medium text-[var(--clr-muted)] hover:text-white
                    rounded-lg hover:bg-white/5 transition-all"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </nav>
        </>
    )
}
