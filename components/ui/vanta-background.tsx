"use client"

import React, { useEffect, useRef } from "react"

export default function VantaBackground() {
  return (
    <img
      src="/BGimg-main.svg"
      alt="Background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        zIndex: -1,
      }}
    />
  );
} 