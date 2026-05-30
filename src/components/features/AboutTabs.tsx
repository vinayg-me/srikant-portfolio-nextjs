'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Award, Briefcase, Cpu } from 'lucide-react'

interface ExperienceItem {
  noOfProjects: string
  typeOfProject: string
}

interface EducationItem {
  titleOfDegree: string
  college: string
  years: string
}

interface AboutTabsProps {
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
}

export const AboutTabs = ({ skills, experience, education }: AboutTabsProps) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('skills')

  return (
    <div className="space-y-6">
      {/* Tabs selectors */}
      <div className="flex border-b border-neutral-800/80 overflow-x-auto scrollbar-none w-full">
        <button
          onClick={() => setActiveTab('skills')}
          className={cn(
            "flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 border-b-2 text-xs md:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-300 cursor-pointer flex-1 md:flex-none",
            activeTab === 'skills'
              ? "border-teal text-teal"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          )}
        >
          <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
          Skills & DAWs
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={cn(
            "flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 border-b-2 text-xs md:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-300 cursor-pointer flex-1 md:flex-none",
            activeTab === 'experience'
              ? "border-teal text-teal"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          )}
        >
          <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
          Experience
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={cn(
            "flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 border-b-2 text-xs md:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-300 cursor-pointer flex-1 md:flex-none",
            activeTab === 'education'
              ? "border-teal text-teal"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          )}
        >
          <Award className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
          Education
        </button>
      </div>

      {/* Tabs Content */}
      <div className="min-h-[200px]">
        {activeTab === 'skills' && (
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experience.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-800/40 bg-neutral-950/20 flex flex-col justify-center"
              >
                <span className="text-gold font-bold text-lg">{item.noOfProjects}</span>
                <span className="text-neutral-400 text-xs uppercase tracking-wider mt-1">
                  {item.typeOfProject}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-4">
            {education.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-800/40 bg-neutral-950/20 space-y-1"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-white font-semibold text-sm">{item.titleOfDegree}</h4>
                  <span className="text-[10px] text-teal border border-teal/20 px-2 py-0.5 bg-teal/5 rounded-md shrink-0">
                    {item.years}
                  </span>
                </div>
                <p className="text-neutral-400 text-xs">{item.college}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
