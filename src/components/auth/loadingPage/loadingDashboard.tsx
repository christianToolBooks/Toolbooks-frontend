/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Calculator, TrendingUp, FileText, DollarSign, BarChart3, PieChart } from "lucide-react"

interface LoadingDashboardProps {
  onComplete: () => void;
}

export default function LoadingDashboard ({ onComplete }: LoadingDashboardProps) {
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState(0)

  const tasks = [
    "Synchronizing financial data...",
    "Processing transactions...",
    "Generating accounting reports...",
    "Calculating balances...",
    "Updating dashboard...",
  ]

   useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1
        if (next >= 100) {
          clearInterval(progressInterval)
          onComplete()
          return 100
        }
        return next
      })
    }, 50)

    const taskInterval = setInterval(() => {
      setCurrentTask((prev) => (prev + 1) % tasks.length)
    }, 3000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(taskInterval)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="relative">
        {/* Main container */}
        <div className="relative p-16">
          {/* Logo/Brand area */}

          {/* Elegant animated circle */}
          <div className="relative w-40 h-40 mx-auto mb-12">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 rounded-full border border-chart-1"
              style={{
                background: "conic-gradient(from 0deg, transparent, black/20, transparent)",
                animation: "spin 12s linear infinite",
              }}
            />

            {/* Inner subtle ring */}
            <div
              className="absolute inset-6 rounded-full border border-chart-2"
              style={{
                background: "conic-gradient(from 180deg, transparent, black/10, transparent)",
                animation: "spin 8s linear infinite reverse",
              }}
            />

            {/* Center calculator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center backdrop-blur-sm">
                <Calculator className="w-6 h-6 text-chart-1" />
              </div>
            </div>

            {/* Floating icons - more subtle positioning */}
            <div className="absolute inset-0" style={{ animation: "spin 20s linear infinite" }}>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 flex items-center justify-center ">
                <TrendingUp className="w-4 h-4 text-chart-2" />
              </div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-chart-2" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8  flex items-center justify-center ">
                <BarChart3 className="w-4 h-4 text-chart-2" />
              </div>
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                <FileText className="w-4 h-4 text-chart-2" />
              </div>
            </div>

            {/* Subtle floating elements */}
            <div
              className="absolute top-8 right-8 w-6 h-6 bg-chart-5 rounded-full flex items-center justify-center opacity-60"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <PieChart className="w-3 h-3 text-chart-2" />
            </div>
            <div
              className="absolute bottom-8 left-8 w-6 h-6 bg-chart-5 not-first:rounded-full flex items-center justify-center opacity-60"
              style={{ animation: "float 4s ease-in-out infinite 2s" }}
            >
              <TrendingUp className="w-3 h-3 text-chart-2" />
            </div>
          </div>

          {/* Minimalist progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3 w-[300px]">
              <span className="text-xs text-chart-2 font-light tracking-wider uppercase">Progress</span>
              <span className="text-sm text-chart-2 font-light">{progress}%</span>
            </div>
            <div className="w-full bg-black/5 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-chart-1 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chart-2 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

          {/* Current task */}
          <div className="text-center">
            <p className="text-chart-2 font-light text-base mb-4 min-h-[24px] transition-all duration-700">
              {tasks[currentTask]}
            </p>
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-chart-2 rounded-full"
                  style={{
                    animation: `pulse 1.5s ease-in-out infinite ${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
