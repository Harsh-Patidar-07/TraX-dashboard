"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

export function Background() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [p5Loaded, setP5Loaded] = useState(false)
  const [vantaLoaded, setVantaLoaded] = useState(false)

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as any).VANTA &&
      (window as any).VANTA.TOPOLOGY &&
      vantaRef.current &&
      p5Loaded &&
      vantaLoaded
    ) {
      // @ts-ignore
      (window as any).VANTA.TOPOLOGY({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xf6946
      })
    }
  }, [p5Loaded, vantaLoaded])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => setP5Loaded(true)}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js"
        strategy="afterInteractive"
        onLoad={() => setVantaLoaded(true)}
      />
      <div 
        ref={vantaRef} 
        className="fixed inset-0 w-full h-full -z-10"
      />
    </>
  )
} 