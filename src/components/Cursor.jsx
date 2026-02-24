import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
    const dotRef = useRef(null)
    const outlineRef = useRef(null)
    const [hovered, setHovered] = useState(false)

    useEffect(() => {
        if (window.innerWidth <= 768) return

        let mx = 0, my = 0, ox = 0, oy = 0
        let rafId

        const move = (e) => {
            mx = e.clientX; my = e.clientY
            if (dotRef.current) {
                dotRef.current.style.left = mx + 'px'
                dotRef.current.style.top = my + 'px'
            }
        }
        const animate = () => {
            ox += (mx - ox) * 0.1
            oy += (my - oy) * 0.1
            if (outlineRef.current) {
                outlineRef.current.style.left = ox + 'px'
                outlineRef.current.style.top = oy + 'px'
            }
            rafId = requestAnimationFrame(animate)
        }
        animate()
        document.addEventListener('mousemove', move)

        const enter = () => { outlineRef.current?.classList.add('hovered') }
        const leave = () => { outlineRef.current?.classList.remove('hovered') }
        document.querySelectorAll('a, button, .hoverable').forEach(el => {
            el.addEventListener('mouseenter', enter)
            el.addEventListener('mouseleave', leave)
        })

        return () => {
            document.removeEventListener('mousemove', move)
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="cursor-dot hidden md:block" />
            <div ref={outlineRef} className="cursor-outline hidden md:block" />
        </>
    )
}
