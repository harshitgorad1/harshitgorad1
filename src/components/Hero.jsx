import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Torus, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import * as THREE from 'three'

// ── 3D Scene ──────────────────────────────────────────────
function GeoObjects({ mouse }) {
    const torusRef = useRef()
    const sphereRef = useRef()
    const icosaRef = useRef()

    useFrame((state, delta) => {
        if (torusRef.current) {
            torusRef.current.rotation.x += delta * 0.12
            torusRef.current.rotation.y += delta * 0.08
            torusRef.current.position.x += (mouse.current.x * 2 - torusRef.current.position.x) * 0.05
            torusRef.current.position.y += (-mouse.current.y * 2 - torusRef.current.position.y) * 0.05
        }
        if (sphereRef.current) {
            sphereRef.current.rotation.y += delta * 0.1
            sphereRef.current.position.x += (-mouse.current.x * 1.5 - sphereRef.current.position.x) * 0.04
        }
        if (icosaRef.current) {
            icosaRef.current.rotation.x += delta * 0.06
            icosaRef.current.rotation.z += delta * 0.04
        }
    })

    return (
        <>
            <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />

            {/* Ambient + point lights */}
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={1.2} color="#4facfe" />
            <pointLight position={[-5, -3, 3]} intensity={0.8} color="#a855f7" />
            <pointLight position={[0, -4, 2]} intensity={0.5} color="#00f2fe" />

            {/* Main torus */}
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh ref={torusRef} position={[2, 0, 0]}>
                    <torusGeometry args={[1.4, 0.45, 32, 80]} />
                    <meshStandardMaterial
                        color="#4facfe"
                        wireframe={false}
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#1a3a5c"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>

            {/* Distort sphere */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
                <Sphere ref={sphereRef} args={[0.9, 64, 64]} position={[-2.5, 1, -1]}>
                    <MeshDistortMaterial
                        color="#a855f7"
                        distort={0.35}
                        speed={2}
                        metalness={0.8}
                        roughness={0.15}
                        emissive="#3d1066"
                        emissiveIntensity={0.4}
                    />
                </Sphere>
            </Float>

            {/* Icosahedron wireframe */}
            <Float speed={1.2} floatIntensity={0.4}>
                <mesh ref={icosaRef} position={[-1, -2, -0.5]}>
                    <icosahedronGeometry args={[0.7, 1]} />
                    <meshStandardMaterial
                        color="#00f2fe"
                        wireframe
                        emissive="#00f2fe"
                        emissiveIntensity={0.6}
                    />
                </mesh>
            </Float>

            {/* Small accent octahedron */}
            <Float speed={2.5} floatIntensity={0.6}>
                <mesh position={[3, -1.5, -0.5]} rotation={[0.5, 0.5, 0]}>
                    <octahedronGeometry args={[0.4]} />
                    <meshStandardMaterial
                        color="#f093fb"
                        metalness={0.95}
                        roughness={0.05}
                        emissive="#7a1554"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>
        </>
    )
}

function ParticleField() {
    const points = useRef()
    const count = 600

    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }

    useFrame(({ clock }) => {
        if (points.current) {
            points.current.rotation.y = clock.getElapsedTime() * 0.02
        }
    })

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.035} color="#4facfe" transparent opacity={0.5} sizeAttenuation />
        </points>
    )
}

// ── Typing Animation ─────────────────────────────────────
const ROLES = ['AI Engineer', 'Full Stack Dev', 'Problem Solver', 'ML Enthusiast', 'React Expert']

function useTyping(words) {
    const [text, setText] = useState('')
    const [idx, setIdx] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const word = words[idx]
        let timeout
        if (!deleting && text === word) {
            timeout = setTimeout(() => setDeleting(true), 1800)
        } else if (deleting && text === '') {
            setDeleting(false)
            setIdx(i => (i + 1) % words.length)
        } else {
            timeout = setTimeout(() => {
                setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
            }, deleting ? 40 : 80)
        }
        return () => clearTimeout(timeout)
    }, [text, deleting, idx, words])

    return text
}

// ── Hero Component ────────────────────────────────────────
export default function Hero() {
    const mouse = useRef({ x: 0, y: 0 })
    const containerRef = useRef()
    const typedText = useTyping(ROLES)

    useEffect(() => {
        const onMove = e => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
        }
        window.addEventListener('mousemove', onMove)

        // GSAP scroll parallax on hero text
        gsap.to(containerRef.current, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        })

        return () => window.removeEventListener('mousemove', onMove)
    }, [])

    return (
        <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center">

            {/* 3D Canvas — pointer-events:none so scroll passes through */}
            <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]} style={{ pointerEvents: 'none' }}>
                    <GeoObjects mouse={mouse} />
                    <ParticleField />
                    <fog attach="fog" args={['#02020a', 8, 25]} />
                </Canvas>
            </div>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 z-[1]"
                style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #02020a 80%)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-40 z-[1]"
                style={{ background: 'linear-gradient(to top, #02020a, transparent)' }} />

            {/* Content */}
            <div ref={containerRef} className="relative z-[2] text-center px-6 max-w-5xl mx-auto">

                {/* Available badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: 'rgba(79,172,254,0.08)', border: '1px solid rgba(79,172,254,0.2)' }}
                >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                    <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--clr-blue)' }}>AVAILABLE FOR WORK</span>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                    className="section-tag mb-3"
                >
                    Hello, I'm
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="font-black tracking-tight leading-none mb-6"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(3rem, 10vw, 6rem)' }}
                >
                    <span className="text-white">Harshit</span>{' '}
                    <span className="gradient-text">Gorad</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex items-center justify-center gap-2 font-medium mb-6 min-h-[36px]"
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
                >
                    <span style={{ color: 'var(--clr-muted)' }}>I build as a&nbsp;</span>
                    <span className="gradient-text-cyan">{typedText}</span>
                    <span className="type-cursor">|</span>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
                    style={{ color: 'var(--clr-muted)' }}
                >
                    Building intelligent, scalable &amp; cinematic digital experiences
                    that push the boundaries of what's possible.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
                    className="flex items-center justify-center gap-4 flex-wrap mb-10"
                >
                    <button
                        className="btn-primary hoverable"
                        onClick={() => { const el = document.querySelector('#projects'); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }) }}
                    >
                        View Projects
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
                        </svg>
                    </button>
                    <button
                        className="btn-outline hoverable"
                        onClick={() => { const el = document.querySelector('#contact'); if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }) }}
                    >
                        Contact Me
                    </button>
                </motion.div>

                {/* Social proof strip */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
                    className="flex items-center justify-center gap-6 flex-wrap"
                >
                    {[
                        { val: '30+', label: 'Projects' },
                        { val: '1200+', label: 'Commits' },
                        { val: '20+', label: 'Technologies' },
                        { val: '15+', label: 'Clients' },
                    ].map(({ val, label }) => (
                        <div key={label} className="text-center">
                            <div className="text-lg font-black gradient-text">{val}</div>
                            <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--clr-muted)' }}>{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
            >
                <div className="w-px h-12 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                        className="absolute top-0 left-0 w-full"
                        style={{ background: 'linear-gradient(to bottom, var(--clr-cyan), transparent)' }}
                        animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
                <span className="text-[10px] tracking-[3px] uppercase" style={{ color: 'var(--clr-muted)' }}>Scroll</span>
            </motion.div>
        </section>
    )
}
