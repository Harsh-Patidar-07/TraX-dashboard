"use client";
import dynamic from "next/dynamic";

const VantaBackground = dynamic(() => import("./vanta-background"), { ssr: false });

export default function VantaBackgroundClient() {
  return <VantaBackground />;
} 