'use client'

import { useState } from 'react'
import { urlFor } from '@/sanity/image'
import { cn } from '@/lib/utils'
import { ExternalLink, Film } from 'lucide-react'

interface Project {
  _id: string
  title: string
  category: string
  filterCategory: string
  coverImage?: any
  imdbLink?: string
  releaseYear?: number
}

interface PortfolioGridProps {
  projects: Project[]
}

const CATEGORIES = [
  { label: 'All Projects', value: 'all' },
  { label: 'Orchestrator', value: 'orchestrator' },
  { label: 'Music Producer / Programmer', value: 'programmer' },
  { label: 'Composer', value: 'composer' },
]

export const PortfolioGrid = ({ projects }: PortfolioGridProps) => {
  const [activeTab, setActiveTab] = useState('all')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter((project) => project.filterCategory === activeTab)

  return (
    <div className="space-y-10">
      {/* Category filter buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleTabChange(category.value)}
            className={cn(
              "px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-medium cursor-pointer",
              activeTab === category.value
                ? "bg-teal text-background border-teal shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-foreground hover:border-neutral-700"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Grid layout */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => {
            const imageUrl = project.coverImage ? urlFor(project.coverImage).width(500).url() : null

            return (
              <div
                key={project._id}
                className="group relative overflow-hidden rounded-2xl glass-panel aspect-[2/3] flex flex-col justify-end"
              >
                {/* Image layer */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-50 brightness-[0.85]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900 to-neutral-950" />
                )}

                {/* Hover overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                {/* Card details */}
                <div className="relative p-5 space-y-2 z-10 transition-all duration-300 group-hover:translate-y-[-5px]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-teal px-2 py-0.5 bg-teal/10 border border-teal/20 rounded-md">
                    {project.filterCategory}
                  </span>
                  <h3 className="font-serif text-xl font-bold leading-tight text-white group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {project.category}
                  </p>
                  {project.releaseYear && (
                    <span className="text-[10px] text-neutral-500 block">
                      Released: {project.releaseYear}
                    </span>
                  )}

                  {/* IMDB button */}
                  {project.imdbLink && (
                    <a
                      href={project.imdbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-neutral-900/80 hover:bg-gold hover:text-black border border-neutral-800 text-neutral-300 text-xs font-semibold transition-all duration-300"
                    >
                      <Film className="w-3.5 h-3.5" />
                      View Credits
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
