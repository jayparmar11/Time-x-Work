import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Clock from './Clock'

describe('clock component', () => {
  it('renders without crashing', () => {
    render(<Clock />)
    // Check if colons are present
    const colons = screen.getAllByText(':')
    expect(colons.length).toBeGreaterThan(0)
  })

  it('displays the time correctly', () => {
    render(<Clock />)
    // Tabular nums are present for ms
    const msElement = screen.getByText(/\d{2}/)
    expect(msElement).toBeDefined()
  })
})
