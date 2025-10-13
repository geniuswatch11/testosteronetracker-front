"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  onClick?: () => void
}

interface StepperProps {
  steps: Step[]
  activeStep: number
  activeColor?: string
  completeColor?: string
  defaultColor?: string
  activeTitleColor?: string
  completeTitleColor?: string
  defaultTitleColor?: string
  size?: number
  className?: string
}

export function Stepper({
  steps,
  activeStep,
  activeColor = "#3B82F6",
  completeColor = "#3B82F6",
  defaultColor = "#9CA3AF",
  activeTitleColor = "#3B82F6",
  completeTitleColor = "#3B82F6",
  defaultTitleColor = "#6B7280",
  size = 32,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === activeStep
          const isCompleted = index < activeStep
          const isLast = index === steps.length - 1

          const circleColor = isCompleted
            ? completeColor
            : isActive
              ? activeColor
              : defaultColor

          const titleColor = isCompleted
            ? completeTitleColor
            : isActive
              ? activeTitleColor
              : defaultTitleColor

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <button
                  onClick={step.onClick}
                  disabled={!step.onClick}
                  className={cn(
                    "rounded-full flex items-center justify-center font-semibold text-white transition-all",
                    step.onClick && "cursor-pointer hover:scale-110",
                    !step.onClick && "cursor-default"
                  )}
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: circleColor,
                    fontSize: size * 0.5,
                  }}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Title */}
                <div
                  className="mt-2 text-center text-sm font-medium transition-colors"
                  style={{ color: titleColor }}
                >
                  {step.title}
                </div>
              </div>

              {/* Line connector */}
              {!isLast && (
                <div
                  className="flex-1 h-0.5 mx-2 transition-colors"
                  style={{
                    backgroundColor: index < activeStep ? completeColor : defaultColor,
                    marginTop: `-${size / 2 + 8}px`,
                  }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
