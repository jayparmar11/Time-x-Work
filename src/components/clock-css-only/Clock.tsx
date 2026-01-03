import React, { useCallback, useEffect, useState } from 'react'
import DigitStrip from './DigitStrip'

const CLOCK_STYLES = (() => {
  const createKF = (name: string, n: number, duration: number) => {
    const totalItems = n + 1
    const stepPct = 100 / totalItems
    const transDuration = 0.3
    const slidePct = (transDuration / duration) * 100

    let kf = `@keyframes ${name} {\n`
    for (let i = 0; i <= n; i++) {
      const startPct = i * (100 / n)
      const holdEndPct = (i + 1) * (100 / n) - slidePct
      const currentPos = -i * stepPct

      kf += `  ${startPct}% { transform: translate3d(0, ${currentPos}%, 0); }\n`
      if (i < n && holdEndPct > startPct) {
        kf += `  ${holdEndPct}% { transform: translate3d(0, ${currentPos}%, 0); }\n`
      }
    }
    kf += `}\n`
    return kf
  }

  return [
    createKF('roll-sec-ones', 10, 10),
    createKF('roll-sec-tens', 6, 60),
    createKF('roll-min-ones', 10, 600),
    createKF('roll-min-tens', 6, 3600),
    createKF('roll-hours', 24, 86400),
    `@keyframes steps-10 { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(0, -${10 * (100 / 11)}%, 0); } }`,
  ].join('\n')
})()

const Clock: React.FC = () => {
  const calculateOffsets = useCallback(() => {
    const now = new Date()
    const s = now.getSeconds()
    const m = now.getMinutes()
    const h = now.getHours()
    const ms = now.getMilliseconds()

    const totalSecondsInDay = (h * 3600) + (m * 60) + s + (ms / 1000)

    return {
      // Logic: - (Total elapsed time in seconds % length of one full cycle)
      delayHours: -(totalSecondsInDay % 86400),
      delayMinTens: -(totalSecondsInDay % 3600),
      delayMinOnes: -(totalSecondsInDay % 600),
      delaySecTens: -(totalSecondsInDay % 60),
      delaySecOnes: -(totalSecondsInDay % 10),
      startMs: ms,
      key: Date.now(),
    }
  }, [])

  const [offsets, setOffsets] = useState(calculateOffsets)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setOffsets(calculateOffsets())
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [calculateOffsets])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 overflow-hidden select-none">
      <style>{CLOCK_STYLES}</style>
      <div
        key={offsets.key}
        className="flex items-center space-x-2 md:space-x-4 font-mono font-black text-7xl md:text-8xl lg:text-9xl tracking-tighter cursor-default"
      >
        {/* Hours */}
        <DigitStrip
          items={Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))}
          duration={86400}
          delay={offsets.delayHours}
          type="roll"
          className="w-[1.7ch]"
          animationName="roll-hours"
        />

        <span className="opacity-40 pb-4">:</span>

        {/* Minutes */}
        <div className="flex">
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5]}
            duration={3600}
            delay={offsets.delayMinTens}
            type="roll"
            animationName="roll-min-tens"
          />
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={600}
            delay={offsets.delayMinOnes}
            type="roll"
            animationName="roll-min-ones"
          />
        </div>

        <span className="opacity-40 pb-4">:</span>

        {/* Seconds */}
        <div className="flex">
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5]}
            duration={60}
            delay={offsets.delaySecTens}
            type="roll"
            animationName="roll-sec-tens"
          />
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={10}
            delay={offsets.delaySecOnes}
            type="roll"
            animationName="roll-sec-ones"
          />
        </div>

        <span className="opacity-40 pb-4">:</span>

        {/* Milliseconds */}
        <div className="flex tabular-nums">
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={1}
            delay={-(offsets.startMs % 1000) / 1000}
            type="step"
            animationName="steps-10"
          />
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={0.1}
            delay={-(offsets.startMs % 100) / 100}
            type="step"
            animationName="steps-10"
          />
        </div>
      </div>
    </div>
  )
}

export default Clock
