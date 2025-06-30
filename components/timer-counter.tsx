"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface TimeCounterProps {
  startDate: string
}

export function TimeCounter({ startDate }: TimeCounterProps) {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!startDate) return

    const calculateTime = () => {
      if (!startDate) return

      const start = new Date(startDate)
      const now = new Date()

      // Verificar se a data é válida
      if (isNaN(start.getTime())) return

      let years = now.getFullYear() - start.getFullYear()
      let months = now.getMonth() - start.getMonth()
      let days = now.getDate() - start.getDate()

      // Ajustar se os dias são negativos
      if (days < 0) {
        months--
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days += lastMonth.getDate()
      }

      // Ajustar se os meses são negativos
      if (months < 0) {
        years--
        months += 12
      }

      // Calcular horas, minutos e segundos
      const totalMs = now.getTime() - start.getTime()
      const totalSeconds = Math.floor(totalMs / 1000)
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeElapsed({ years, months, days, hours, minutes, seconds })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [startDate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700 rounded-xl p-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-gray-400" />
        <h3 className="text-xl font-bold text-gray-200">Tempo de Experiência</h3>
      </div>

      <p className="text-gray-400 mb-4 text-sm">Criando designs desde 12/04/2024</p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-2xl md:text-3xl font-bold text-gray-200 mb-1">{timeElapsed.years}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {timeElapsed.years === 1 ? "Ano" : "Anos"}
          </div>
        </motion.div>

        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-2xl md:text-3xl font-bold text-gray-200 mb-1">{timeElapsed.months}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {timeElapsed.months === 1 ? "Mês" : "Meses"}
          </div>
        </motion.div>

        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-2xl md:text-3xl font-bold text-gray-200 mb-1">{timeElapsed.days}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">{timeElapsed.days === 1 ? "Dia" : "Dias"}</div>
        </motion.div>

        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-xl md:text-2xl font-bold text-gray-300 mb-1">
            {timeElapsed.hours.toString().padStart(2, "0")}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Horas</div>
        </motion.div>

        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-xl md:text-2xl font-bold text-gray-300 mb-1">
            {timeElapsed.minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Min</div>
        </motion.div>

        <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-xl md:text-2xl font-bold text-gray-300 mb-1">
            {timeElapsed.seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Seg</div>
        </motion.div>
      </div>

      <motion.div
        className="mt-4 text-sm text-gray-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        ⏱️ Cronômetro em tempo real
      </motion.div>
    </motion.div>
  )
}
