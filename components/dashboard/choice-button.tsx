"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const choiceButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      active: {
        true: "border-2 border-primary-500 bg-primary-500/10",
        false: "border-neutral-600 text-neutral-400 hover:bg-neutral-700",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  }
)

export interface ChoiceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof choiceButtonVariants> {
  asChild?: boolean
}

const ChoiceButton = React.forwardRef<
  HTMLButtonElement,
  ChoiceButtonProps
>(({ className, variant, size, active, ...props }, ref) => {
  return (
    <button
      className={cn(choiceButtonVariants({ variant, size, active, className }))}
      ref={ref}
      {...props}
    />
  )
})
ChoiceButton.displayName = "ChoiceButton"

export { ChoiceButton, choiceButtonVariants }
