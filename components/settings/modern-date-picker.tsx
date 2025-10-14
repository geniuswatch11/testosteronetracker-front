"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModernDatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label: string
}

export default function ModernDatePicker({ value, onChange, label }: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value)

  useEffect(() => {
    setSelectedDate(value)
    if (value) {
      setCurrentMonth(new Date(value))
    }
  }, [value])

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value)
    setCurrentMonth(new Date(newYear, currentMonth.getMonth()))
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
    onChange(newDate)
    setIsOpen(false)
  }

  // Generar lista de años (desde 1900 hasta el año actual)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year)
    }
    return years
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Pick a date"
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  const renderCalendar = () => {
    const days = []
    const totalDays = daysInMonth(currentMonth)
    const startDay = firstDayOfMonth(currentMonth)

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const today = isToday(day)
      const selected = isSelected(day)
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            selected
              ? "bg-primary-600 text-black"
              : today
              ? "bg-neutral-700 text-white"
              : "text-white hover:bg-neutral-700"
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className="relative">
      <label className="text-sm font-medium text-neutral-300 block mb-1">{label}</label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
      >
        <span className={selectedDate ? "text-white" : "text-neutral-400"}>
          {formatDate(selectedDate)}
        </span>
        <Calendar className="h-5 w-5 text-neutral-400" />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar */}
          <div className="absolute z-50 mt-2 w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl p-4">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                
                <div className="text-white font-semibold">
                  {months[currentMonth.getMonth()]}
                </div>
                
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
              
              {/* Year Selector */}
              <select
                value={currentMonth.getFullYear()}
                onChange={handleYearChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-primary-600"
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-neutral-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-neutral-700 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-neutral-700 text-white hover:bg-neutral-800"
                onClick={() => {
                  setSelectedDate(null)
                  onChange(null)
                  setIsOpen(false)
                }}
              >
                Clear
              </Button>
              <Button
                type="button"
                className="flex-1 bg-primary-600 hover:bg-primary-500 text-black"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
