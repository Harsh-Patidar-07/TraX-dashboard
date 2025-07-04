'use client'

import React, { useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const SidebarContext = createContext<{ isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }>({ isCollapsed: false, setIsCollapsed: () => {} });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen">
        {/* Mobile top bar with hamburger */}
        <div className="sm:hidden fixed top-0 left-0 w-full h-14 z-30 flex items-center bg-background/80 backdrop-blur px-4 border-b">
          <button
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md focus:outline-none focus:ring"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 font-museo-moderno text-lg font-semibold">TraX</span>
        </div>
        {/* Sidebar: overlay on mobile, fixed on desktop */}
        {/* Desktop sidebar */}
        <div className="hidden sm:flex fixed left-0 top-0 h-screen items-center z-20">
          <SidebarWithContext />
        </div>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="sm:hidden fixed inset-0 z-40 flex">
            <div className="relative w-64 h-full bg-[rgba(0,0,0,0.8)] backdrop-blur-lg shadow-lg">
              <SidebarWithContext />
              <button
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-2 right-2 p-2 rounded-md bg-white/10 hover:bg-white/20"
              >
                ✕
              </button>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}
        {/* Main content */}
        <main
          className="flex-1 p-4 sm:p-8 transition-all duration-300 w-full"
          style={{ marginLeft: isCollapsed ? 64 : 256 }}
        >
          {/* Add top margin for mobile top bar */}
          <div className="sm:hidden h-14" />
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

function SidebarWithContext() {
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  return <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />;
} 