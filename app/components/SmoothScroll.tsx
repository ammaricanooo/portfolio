'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.5,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 2),
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        (window as unknown as { lenis?: Lenis }).lenis = lenis

        requestAnimationFrame(raf)

        return () => {
            (window as unknown as { lenis?: Lenis }).lenis = undefined
            lenis.destroy()
        }
    }, [])

    return null
}