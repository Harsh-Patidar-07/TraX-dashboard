"use client"

import React, { useEffect, useRef } from "react"

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js")
    ]).then(() => {
      // @ts-ignore
      if (window.VANTA && window.VANTA.CELLS && vantaRef.current) {
        // @ts-ignore
        vantaEffect.current = window.VANTA.CELLS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          color1: 0x56e6e,
          color2: 0x44343,
          size: 0.40
        })
      }
    })

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      id="vanta-bg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  )
} 