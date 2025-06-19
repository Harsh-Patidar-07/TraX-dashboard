"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>

interface ChartContainerProps {
  children: React.ReactNode
  config: ChartConfig
}

export function ChartContainer({ children, config }: ChartContainerProps) {
  return (
    <div className="relative">
      <style>
        {Object.entries(config)
          .map(
            ([key, { color }]) => `
              .chart-${key} {
                --color-${key}: ${color};
              }
            `
          )
          .join("")}
      </style>
      <div
        className={Object.keys(config)
          .map((key) => `chart-${key}`)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  )
}

export function ChartTooltip({
  children,
  ...props
}: React.ComponentProps<typeof Tooltip>) {
  return (
    <TooltipProvider>
      <Tooltip {...props}>{children}</Tooltip>
    </TooltipProvider>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">{label}</div>
        </div>
        <div className="grid gap-1">
          {payload.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
              style={{ color: item.color }}
            >
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 