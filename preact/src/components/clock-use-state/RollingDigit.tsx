import React from 'react'

interface RollingDigitProps {
  value: number
  max?: number
}

const RollingDigit: React.FC<RollingDigitProps> = ({ value, max = 9 }) => {
  const items = Array.from({ length: max + 1 }, (_, i) => i)

  return (
    <div className="relative h-[1.1em] overflow-hidden tabular-nums leading-none">
      <div
        className="flex flex-col items-center transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateY(-${(value / items.length) * 100}%)`,
        }}
      >
        {items.map(digit => (
          <div key={digit} className="h-[1.1em] flex items-center justify-center">
            {digit}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RollingDigit
