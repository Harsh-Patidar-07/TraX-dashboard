"use client"

import * as React from "react"
import { Home, Settings, HelpCircle, PanelLeftClose, PanelLeftOpen, Calculator, Rocket, Beaker } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }) {
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 rounded-tr-xl rounded-br-xl bg-[rgba(0,0,0,0.2)] backdrop-blur-lg relative z-10 my-4 p-2 border-0",
        isCollapsed ? "w-16 h-[calc(100vh-32px)]" : "w-64 h-[calc(100vh-32px)]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-2 bg-transparent">
        <div className={cn(
          "font-museo-moderno text-lg font-semibold w-full text-center",
          isCollapsed && "hidden"
        )}>
          TraX
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2 bg-transparent">
        <div className="flex flex-col gap-2 px-2 bg-transparent">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    !isCollapsed && "w-full justify-start gap-2"
                  )}
                >
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    {!isCollapsed && <span>Dashboard</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <Separator className="my-2" />

          <div className={cn("text-sm font-medium text-muted-foreground px-2", isCollapsed && "hidden")}>
            Subjects
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    !isCollapsed && "w-full justify-start gap-2"
                  )}
                >
                  <Link href="/subjects/mathematics">
                    <Calculator className="h-5 w-5" />
                    {!isCollapsed && <span>Mathematics</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Mathematics</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    !isCollapsed && "w-full justify-start gap-2"
                  )}
                >
                  <Link href="/subjects/physics">
                    <Rocket className="h-5 w-5" />
                    {!isCollapsed && <span>Physics</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Physics</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    !isCollapsed && "w-full justify-start gap-2"
                  )}
                >
                  <Link href="/subjects/chemistry">
                    <Beaker className="h-5 w-5" />
                    {!isCollapsed && <span>Chemistry</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Chemistry</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mt-auto p-2 bg-transparent">
        <div className="flex flex-col gap-2 bg-transparent">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    !isCollapsed && "w-full justify-start gap-2"
                  )}
                >
                  <Link href="/help">
                    <HelpCircle className="h-5 w-5" />
                    {!isCollapsed && <span>Help</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Help</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    !isCollapsed && "w-full justify-start gap-2"
                  )}
                >
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    {!isCollapsed && <span>Settings</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
