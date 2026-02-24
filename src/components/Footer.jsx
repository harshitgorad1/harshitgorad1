export default function Footer() {
    return (
        <footer className="relative py-12 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <a href="#" className="text-2xl font-black tracking-tight gradient-text hoverable">
                    HG<span style={{ color: 'var(--clr-cyan)', WebkitTextFillColor: 'var(--clr-cyan)' }}>.</span>
                </a>
                <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>
                    Built with passion and precision ✦
                </p>
                <p className="text-xs" style={{ color: 'rgba(107,107,136,0.6)' }}>
                    &copy; 2026 Harshit Gorad. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
