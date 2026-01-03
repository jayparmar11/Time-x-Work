import React from 'react'

interface DigitStripProps {
  items: string[] | number[]
  duration: number
  delay: number
  className?: string
  style?: React.CSSProperties
  type: 'roll' | 'step'
  animationName?: string
}

const DigitStrip: React.FC<DigitStripProps> = ({ items, duration, delay, className, style, type, animationName: customName }) => {
  const finalItems = [...items, items[0]]
  const itemCount = items.length
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
          // PERFORMANCE ADDITIONS:
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      >
        {finalItems.map(item => (
          <div key={`${item}`} className="h-[1em] flex items-center justify-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DigitStrip
