import type { Meta, StoryObj } from '@storybook/react'
import { AboutTabs } from './AboutTabs'

const meta: Meta<typeof AboutTabs> = {
  title: 'Features/AboutTabs',
  component: AboutTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AboutTabs>

export const Default: Story = {
  args: {
    skills: ['Logic Pro X', 'Protools', 'Cubase', 'Sibelius'],
    experience: [
      { noOfProjects: '100+ projects', typeOfProject: 'Orchestration' },
      { noOfProjects: '50+ projects', typeOfProject: 'Film Scoring' },
    ],
    education: [
      { titleOfDegree: 'Master of Music', college: 'Berklee College of Music', years: '2018 - 2019' },
    ],
  },
}
