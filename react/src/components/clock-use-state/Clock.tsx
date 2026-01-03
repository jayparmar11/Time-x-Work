import React, { useEffect, useState } from 'react'
import RollingDigit from './RollingDigit'

const Clock: React.FC = () => {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 10)
    return () => clearInterval(interval)
  }, [])

  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  const ss = time.getSeconds().toString().padStart(2, '0')
  const ms = Math.floor(time.getMilliseconds() / 10).toString().padStart(2, '0')

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="flex items-center space-x-2 md:space-x-4 font-mono font-black text-7xl md:text-8xl lg:text-9xl tracking-tighter">
        <div className="flex">
          <RollingDigit value={Number.parseInt(hh[0], 10)} max={2} />
          <RollingDigit value={Number.parseInt(hh[1], 10)} />
        </div>
        <span className="opacity-40">:</span>
        <div className="flex">
          <RollingDigit value={Number.parseInt(mm[0], 10)} max={5} />
          <RollingDigit value={Number.parseInt(mm[1], 10)} />
        </div>
        <span className="opacity-40">:</span>
        <div className="flex">
          <RollingDigit value={Number.parseInt(ss[0], 10)} max={5} />
          <RollingDigit value={Number.parseInt(ss[1], 10)} />
        </div>
        <span className="opacity-40">:</span>
        <div className="tabular-nums">
          {ms}
        </div>
      </div>
    </div>
  )
}

export default Clock
