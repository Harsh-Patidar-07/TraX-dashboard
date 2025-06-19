'use client'

import React, { useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/ui/sidebar";

const SidebarContext = createContext<{ isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }>({ isCollapsed: false, setIsCollapsed: () => {} });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen">
        <div className="fixed left-0 top-0 h-screen flex items-center z-20">
          <SidebarWithContext />
        </div>
        <main
          className="flex-1 p-8 transition-all duration-300"
          style={{ marginLeft: isCollapsed ? 64 : 256 }}
        >
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