'use client'

import { useState } from 'react'
import { urlFor } from '@/sanity/image'
import { cn } from '@/lib/utils'
import { ExternalLink, Film } from 'lucide-react'
import Image from 'next/image'

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

            const displayFilter = project.filterCategory === 'programmer'
              ? 'Producer / Programmer'
              : project.filterCategory.charAt(0).toUpperCase() + project.filterCategory.slice(1)

            return (
              <div
                key={project._id}
                className="group relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-900/60 aspect-[2/3] flex flex-col justify-end transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]"
              >
                {/* Floating category badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] uppercase tracking-widest font-semibold text-teal-300 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-teal-500/30 rounded-full">
                    {displayFilter}
                  </span>
                </div>

                {/* Image layer */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${project.title} Project Cover`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-50 brightness-[0.75]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900 to-neutral-950" />
                )}

                {/* Hover overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Card details */}
                <div className="relative p-6 space-y-2.5 z-10 transition-all duration-500 group-hover:translate-y-[-4px]">
                  {project.releaseYear && (
                    <span className="text-[10px] text-gold/60 uppercase tracking-widest font-medium block">
                      Released: {project.releaseYear}
                    </span>
                  )}
                  <h3 className="font-serif text-lg md:text-xl font-bold leading-tight text-white group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2">
                    {project.category}
                  </p>

                  {/* IMDB button / Link */}
                  {project.imdbLink && (
                    <a
                      href={project.imdbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal hover:text-gold transition-colors duration-300 pt-2"
                    >
                      <Film className="w-3.5 h-3.5" />
                      View Credits
                      <ExternalLink className="w-3 h-3 opacity-60" />
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
