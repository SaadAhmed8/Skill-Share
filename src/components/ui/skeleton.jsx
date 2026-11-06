import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md bg-[var(--snow)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
