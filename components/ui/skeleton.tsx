import type React from "react"
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} {...props} />
}
