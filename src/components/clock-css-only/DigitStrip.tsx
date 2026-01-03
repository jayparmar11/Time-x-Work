import React from 'react'

interface DigitStripProps {
  items: string[] | number[]
  duration: number // in seconds
  delay: number // in seconds (negative value to start mid-animation)
  className?: string
  style?: React.CSSProperties
  type: 'roll' | 'step'
  animationName?: string
}

const DigitStrip: React.FC<DigitStripProps> = ({ items, duration, delay, className, style, type, animationName: customName }) => {
  const finalItems = [...items, items[0]] // Wrap around
  const itemCount = items.length

  // Choose animation name: custom > generated
  const animationName = customName || (type === 'roll' ? `roll-${itemCount}` : `step-${itemCount}`)

  return (
    <div
      className={`relative overflow-hidden tabular-nums leading-none ${className}`}
      style={{ height: '1em', ...style }}
    >
      <div
        className="flex flex-col items-center w-full"
        style={{
          animationName,
          animationDuration: `${duration}s`,
          animationTimingFunction: type === 'roll' ? 'linear' : `steps(${itemCount})`,
          animationIterationCount: 'infinite',
          animationDelay: `${delay}s`,
        }}
      >
        {finalItems.map(item => (
          <div key={item} className="h-[1em] flex items-center justify-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DigitStrip
