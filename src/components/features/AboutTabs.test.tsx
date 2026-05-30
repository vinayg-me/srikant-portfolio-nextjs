import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AboutTabs } from './AboutTabs'

describe('AboutTabs', () => {
  const skills = ['React', 'Next.js']
  const experience = [{ noOfProjects: '10+', typeOfProject: 'Scoring' }]
  const education = [{ titleOfDegree: 'B.Mus', college: 'Berklee', years: '2020' }]

  it('renders skills tab content by default', () => {
    render(<AboutTabs skills={skills} experience={experience} education={education} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
  })

  it('switches tabs on click', async () => {
    render(<AboutTabs skills={skills} experience={experience} education={education} />)
    
    const expButton = screen.getByText('Experience')
    fireEvent.click(expButton)
    
    expect(screen.getByText('10+')).toBeInTheDocument()
    expect(screen.getByText('Scoring')).toBeInTheDocument()
  })
})
