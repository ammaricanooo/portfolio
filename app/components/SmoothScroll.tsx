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

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return null
}