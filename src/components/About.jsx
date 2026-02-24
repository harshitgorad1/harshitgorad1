import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'

function WireGlobe() {
    const mesh = useRef()
    useFrame((_, d) => {
        if (mesh.current) mesh.current.rotation.y += d * 0.15
    })
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[3, 3, 3]} intensity={1.5} color="#4facfe" />
            <pointLight position={[-3, -3, 3]} intensity={0.8} color="#a855f7" />
            <Float speed={1.5} floatIntensity={0.3}>
                <mesh ref={mesh}>
                    <sphereGeometry args={[1.5, 24, 24]} />
                    <meshStandardMaterial
                        color="#4facfe"
                        wireframe
                        emissive="#0a2040"
                        emissiveIntensity={0.6}
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[1.6, 16, 16]} />
                    <meshStandardMaterial
                        color="#a855f7"
                        wireframe
                        transparent
                        opacity={0.25}
                        emissive="#2d0060"
                        emissiveIntensity={0.4}
                    />
                </mesh>
            </Float>
        </>
    )
}

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
}

export default function About() {
    const ref = useRef()
    const inView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="about" className="relative py-32 px-6" ref={ref}>
            {/* Background pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse, rgba(79,172,254,0.04) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                }} />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-1">
                {/* Text */}
                <div>
                    <motion.span custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                        className="section-tag block">01 — About Me</motion.span>
                    <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        Building the <span className="gradient-text">Future</span>,<br />one line at a time.
                    </motion.h2>

                    {[
                        "I'm a <strong>results-driven Software Developer</strong> obsessed with performance, precision, and pushing technical limits. I architect scalable systems that thrive under real-world pressure.",
                        "My core strength is the intersection of <strong>full-stack engineering and AI</strong> — from training ML models to shipping production React applications that delight users.",
                        "I approach every problem with a <strong>first-principles mindset</strong>, breaking it down to fundamentals and rebuilding it into something elegant and efficient.",
                    ].map((text, i) => (
                        <motion.p key={i} custom={i + 2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                            className="text-[var(--clr-muted)] leading-relaxed mb-4"
                            dangerouslySetInnerHTML={{ __html: text.replace(/<strong>/g, '<strong class="text-white font-semibold">') }}
                        />
                    ))}

                    <motion.div custom={5} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                        className="grid grid-cols-2 gap-3 mt-8">
                        {[
                            { icon: '🚀', label: 'Performance First' },
                            { icon: '🧠', label: 'AI-Driven Solutions' },
                            { icon: '⚡', label: 'Clean Architecture' },
                            { icon: '🎯', label: 'Problem Solver' },
                        ].map(({ icon, label }) => (
                            <div key={label} className="glass rounded-xl p-3 flex items-center gap-3 hoverable
                hover:border-[rgba(79,172,254,0.25)] transition-all duration-300">
                                <span className="text-xl">{icon}</span>
                                <span className="text-sm font-semibold text-white">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* 3D Globe */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[400px] relative"
                >
                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>
                        <WireGlobe />
                    </Canvas>
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #02020a 90%)' }} />
                </motion.div>
            </div>
        </section>
    )
}
