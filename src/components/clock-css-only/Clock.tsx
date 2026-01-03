import React, { useMemo } from 'react'
import DigitStrip from './DigitStrip'

// Fixed Keyframes for our specific clock columns
// Column | Range | Duration | SlideTime | Slide%
// SecOnes| 0-9   | 10s      | 0.5s      | 5%
// SecTens| 0-5   | 60s      | 0.5s      | 0.833%
// MinOnes| 0-9   | 600s     | 0.5s      | 0.083%
// MinTens| 0-5   | 3600s    | 0.5s      | 0.0138%
// Hours  | 0-23  | 86400s   | 0.5s      | ...

function generateStyles() {
  const createKF = (name: string, n: number, duration: number) => {
    // DigitStrip adds one item (wrap), so total items = n + 1
    const totalItems = n + 1
    const stepPct = 100 / totalItems

    // Transition time is fixed 300ms = 0.3s
    const transDuration = 0.3
    // Calculate transition percentage of total cycle
    const slidePct = (transDuration / duration) * 100

    let kf = `@keyframes ${name} {\n`
    for (let i = 0; i < n; i++) {
      // Current Step Times
      const startPct = i * (100 / n)
      const nextStartPct = (i + 1) * (100 / n)

      // We want to hold 'i' until 'transDuration' before 'nextStartPct'
      const holdEndPct = nextStartPct - slidePct

      // Position at i
      const currentPos = -i * stepPct
      // Position at i+1
      const nextPos = -(i + 1) * stepPct

      // 1. Start of step: Ensure we are at currentPos
      kf += `  ${startPct}% { transform: translateY(${currentPos}%); }\n`

      // 2. End of Hold: Stay at currentPos
      // Make sure holdEndPct > startPct to avoid glitch if duration is super short (unlikely here)
      if (holdEndPct > startPct) {
        kf += `  ${holdEndPct}% { transform: translateY(${currentPos}%); }\n`
      }

      // 3. End of Slide / Start of Next: Arrive at nextPos
      kf += `  ${nextStartPct}% { transform: translateY(${nextPos}%); }\n`
    }
    // Loop fix: Last keyframe target (N) wraps to 0 visually.
    // -n * stepPct is the N-th item (which is '0').
    kf += `  100% { transform: translateY(-${n * stepPct}%); }\n`
    kf += `}\n`
    return kf
  }

  // SecOnes: N=10, 10s duration
  const secOnes = createKF('roll-sec-ones', 10, 10)
  // SecTens: N=6, 60s duration
  const secTens = createKF('roll-sec-tens', 6, 60)
  // MinOnes: N=10, 600s duration
  const minOnes = createKF('roll-min-ones', 10, 600)
  // MinTens: N=6, 3600s duration
  const minTens = createKF('roll-min-tens', 6, 3600)
  // Hours: N=24, 86400s duration
  const hours = createKF('roll-hours', 24, 86400)

  // Milliseconds steps.
  // Items 0..9 then wrap 0. Total 11.
  const stepDest = 10 * (100 / 11)
  const steps10 = `@keyframes steps-10 { from { transform: translateY(0); } to { transform: translateY(-${stepDest}%); } }`

  return [secOnes, secTens, minOnes, minTens, hours, steps10].join('\n')
}

const Clock: React.FC = () => {
  const now = useMemo(() => new Date(), [])
  // Calculate offsets
  // We need the animation to be at the correct position NOW.
  // delay = -1 * (current_progress_in_cycle)

  // Seconds Ones: Cycle 10s. Progress = (s % 10) + ms/1000.
  const startS = now.getSeconds()
  const startM = now.getMinutes()
  const startH = now.getHours()
  const startMs = now.getMilliseconds()

  const totalSeconds = startS + startMs / 1000
  const totalMinutes = startM + totalSeconds / 60
  const totalHours = startH + totalMinutes / 60

  // Delays
  // SecOnes (10s): - (totalSeconds % 10)
  const delaySecOnes = -(totalSeconds % 10)
  // SecTens (60s): - (totalSeconds % 60)
  const delaySecTens = -(totalSeconds % 60)
  // MinOnes (600s): - (totalMinutes % 10) * 60 ?? No.
  // Cycle is 600s (10 min). Position depends on totalSeconds.
  // Progress = (totalMinutes * 60) % 600 = totalSeconds % 600.
  const delayMinOnes = -(totalSeconds % 600)
  // MinTens (3600s):
  const delayMinTens = -(totalSeconds % 3600)

  // Hours (24h = 86400s)
  const delayHours = -(totalHours * 3600) // totalHours is decimal hours. *3600 = seconds.

  // Milliseconds
  // Fast strip (Ones - 0.01s cycle? Too fast/blur. Usually just Tens/Hundreds displayed?)
  // Original Clock: 2 digits.
  // `ms = Math.floor(time.getMilliseconds() / 10)` -> 00 to 99.
  // So we display Centiseconds (10ms resolution).
  // Tens (0-9). Frequency 0.1s. Cycle 1s.
  // Ones (0-9). Frequency 0.01s. Cycle 0.1s.

  // MS Tens (0-9) cycle 1s.
  // const delayMsTens = -(startMs / 1000) // 0 to 0.999s
  // MS Ones (0-9) cycle 0.1s (100ms).
  // We want to map e.g. 23ms -> 0.023s (which is 23% of 0.1s cycle? No)
  // 0.1s cycle. 0-9 digits.
  // Digit 2 applies for 20-29ms.
  // 20ms = 0.02s.
  // 0.02s in 0.1s cycle is 20%. Matches.
  // So delay should be -(startMs % 100) / 1000
  // const delayMsOnes = -(startMs % 100) / 1000

  const styles = generateStyles()

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 overflow-hidden">
      <style>{styles}</style>
      <div className="flex items-center space-x-2 md:space-x-4 font-mono font-black text-7xl md:text-8xl lg:text-9xl tracking-tighter cursor-default select-none">
        {/* Hours: 00-23 */}
        <DigitStrip
          items={Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))}
          duration={86400}
          delay={delayHours}
          type="roll"
          className="w-[1.7ch]" // Fixed width for 2 digits
          animationName="roll-hours"
        />

        <span className="opacity-40 pb-4">:</span>

        {/* Minutes: Tens Ones */}
        <div className="flex">
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5]}
            duration={3600}
            delay={delayMinTens}
            type="roll"
            animationName="roll-min-tens"
          />
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={600}
            delay={delayMinOnes}
            type="roll"
            animationName="roll-min-ones"
          />
        </div>

        <span className="opacity-40 pb-4">:</span>

        {/* Seconds: Tens Ones */}
        <div className="flex">
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5]}
            duration={60}
            delay={delaySecTens}
            type="roll"
            animationName="roll-sec-tens"
          />
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={10}
            delay={delaySecOnes}
            type="roll"
            animationName="roll-sec-ones"
          />
        </div>

        <span className="opacity-40 pb-4">:</span>

        {/* Milliseconds: 2 digits. Static steps. */}
        <div className="flex tabular-nums">
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={1}
            delay={-(startMs % 1000) / 1000}
            type="step"
            animationName="steps-10"
          />
          <DigitStrip
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            duration={0.1}
            delay={-(startMs % 100) / 100}
            type="step"
            animationName="steps-10"
          />
        </div>
      </div>
    </div>
  )
}

export default Clock
