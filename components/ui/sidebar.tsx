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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }) {
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false)

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
          {/* Profile/User Button (opens login/signup modal) */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9",
              !isCollapsed && "w-full justify-start gap-2"
            )}
            onClick={() => setAuthDialogOpen(true)}
          >
            {/* Replace with user avatar if logged in */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
            {!isCollapsed && <span>Profile</span>}
          </Button>
          <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
            <DialogContent className="max-w-sm p-0 bg-transparent shadow-none border-none">
              <DialogTitle className="sr-only">Sign in to TraX</DialogTitle>
              <LoginForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
